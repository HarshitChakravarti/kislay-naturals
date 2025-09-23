'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

export default function CheckoutModal({ isOpen, onClose, product, quantity }: CheckoutModalProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('');

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
      
      // Cleanup function to restore scroll when component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Populate form with user data when authenticated
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Note: mobile and address would need to be stored in user profile
      // For now, we'll leave them empty for the user to fill
    }
  }, [user, isOpen]);

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessingPayment(false);
      setPaymentStep('');
    }
  }, [isOpen]);

  // Handle authentication requirement
  const handleLoginRedirect = () => {
    setIsRedirecting(true);
    // Store the current product info in localStorage to return after login
    localStorage.setItem('pendingOrder', JSON.stringify({
      productId: product.id,
      quantity: quantity,
      returnUrl: window.location.pathname
    }));
    router.push('/login');
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = 'Invalid mobile number (must be 10 digits)';
    if (!address.street) newErrors.street = 'Street is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.state) newErrors.state = 'State is required';
    if (!address.zip) newErrors.zip = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      setIsProcessingPayment(false);
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Step 1: Create order in Supabase first
      setPaymentStep('Creating order...');
      console.log('Creating order in Supabase...');
      
      const orderDetails = {
        user: {
          id: user?._id, // Include user ID for authenticated orders
          name: name,
          email: email,
          mobile: mobile,
        },
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        quantity: quantity,
        totalAmount: product.price * quantity,
        shippingAddress: address,
      };

      const createOrderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      const createOrderResult = await createOrderResponse.json();

      if (!createOrderResult.success) {
        console.error('Failed to create order:', createOrderResult.message);
        alert('Failed to create order. Please try again.');
        return;
      }

      console.log('Order created successfully:', createOrderResult.order);
      const orderId = createOrderResult.order.id;
      const totalPrice = createOrderResult.order.total_price;

      // Step 2: Create Razorpay order
      setPaymentStep('Setting up payment...');
      console.log('Creating Razorpay order...');
      
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: Math.round(totalPrice * 100), // Convert to paise
          currency: 'INR'
        }),
      });

      const razorpayOrder = await response.json();

      if (response.ok) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Kislay Naturals',
          description: `Payment for ${product.name}`,
          order_id: razorpayOrder.id,
          handler: async function (paymentResponse: any) {
            console.log('Payment successful:', paymentResponse);

            // Step 3: Update order with payment details
            try {
              const updatePaymentResponse = await fetch('/api/orders/update-payment', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: orderId,
                  paymentDetails: {
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                  },
                }),
              });

              const updateResult = await updatePaymentResponse.json();

              if (updateResult.success) {
                alert('Payment successful and order confirmed!');
                console.log('Order updated with payment details:', updateResult.order);
              } else {
                console.error('Failed to update order with payment details:', updateResult.message);
                alert('Payment was successful, but we failed to update your order. Please contact support with order ID: ' + orderId);
              }
            } catch (error) {
              console.error('Error updating order with payment details:', error);
              alert('Payment was successful, but an error occurred while updating your order. Please contact support with order ID: ' + orderId);
            }

            onClose();
          },
          prefill: {
            name: name,
            email: email,
            contact: mobile,
          },
          notes: {
            address: `${address.street}, ${address.city}, ${address.state} - ${address.zip}`,
            order_id: orderId,
          },
          theme: {
            color: '#4CAF50',
          },
        };

        setPaymentStep('Opening payment gateway...');
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        
        // Reset loading state when Razorpay modal opens
        setIsProcessingPayment(false);
        setPaymentStep('');
      } else {
        console.error('Failed to create Razorpay order:', razorpayOrder.error);
        alert('Failed to create Razorpay order. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('An error occurred during the payment process. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      setPaymentStep('');
    }
  };

  if (!isOpen) {
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show login requirement if user is not authenticated
  if (!user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600">
                You need to be logged in to place an order. Please create an account or sign in to continue.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                disabled={isRedirecting}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRedirecting ? 'Redirecting...' : 'Login / Sign Up'}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Complete Your Order</h2>
          <p className="text-gray-600 mb-6">Please provide your details to proceed with the payment.</p>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className={`w-full p-3 border rounded-lg ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className={`w-full p-3 border rounded-lg ${errors.street ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input type="text" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} className={`w-full p-3 border rounded-lg ${errors.zip ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between items-center">
                <p>{product.name} (x{quantity})</p>
                <p>₹{(product.price * quantity).toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Tax (18%)</p>
                <p>₹{(Math.round(product.price * quantity * 0.18 * 100) / 100).toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Shipping</p>
                <p>{product.price * quantity > 100 ? 'Free' : '₹10.00'}</p>
              </div>
              <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t">
                <p>Total</p>
                <p>₹{((product.price * quantity) + (Math.round(product.price * quantity * 0.18 * 100) / 100) + (product.price * quantity > 100 ? 0 : 10)).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button 
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="animate-pulse">{paymentStep || 'Processing Payment...'}</span>
              </>
            ) : (
              <span>Proceed to Payment</span>
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

