'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { generateWhatsAppMessage, generateWhatsAppLink } from '@/lib/whatsapp-client';

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant_size?: string;
  products?: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

interface Order {
  id: string;
  order_number?: string;
  user_name: string;
  user_email: string;
  user_mobile: string;
  total_amount: number;
  items_price: number;
  tax_price: number;
  shipping_price: number;
  order_status: string;
  status: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_info: any;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  created_at: string;
  updated_at: string;
  paid_at: string;
  shipped_at: string;
  delivered_at: string;
  notes: string;
  payload?: {
    couponCode?: string;
    couponDiscount?: number;
    originalPrice?: number;
    discountedPrice?: number;
  };
  user_profiles?: {
    username: string;
    full_name: string;
    phone: string;
  };
  order_items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [removing, setRemoving] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        setNewStatus(data.data.order_status);
        
        // Generate WhatsApp message and link
        if (data.data) {
          const orderData = data.data;
          const whatsappData = {
            customerName: orderData.user_name || orderData.user_profiles?.full_name || 'Customer',
            customerPhone: orderData.user_mobile || orderData.user_profiles?.phone || '',
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            orderItems: (orderData.order_items || []).map((item: OrderItem) => ({
              name: item.name || item.products?.name || 'Product',
              quantity: item.quantity || 1,
              price: item.price || item.products?.price || 0,
            })),
            totalAmount: orderData.total_amount || 0,
            orderDate: new Date(orderData.created_at).toLocaleDateString('en-IN'),
            shippingAddress: orderData.shipping_street ? {
              street: orderData.shipping_street,
              city: orderData.shipping_city || '',
              state: orderData.shipping_state || '',
              zip: orderData.shipping_zip || '',
            } : undefined,
          };
          
          const message = generateWhatsAppMessage(whatsappData);
          const link = generateWhatsAppLink(whatsappData);
          setWhatsappMessage(message);
          setWhatsappLink(link);
        }
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('Failed to fetch order details');
      console.error('Order fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  const formatShortOrderId = (id: string) => {
    if (!id) return '#—';
    const core = String(id).replace(/[^a-zA-Z0-9]/g, '');
    return `#${core.slice(-8).toLowerCase()}`;
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.order_status) return;

    try {
      setUpdating(true);
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        // Show success message (you could use a toast library here)
        alert('Order status updated successfully!');
      } else {
        setError(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove this order?\n\nOrder Number: ${order.order_number || formatShortOrderId(order.id)}\nCustomer: ${order.user_name}\nAmount: ₹${order.total_amount}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setRemoving(true);
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Order removed successfully!');
        router.push('/admin/orders');
      } else {
        setError(data.message || 'Failed to remove order');
      }
    } catch (err) {
      setError('Failed to remove order');
      console.error('Remove order error:', err);
    } finally {
      setRemoving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { color: 'bg-gray-100 text-gray-800', label: 'Created' },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Paid' },
      processing: { color: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.created;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = whatsappMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Link href="/admin/orders" className="mt-2 inline-block text-sm text-red-600 hover:text-red-800">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
        <p className="mt-2 text-gray-500">The order you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm text-green-600 hover:text-green-800">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Order {order.order_number || formatShortOrderId(order.id)}</h1>
          <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">Order placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="text-left lg:text-right">
          <div className="text-sm text-gray-500">Current Status</div>
          <div className="mt-1">{getStatusBadge(order.order_status)}</div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Update Order Status</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="block w-full sm:w-40 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || newStatus === order.order_status}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4">Customer Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">
                {order.user_name || order.user_profiles?.full_name || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{order.user_email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">
                {order.user_mobile || order.user_profiles?.phone || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-900">
            <div>{order.shipping_street || 'N/A'}</div>
            <div>
              {order.shipping_city || 'N/A'}, {order.shipping_state || 'N/A'} {order.shipping_zip || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        {/* Desktop table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.order_items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      {item.variant_size && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {item.variant_size}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {order.order_items?.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    {item.variant_size && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {item.variant_size}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-700">₹{item.price.toFixed(2)}</div>
                  <div className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-500">Items Total</dt>
            <dd className="text-sm text-gray-900">₹{order.items_price.toFixed(2)}</dd>
          </div>
          
          {/* Coupon Discount Section */}
          {order.payload?.couponCode && order.payload?.couponDiscount && order.payload.couponDiscount > 0 && (
            <div className="flex justify-between">
              <dt className="text-sm text-green-600">
                Coupon Discount ({order.payload.couponCode})
              </dt>
              <dd className="text-sm text-green-600">
                -₹{order.payload.couponDiscount.toFixed(2)}
              </dd>
            </div>
          )}
          
          <div className="flex justify-between">
            <dt className="text-sm text-gray-500">Tax</dt>
            <dd className="text-sm text-gray-900">₹{order.tax_price.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-500">Shipping</dt>
            <dd className="text-sm text-gray-900">₹{order.shipping_price.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <dt className="text-base font-medium text-gray-900">Total</dt>
            <dd className="text-base font-medium text-gray-900">₹{order.total_amount.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      {/* Customer Notifications */}
      {order.user_mobile || order.user_profiles?.phone ? (
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Customer Notifications</h2>
          
          {/* Customer Phone Number */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Customer Phone Number</div>
            <div className="text-sm text-gray-900 mt-1">
              {order.user_mobile || order.user_profiles?.phone || 'N/A'}
            </div>
          </div>

          {/* One-Click WhatsApp Button */}
          <div className="mb-6">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Send WhatsApp Confirmation
            </a>
          </div>

          {/* Copyable Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Pre-generated Message</label>
              <button
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Message
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans overflow-x-auto">
                {whatsappMessage || 'Generating message...'}
              </pre>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This is a fallback in case the WhatsApp link doesn&apos;t work. You can copy and paste this message manually.
            </p>
          </div>
        </div>
      ) : null}

      {/* Payment Information */}
      {order.razorpay_payment_id && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
              <dd className="text-sm text-gray-900 font-mono break-all">{order.razorpay_payment_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Order ID</dt>
              <dd className="text-sm text-gray-900 font-mono break-all">{order.razorpay_order_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Paid At</dt>
              <dd className="text-sm text-gray-900">{formatDate(order.paid_at)}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h2>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Danger Zone - Remove Order */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-red-500">
        <h2 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Permanently remove this order from the system. This action cannot be undone.
            </p>
            <p className="text-xs text-gray-500">
              Order Number: {order.order_number || formatShortOrderId(order.id)} • Customer: {order.user_name} • Amount: ₹{order.total_amount}
            </p>
          </div>
          <button
            onClick={handleRemoveOrder}
            disabled={removing}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {removing ? 'Removing...' : 'Remove Order'}
          </button>
        </div>
      </div>
    </div>
  );
}