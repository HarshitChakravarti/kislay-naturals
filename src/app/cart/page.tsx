'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { selectCartItems, selectCartSubtotal, addToCart, removeFromCart } from '@/store/slices/cartSlice';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const cartSubtotal = useSelector(selectCartSubtotal);

  const handleQuantityChange = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(addToCart({ ...item, quantity: newQuantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-green-700 text-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/products" 
              className="flex items-center text-white hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 text-green-600" />
              Shopping Cart
            </h1>

            {cartItems.map((item: any) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/sweetener-drops/10ml.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.name}</h3>
                        <button
                          onClick={() => handleRemove(item.product)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {item.variantSize && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.variantSize}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-2 sm:px-3 hover:bg-gray-100 rounded-l-lg transition-colors text-gray-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-2 sm:px-3 hover:bg-gray-100 rounded-r-lg transition-colors text-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">₹{item.price?.toFixed(2)} each</div>
                        <div className="text-lg font-bold text-green-700">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)} items)</span>
                  <span className="text-gray-900 font-medium">₹{cartSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-700">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout?fromCart=true')}
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-2">
                <span>Secure Checkout</span>
                <span>•</span>
                <span>Free Shipping in India</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
