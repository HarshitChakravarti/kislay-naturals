'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Home, Mail, MessageCircle, Clock, Truck, Gift, Phone, ExternalLink } from 'lucide-react';
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

        {/* Notification Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className={`text-xl font-bold text-gray-900 ${yeseva_One.className}`}>
                Confirmation Status
              </h3>
              <p className="text-gray-600 text-sm">We&apos;ve sent you order confirmations via multiple channels</p>
            </div>

            <div className="p-6">
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Checking notification status...</span>
                </div>
              ) : notificationStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Status */}
                  <div className={`rounded-xl p-6 border-2 ${
                    notificationStatus.email.sent 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notificationStatus.email.sent ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Mail className={`w-6 h-6 ${
                          notificationStatus.email.sent ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          notificationStatus.email.sent ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Email {notificationStatus.email.sent ? 'Sent' : 'Failed'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notificationStatus.email.address}
                        </p>
                      </div>
                    </div>
                    
                    {!notificationStatus.email.sent && notificationStatus.email.error && (
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <p className="text-sm text-red-700 font-medium">Error Details:</p>
                        <p className="text-xs text-red-600 mt-1">{notificationStatus.email.error}</p>
                        {notificationStatus.email.errorType === 'invalid_email' && (
                          <p className="text-xs text-red-600 mt-2">
                            ⚠️ Please check your email address for typos
                          </p>
                        )}
                      </div>
                    )}
                    
                    {!notificationStatus.email.sent && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageCircle className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-800 font-medium">Don&apos;t worry!</p>
                            <p className="text-xs text-blue-700 mt-1">
                              If you didn&apos;t receive the email, we&apos;ll contact you soon through WhatsApp or phone to confirm your order details.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Status */}
                  <div className={`rounded-xl p-6 border-2 ${
                    notificationStatus.whatsapp.sent 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notificationStatus.whatsapp.sent ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <MessageCircle className={`w-6 h-6 ${
                          notificationStatus.whatsapp.sent ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          notificationStatus.whatsapp.sent ? 'text-green-800' : 'text-red-800'
                        }`}>
                          WhatsApp {notificationStatus.whatsapp.sent 
                            ? (notificationStatus.whatsapp.messageId ? 'Sent' : 'Generated') 
                            : 'Failed'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notificationStatus.whatsapp.phone}
                        </p>
                      </div>
                    </div>
                    
                    {notificationStatus.whatsapp.sent && notificationStatus.whatsapp.link && (
                      <a 
                        href={notificationStatus.whatsapp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Open WhatsApp Message</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    
                    {!notificationStatus.whatsapp.sent && notificationStatus.whatsapp.error && (
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <p className="text-sm text-red-700 font-medium">Error Details:</p>
                        <p className="text-xs text-red-600 mt-1">{notificationStatus.whatsapp.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Notification Status Unknown</h4>
                  <p className="text-gray-600 text-sm">
                    Unable to check notification status. Please contact support if you don&apos;t receive confirmation.
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• You&apos;ll receive detailed order information via email</li>
                      <li>• Tracking updates will be sent as your order progresses</li>
                      <li>• Our team will contact you if any clarification is needed</li>
                      <li>• Expected delivery: 3-5 business days</li>
                    </ul>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">💬 Don&apos;t worry if you don&apos;t receive the email!</span> We&apos;ll reach out to you via WhatsApp or phone to confirm your order details and keep you updated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
