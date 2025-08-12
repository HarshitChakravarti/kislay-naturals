'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Product } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

export default function CheckoutModal({ isOpen, onClose, product, quantity }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Scroll to top when modal opens
  if (typeof window !== 'undefined' && isOpen) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Prevent body scroll when modal is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }

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
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: product.price * quantity,
          currency: 'INR'
        }),
      });

      const order = await response.json();

      if (response.ok) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: 'Kislay Naturals',
          description: `Payment for ${product.name}`,
          order_id: order.id,
          handler: async function (paymentResponse: any) {
            console.log('Payment successful:', paymentResponse);

            const orderDetails = {
              user: {
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
              paymentDetails: {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            };

            try {
              const saveOrderResponse = await fetch('/api/save-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
              });

              const result = await saveOrderResponse.json();

              if (result.success) {
                alert('Payment successful and order saved!');
              } else {
                console.error('Failed to save order:', result.message);
                alert('Payment was successful, but we failed to save your order. Please contact support.');
              }
            } catch (error) {
              console.error('Error saving order:', error);
              alert('Payment was successful, but an error occurred while saving your order. Please contact support.');
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
          },
          theme: {
            color: '#4CAF50',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        console.error('Failed to create Razorpay order:', order.error);
        alert('Failed to create Razorpay order. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('An error occurred during the payment process. Please try again.');
    }
  };

  if (!isOpen) {
    return null;
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
            <div className="flex justify-between items-center text-gray-700">
              <p>{product.name} (x{quantity})</p>
              <p>₹{(product.price * quantity).toFixed(2)}</p>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button 
            onClick={handlePayment}
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Proceed to Payment
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

