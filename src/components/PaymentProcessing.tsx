'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2, CreditCard, Shield, Truck } from 'lucide-react';

interface PaymentProcessingProps {
  orderId?: string | null;
  orderNumber?: string | null;
  isProcessing?: boolean;
  isLoadingOrderNumber?: boolean;
}

export default function PaymentProcessing({ orderId, orderNumber, isProcessing = true, isLoadingOrderNumber = false }: PaymentProcessingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed and is being processed.
            </p>
          </motion.div>

          {/* Processing Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment Verified</p>
                <p className="text-sm text-gray-600">Your payment has been processed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Processing</p>
                <p className="text-sm text-gray-600">
                  {isProcessing ? 'Preparing your order...' : 'Order confirmed'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Shipping</p>
                <p className="text-sm text-gray-600">Will dispatch in 24-48 hours</p>
              </div>
            </div>
          </motion.div>

          {/* Order Number */}
          {(orderNumber || orderId) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono text-lg font-bold text-gray-900">
                {orderNumber ? orderNumber : (
                  <span className="flex items-center space-x-2">
                    <span>Loading...</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* Loading Animation */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center space-x-2 text-gray-600"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Finalizing your order...</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
