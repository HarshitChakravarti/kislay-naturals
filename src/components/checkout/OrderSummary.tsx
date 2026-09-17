import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';

interface OrderSummaryProps {
  isCartCheckout: boolean;
  cartItems: any[];
  product: Product | null;
  variantSize: string;
  quantity: number;
  handleQuantityChange: (q: number) => void;
  errors: Record<string, string>;
  
  originalPrice: number;
  kislayDiscount: number;
  couponApplied: boolean;
  couponCode: string;
  couponDiscount: number;
  finalTotal: number;

  isProcessingPayment: boolean;
  isPaymentCompleted: boolean;
  paymentStep: string;
  handlePayment: () => void;

  couponSection: React.ReactNode;
}

export default function OrderSummary({
  isCartCheckout,
  cartItems,
  product,
  variantSize,
  quantity,
  handleQuantityChange,
  errors,
  originalPrice,
  kislayDiscount,
  couponApplied,
  couponCode,
  couponDiscount,
  finalTotal,
  isProcessingPayment,
  isPaymentCompleted,
  paymentStep,
  handlePayment,
  couponSection
}: OrderSummaryProps) {
  const totalItemsCount = isCartCheckout
    ? cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)
    : quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
        Order Summary
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''})
        </span>
      </h2>

      {/* Product Details */}
      {isCartCheckout ? (
        <div className="space-y-4 mb-6">
          {cartItems.map((item: any, idx: number) => (
            <div key={idx} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                <Image
                  src={item.image || "/sweetener-drops/10ml.png"}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">{item.name}</h3>
                {item.variantSize && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                      {item.variantSize}
                    </span>
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-medium text-green-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={product?.image || "/sweetener-drops/10ml.png"}
              alt={product?.name || 'Product'}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm leading-tight">{product?.name}</h3>
            
            {/* Variant Size Display */}
            {variantSize && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {variantSize}
                </span>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mt-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className={`flex items-center border rounded-lg ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <button
                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <motion.span 
                    key={quantity}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    onClick={() => handleQuantityChange(Math.max(100, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= 100}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Coupon Code Section */}
      {couponSection}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        {/*
          PRE-LAUNCH TEMPORARY: Individual item value breakdown for the Seabuckthorn Pulp bundle.
          TODO: Remove this block when Kislay Seabuckthorn Pulp is officially launched
          as a standalone product.
          Product ID to match: 46e01087-7c08-418e-8b53-9b7c071ad388
        */}
        {!isCartCheckout && product?.id === '46e01087-7c08-418e-8b53-9b7c071ad388' && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kislay Seabuckthorn Pulp</span>
              <span className="text-gray-900">₹1199.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kislay Monk Fruit Sweetener Drops</span>
              <span className="text-gray-900">₹399.00</span>
            </div>
          </>
        )}
        {/* END PRE-LAUNCH TEMPORARY */}

        {/* Original MRP */}
        <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
          <span className="text-gray-600">MRP</span>
          <span className="text-gray-900 font-medium">₹{originalPrice.toFixed(2)}</span>
        </div>

        {/* Kislay Naturals discount */}
        {kislayDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-700">Kislay Discount</span>
            <span className="text-green-700">-₹{kislayDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Coupon discount, if any */}
        {couponApplied && couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              Special Discount ({couponCode.toUpperCase()})
            </span>
            <span className="text-green-600">-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>

        {/* Final payable amount */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Final Amount Payable</span>
            <motion.span
              key={finalTotal}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-green-600"
            >
              ₹{finalTotal.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessingPayment}
        className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
          isPaymentCompleted 
            ? 'bg-green-500 text-white' 
            : isProcessingPayment 
            ? 'bg-gray-400 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isPaymentCompleted ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span>{paymentStep || 'Payment Successful! Redirecting...'}</span>
          </>
        ) : isProcessingPayment ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span>{paymentStep || 'Processing...'}</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Proceed to Payment</span>
          </>
        )}
      </button>

      {/* Payment Methods */}
      <div className="mt-6 flex flex-col items-center">
        <span className="text-[11px] text-gray-500 mb-2 uppercase tracking-wide">Accepted payment methods</span>
        <div className="flex flex-wrap justify-center gap-2">
          {/* UPI */}
          <div className="bg-white border border-gray-200 rounded-[4px] px-[10px] py-[6px] flex items-center justify-center h-[36px]">
            <span className="text-gray-800 font-bold text-sm tracking-wider">UPI</span>
          </div>
          {/* Visa */}
          <div className="bg-white border border-gray-200 rounded-[4px] px-[10px] py-[6px] flex items-center justify-center h-[36px]">
            <span className="text-[#1434CB] font-bold text-sm tracking-wider italic">VISA</span>
          </div>
          {/* Mastercard */}
          <div className="bg-white border border-gray-200 rounded-[4px] px-[10px] py-[6px] flex items-center justify-center h-[36px]">
            <div className="flex items-center -space-x-2">
              <div className="w-[18px] h-[18px] rounded-full bg-[#EB001B] opacity-90"></div>
              <div className="w-[18px] h-[18px] rounded-full bg-[#F79E1B] opacity-90"></div>
            </div>
          </div>
          {/* RuPay */}
          <div className="bg-white border border-gray-200 rounded-[4px] px-[10px] py-[6px] flex items-center justify-center h-[36px]">
            <span className="text-[#F26522] font-bold text-sm italic">RuPay</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </motion.div>
  );
}
