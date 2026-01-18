'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CreditCard, MapPin, User, Mail, Phone, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Product } from '@/types';

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



// Indian States and Union Territories
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

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
  const [variantSize, setVariantSize] = useState<string>('');
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [razorpayInstance, setRazorpayInstance] = useState<any>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
  }>({ isValid: true, message: '', isChecking: false });
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed' | 'republic26' | 'special' | 'none'>('none');

  // Get product data from URL params
  useEffect(() => {
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const productPrice = searchParams.get('productPrice');
    const productImage = searchParams.get('productImage');
    const productDescription = searchParams.get('productDescription');
    const productQuantity = searchParams.get('quantity');
    const productVariantSize = searchParams.get('variantSize');

    if (productId && productName && productPrice && productImage) {
      setProduct({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        description: productDescription || ''
      });
      setQuantity(parseInt(productQuantity || '1'));
      setVariantSize(productVariantSize || '');
    } else {
      // Redirect back if no product data
      router.push('/products');
    }
  }, [searchParams, router]);

  // Cleanup timeout and razorpay instance on unmount
  useEffect(() => {
    return () => {
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
      }
      if (razorpayInstance) {
        // Remove all event listeners to prevent duplicate warnings
        razorpayInstance.off('payment.failed');
        razorpayInstance.off('payment.cancelled');
        razorpayInstance.off('modal.close');
        razorpayInstance.off('payment.success');
      }
    };
  }, [paymentTimeout, razorpayInstance]);

  // Enhanced email validation function
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    
    // Basic format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common typos and issues
    if (email.includes('..')) {
      return 'Email cannot contain consecutive dots';
    }
    
    if (email.startsWith('.') || email.endsWith('.')) {
      return 'Email cannot start or end with a dot';
    }
    
    // Check for common Gmail typos
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (gmailRegex.test(email)) {
      const localPart = email.split('@')[0];
      if (localPart.length < 2) {
        return 'Gmail username must be at least 2 characters';
      }
      if (localPart.includes('..')) {
        return 'Gmail username cannot contain consecutive dots';
      }
    }
    
    // Check for suspicious patterns
    if (email.includes(' ')) {
      return 'Email cannot contain spaces';
    }
    
    return null; // Valid email
  };

  // Debounced email validation
  useEffect(() => {
    if (formData.email && formData.email.length > 3) {
      setEmailValidation({ isValid: false, message: 'Checking email...', isChecking: true });
      
      const timeoutId = setTimeout(() => {
        const validation = validateEmail(formData.email);
        setEmailValidation({
          isValid: !validation,
          message: validation || 'Email looks good!',
          isChecking: false
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else if (formData.email.length === 0) {
      setEmailValidation({ isValid: true, message: '', isChecking: false });
    }
  }, [formData.email]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    
    // Use enhanced email validation
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      newErrors.email = emailValidationError;
    }
    
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      let orderId = currentOrderId;
      
      // Step 1: Create order in Supabase first (only if we don't have one)
      if (!orderId) {
        setPaymentStep('Creating order...');
        console.log('Creating new order in Supabase...');
        
        const orderDetails = {
          user: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile
          },
          product: {
            ...product,
            variantSize: variantSize // Include variant size in product data
          },
          quantity: quantity,
          totalAmount: finalTotal, // Use final total with coupon discount
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          couponCode: couponApplied ? couponCode : null,
          couponDiscount: couponDiscount,
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
        
        orderId = orderResult.order?.id || orderResult.data?.id;
        setCurrentOrderId(orderId); // Store order ID for reuse
        console.log('✅ New order created with ID:', orderId);
      } else {
        console.log('♻️ Reusing existing order ID:', orderId);
      }

      // Step 2: Create Razorpay order
      setPaymentStep('Initializing payment...');
      console.log('Creating Razorpay order...');
      
      console.log('💰 Sending to Razorpay - finalTotal:', finalTotal, 'Amount in paise:', Math.round(finalTotal * 100));
      
      const razorpayResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(finalTotal * 100), // Use final total with coupon discount
          currency: 'INR',
          orderId: orderId
        }),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json().catch(() => ({}));
        
        if (razorpayResponse.status === 410) {
          // Order expired - reset order ID and show message
          setCurrentOrderId(null);
          alert('Your order has expired. Please try again with a fresh checkout.');
          setIsProcessingPayment(false);
          return;
        } else if (razorpayResponse.status === 400 && errorData.message?.includes('Maximum payment attempts')) {
          // Max attempts exceeded
          setCurrentOrderId(null);
          alert('Maximum payment attempts exceeded. Starting fresh checkout...');
          setIsProcessingPayment(false);
          return;
        }
        
        throw new Error(errorData.message || `Razorpay order creation failed with status: ${razorpayResponse.status}`);
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
          
          // Show immediate loading state with prominent loading circle
          setIsPaymentCompleted(true);
          setPaymentStep('Payment successful! Processing your order...');
          
          try {
            // Update order with payment details
            const updatePaymentResponse = await fetch('/api/orders/update-payment', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderId, // Use the stored orderId
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
              // Add a delay to show loading circle prominently
              setPaymentStep('Order confirmed! Redirecting to success page...');
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
              
              // Redirect to fast payment success page
              router.push(`/payment-success?orderId=${orderId}`);
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

      // Clean up existing razorpay instance to prevent duplicate event listeners
      if (razorpayInstance) {
        razorpayInstance.off('payment.failed');
        razorpayInstance.off('payment.cancelled');
        razorpayInstance.off('modal.close');
        razorpayInstance.off('payment.success');
      }

      const razorpay = new (window as any).Razorpay(options);
      setRazorpayInstance(razorpay); // Store the instance for cleanup
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response);
        
        // Extract failure details for better user messaging
        const error = response.error || {};
        const reason = error.reason || 'payment_failed';
        const description = error.description || 'Payment failed. Please try again.';
        const code = error.code || 'PAYMENT_FAILED';
        
        // Record the failure in our database (as backup to webhook)
        fetch('/api/orders/record-failure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            failureCode: code,
            failureMessage: `${reason}: ${description}`,
            failureReason: reason
          }),
        }).catch(err => console.warn('Failed to record payment failure:', err));
        
        // Show user-friendly error message based on failure reason
        let userMessage = 'Payment failed. Please try again.';
        if (reason.includes('card')) {
          userMessage = 'Card payment failed. Please check your card details and try again.';
        } else if (reason.includes('insufficient')) {
          userMessage = 'Insufficient funds. Please try with a different payment method.';
        } else if (reason.includes('network')) {
          userMessage = 'Network error. Please check your connection and try again.';
        }
        
        alert(userMessage);
        setIsProcessingPayment(false);
        setPaymentStep('');
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
        // Don't refresh - allow retry with the same order
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
        
        // Only reset if payment wasn't completed
        if (!isPaymentCompleted) {
          setIsProcessingPayment(false);
          setPaymentStep('');
          if (paymentTimeout) {
            clearTimeout(paymentTimeout);
            setPaymentTimeout(null);
          }
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
      
      // Handle payment success with immediate loading state
      razorpay.on('payment.success', function (response: any) {
        console.log('Payment successful:', response);
        
        // Clear timeout
        if (paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
        
        // Show immediate loading state
        setIsPaymentCompleted(true);
        setIsProcessingPayment(true);
        setPaymentStep('Payment successful! Processing your order...');
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

  // Show payment completion overlay
  if (isPaymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="animate-pulse rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your order is being processed...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="text-sm text-gray-500">Redirecting to confirmation page</span>
          </div>
        </div>
      </div>
    );
  }

  // Coupon validation function
  const validateCoupon = (code: string) => {
    const upperCode = code.toUpperCase();
    
    if (upperCode === 'SPECIAL') {
      // Variant-specific discount: 10ml gets ₹50 off, 30ml gets ₹100 off
      return { valid: true, discount: 0, type: 'special' }; // Discount calculated based on variant
    }
    
    if (upperCode === 'REPUBLIC26') {
      // Variant-specific discount: 10ml gets ₹50 off, 30ml gets ₹100 off
      return { valid: true, discount: 0, type: 'republic26' }; // Discount calculated based on variant
    }
    
    return { valid: false, discount: 0, type: 'none' };
  };

  // Apply coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const validation = validateCoupon(couponCode.trim());
    if (validation.valid) {
      setCouponApplied(true);
      setCouponType(validation.type as 'percentage' | 'fixed' | 'republic26' | 'special' | 'none');
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponType('none');
      setCouponError('Invalid coupon code');
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponType('none');
    setCouponError('');
  };

  const totalAmount = product.price * quantity;
  const originalPrice = (product.originalPrice || 399) * quantity; // Original price from product or default ₹399 per unit
  const discountedPrice = product.price * quantity; // Use actual product price
  
  // Calculate final total based on coupon type
  let finalTotal: number;
  let couponDiscount: number;
  
  if (couponApplied && couponType === 'special') {
    // SPECIAL coupon: Variant-specific discount
    // 10ml: ₹299 → ₹249 (₹50 discount per unit)
    // 30ml: ₹799 → ₹699 (₹100 discount per unit)
    if (variantSize === '10ml') {
      const discountedPricePerUnit = 249;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    } else if (variantSize === '30ml') {
      const discountedPricePerUnit = 699;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    } else {
      // Fallback: use 10ml discount if variant not specified
      const discountedPricePerUnit = 249;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    }
  } else if (couponApplied && couponType === 'republic26') {
    // REPUBLIC26 coupon: Variant-specific discount
    // 10ml: ₹299 → ₹249 (₹50 discount per unit)
    // 30ml: ₹799 → ₹699 (₹100 discount per unit)
    if (variantSize === '10ml') {
      const discountedPricePerUnit = 249;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    } else if (variantSize === '30ml') {
      const discountedPricePerUnit = 699;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    } else {
      // Fallback: use 10ml discount if variant not specified
      const discountedPricePerUnit = 249;
      finalTotal = discountedPricePerUnit * quantity;
      couponDiscount = discountedPrice - finalTotal;
    }
  } else if (couponApplied && couponType === 'percentage') {
    // Percentage-based coupon
    couponDiscount = 30 * quantity;
    finalTotal = discountedPrice - couponDiscount;
  } else {
    // No coupon applied
    couponDiscount = 0;
    finalTotal = discountedPrice;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/products" 
                className="flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Products
              </Link>
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
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10 ${
                          errors.email ? 'border-red-500' : 
                          emailValidation.isValid && !emailValidation.isChecking ? 'border-green-500' : 
                          'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {emailValidation.isChecking && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        </div>
                      )}
                      {!emailValidation.isChecking && emailValidation.message && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {emailValidation.isValid ? (
                            <div className="w-4 h-4 text-green-500">✓</div>
                          ) : (
                            <div className="w-4 h-4 text-red-500">✗</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    {!errors.email && emailValidation.message && !emailValidation.isChecking && (
                      <p className={`text-sm mt-1 ${
                        emailValidation.isValid ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {emailValidation.message}
                      </p>
                    )}
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
                        <select
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
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

              {/* Coupon Code Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Coupon Code</h3>
                {!couponApplied ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-green-600 text-sm font-medium">{couponCode.toUpperCase()}</span>
                      <span className="ml-2 text-green-600 text-xs">Applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product Price</span>
                  <span className="text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount ({couponCode.toUpperCase()})</span>
                    <span className="text-green-600">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
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
