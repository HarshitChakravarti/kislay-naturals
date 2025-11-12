'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Home, Clock, Truck, Gift, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

interface NotificationStatus {
  orderId: string;
  orderNumber?: string | null;
  email: {
    sent: boolean;
    error: string | null;
    errorType: string | null;
    shouldRetry: boolean;
    address: string;
  };
  whatsapp: {
    sent: boolean;
    error: string | null;
    link: string | null;
    messageId: string | null;
    phone: string;
  };
  sentAt: string | null;
  userName?: string | null;
  shippingAddress?: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
  paidAt?: string | null;
  createdAt?: string | null;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus | null>(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    setOrderId(orderIdParam);
  }, [searchParams]);

  // Fetch notification status when orderId is available
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      if (!orderId) return;
      
      setIsLoadingNotifications(true);
      try {
        const response = await fetch(`/api/orders/notification-status?orderId=${orderId}`);
        const result = await response.json();
        
        if (result.success) {
          setNotificationStatus(result.data);
        } else {
          console.error('Failed to fetch notification status:', result.message);
        }
      } catch (error) {
        console.error('Error fetching notification status:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotificationStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-green-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${yeseva_One.className}`}>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                ORDER CONFIRMED!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Thank you for choosing Kislay Naturals! Your order has been successfully placed and is being processed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className={`text-2xl font-bold text-white ${yeseva_One.className}`}>
                  Delivery Details
                </h2>
                <p className="text-green-100">Your order has been confirmed</p>
              </div>

              {/* Delivery details content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Recipient</p>
                    <p className="text-lg font-semibold text-gray-900">{notificationStatus?.userName || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Expected Delivery</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(() => {
                        const baseDate = notificationStatus?.paidAt || notificationStatus?.createdAt || null;
                        if (!baseDate) return '—';
                        const d = new Date(baseDate);
                        d.setDate(d.getDate() + 7);
                        return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
                      })()}
                    </p>
                    {/* removed helper line per design request */}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {notificationStatus?.shippingAddress?.street || '—'}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {[notificationStatus?.shippingAddress?.city, notificationStatus?.shippingAddress?.state]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{notificationStatus?.shippingAddress?.zip || ''}</p>
                </div>

                {/* Key order progress items (compact) */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-7 h-7 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                        <p className="text-sm text-gray-600">Payment received and verified</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-7 h-7 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Processing</h3>
                        <p className="text-sm text-gray-600">Preparing your order for shipment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Truck className="w-7 h-7 text-gray-500 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Shipping</h3>
                        <p className="text-sm text-gray-600">Dispatch in 24–48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            {/* Continue Shopping Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-6">
                <Gift className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className={`text-xl font-bold text-gray-900 ${yeseva_One.className}`}>
                  Keep Shopping
                </h3>
                <p className="text-gray-600 text-sm">Discover more natural products</p>
              </div>
              
              <Link
                href="/products"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-6">
                <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className={`text-xl font-bold text-gray-900 ${yeseva_One.className}`}>
                  Need Help?
                </h3>
                <p className="text-gray-600 text-sm">We&apos;re here to assist you</p>
              </div>
              
              <div className="space-y-3">
                <a 
                  href="/contact-us"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Phone className="w-5 h-5" />
                  <span className="flex-grow text-center">Contact Us</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
