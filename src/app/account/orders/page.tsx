'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number?: string;
  user_name: string;
  user_email: string;
  user_mobile: string;
  product_name?: string;
  unit_price?: number;
  quantity?: number;
  items_price: number;
  tax_price: number;
  shipping_price: number;
  total_price: number;
  total_amount?: number;
  shipping_street?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_info?: any;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  payment_info?: any;
  status: string;
  order_status: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  payload?: any;
  items?: OrderItem[];
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/my');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'paid':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the effect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your order history</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.order_status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.order_number || order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatPrice(order.total_price)}</p>
                      <p className="text-sm text-gray-500">{order.quantity || 1} item{(order.quantity || 1) > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Product
                      </h4>
                      <div className="space-y-2">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.product_name}</p>
                            <p className="text-sm text-gray-500">Qty: {order.quantity} × {formatPrice(order.unit_price || 0)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {(order.shipping_street || order.shipping_city) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shipping_street}</p>
                          <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Info */}
                    {order.razorpay_payment_id && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Payment
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>Payment ID: {order.razorpay_payment_id.slice(-8)}</p>
                          <p>Paid on: {order.paid_at ? formatDate(order.paid_at) : 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-600">Items: {formatPrice(order.items_price)}</p>
                        <p className="text-gray-600">Tax: {formatPrice(order.tax_price)}</p>
                        <p className="text-gray-600">Shipping: {formatPrice(order.shipping_price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">Total: {formatPrice(order.total_price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Order Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">Order placed on {formatDate(order.created_at)}</span>
                      </div>
                      {order.paid_at && (
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Payment confirmed on {formatDate(order.paid_at)}</span>
                        </div>
                      )}
                      {order.shipped_at && (
                        <div className="flex items-center space-x-3">
                          <Truck className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">Shipped on {formatDate(order.shipped_at)}</span>
                        </div>
                      )}
                      {order.delivered_at && (
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Delivered on {formatDate(order.delivered_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
