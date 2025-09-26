'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CreditCard, MapPin, User, Mail, Phone, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CheckoutFormData {
  name: string;
  email: string;
  mobile: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    mobile: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(null);

  // Get product data from URL params
  useEffect(() => {
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const productPrice = searchParams.get('productPrice');
    const productImage = searchParams.get('productImage');
    const productDescription = searchParams.get('productDescription');
    const productQuantity = searchParams.get('quantity');

    if (productId && productName && productPrice && productImage) {
      setProduct({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        description: productDescription || ''
      });
      setQuantity(parseInt(productQuantity || '1'));
    } else {
      // Redirect back if no product data
      router.push('/products');
    }
  }, [searchParams, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
      }
    };
  }, [paymentTimeout]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number (must be 10 digits)';
    if (!formData.address.street) newErrors.street = 'Street is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.state) newErrors.state = 'State is required';
    if (!formData.address.zip) newErrors.zip = 'ZIP code is required';
    
    // Quantity validation
    if (quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (quantity > 100) newErrors.quantity = 'Maximum quantity is 100';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    // Clear quantity error when user adjusts quantity
    if (errors.quantity) {
      setErrors(prev => ({
        ...prev,
        quantity: ''
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm() || !product) {
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
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile
        },
        product: product,
        quantity: quantity,
        totalAmount: product.price * quantity,
        shippingAddress: formData.address
      };

      const createOrderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (!createOrderResponse.ok) {
        throw new Error(`Order creation failed with status: ${createOrderResponse.status}`);
      }

      const orderResult = await createOrderResponse.json();
      console.log('Order creation result:', orderResult);

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      // Step 2: Create Razorpay order
      setPaymentStep('Initializing payment...');
      console.log('Creating Razorpay order...');
      
      const razorpayResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round((orderResult.order?.total_price || orderResult.data?.total_price || orderResult.data?.total) * 100), // Convert to paise
          currency: 'INR',
          orderId: orderResult.order?.id || orderResult.data?.id
        }),
      });

      if (!razorpayResponse.ok) {
        throw new Error(`Razorpay order creation failed with status: ${razorpayResponse.status}`);
      }

      const razorpayResult = await razorpayResponse.json();
      console.log('Razorpay order result:', razorpayResult);

      if (!razorpayResult.success) {
        throw new Error(razorpayResult.message || 'Failed to create payment order');
      }

      // Step 3: Initialize Razorpay payment
      setPaymentStep('Opening payment gateway...');
      console.log('Initializing Razorpay payment...');
      
      // Check if Razorpay key is configured
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID environment variable.');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayResult.data.amount,
        currency: razorpayResult.data.currency,
        name: 'Kislay Naturals',
        description: `Payment for ${product.name}`,
        order_id: razorpayResult.data.id,
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          setPaymentStep('Processing payment...');
          
          try {
            // Update order with payment details
            const updatePaymentResponse = await fetch('/api/orders/update-payment', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderResult.order?.id || orderResult.data?.id,
                paymentDetails: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                }
              }),
            });

            if (!updatePaymentResponse.ok) {
              throw new Error(`Payment update failed with status: ${updatePaymentResponse.status}`);
            }

            const updateResult = await updatePaymentResponse.json();
            console.log('Payment update result:', updateResult);

            if (updateResult.success) {
              // Redirect to success page
              router.push(`/order-success?orderId=${orderResult.order?.id || orderResult.data?.id}`);
            } else {
              throw new Error(updateResult.message || 'Failed to update payment');
            }
          } catch (error) {
            console.error('Error updating payment:', error);
            alert('Payment successful but failed to update order. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#10b981'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response);
        alert('Payment failed. Please try again.');
        setIsProcessingPayment(false);
        setPaymentStep('');
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
      });
      
      razorpay.on('payment.cancelled', function (response: any) {
        console.log('Payment cancelled by user:', response);
        setIsProcessingPayment(false);
        setPaymentStep('');
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
      });

      // Handle modal close events
      razorpay.on('modal.close', function (response: any) {
        console.log('Razorpay modal closed:', response);
        setIsProcessingPayment(false);
        setPaymentStep('');
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
      });
      
      // Fallback timeout to reset state if modal doesn't trigger events
      const resetTimeout = setTimeout(() => {
        console.log('Payment timeout - resetting state');
        setIsProcessingPayment(false);
        setPaymentStep('');
        setPaymentTimeout(null);
      }, 10000); // 10 seconds timeout
      
      setPaymentTimeout(resetTimeout);
      
      // Clear timeout when payment succeeds
      razorpay.on('payment.success', function (response: any) {
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error('Error during payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Checkout Error: ${errorMessage}`);
      setIsProcessingPayment(false);
      setPaymentStep('');
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
        setPaymentTimeout(null);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const totalAmount = product.price * quantity;
  const finalTotal = totalAmount; // Only product price, no tax or shipping

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/products" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Products
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ShoppingCart className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your street address"
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="address.zip"
                          value={formData.address.zip}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.zip ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="ZIP Code"
                        />
                        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
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
                  ({quantity} item{quantity !== 1 ? 's' : ''})
                </span>
              </h2>

              {/* Product Details */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">{product.name}</h3>
                  
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
                          onClick={() => handleQuantityChange(Math.min(100, quantity + 1))}
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

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product Price</span>
                  <span className="text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
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
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{paymentStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
