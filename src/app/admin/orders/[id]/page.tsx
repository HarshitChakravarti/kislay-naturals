'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
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

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        setNewStatus(data.data.order_status);
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
            className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
          <h2 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
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
          <h2 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
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
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
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
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
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
    </div>
  );
}