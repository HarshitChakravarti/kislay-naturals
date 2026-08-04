'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CreditCard, MapPin, User, Mail, Phone, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

import { Product } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/store/slices/cartSlice';

import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import CouponBox from '@/components/checkout/CouponBox';
import { useMetaPixel } from '@/hooks/useMetaPixel';

interface CheckoutFormData {
  name: string;
  email: string;
  mobile: string;
  address: {
    flat: string;
    area: string;
    landmark?: string;
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
      flat: '',
      area: '',
      landmark: '',
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
  const [couponType, setCouponType] = useState<'special' | 'holi' | 'sweetsmart' | 'none'>('none');
  // Server-calculated totals — never derived from URL params
  const [serverBaseTotal, setServerBaseTotal] = useState<number>(0);
  const [serverFinalTotal, setServerFinalTotal] = useState<number>(0);
  const [serverCouponDiscount, setServerCouponDiscount] = useState<number>(0);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<{ message: string; color: string } | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const isCartCheckout = searchParams.get('fromCart') === 'true';
  const { trackInitiateCheckout, trackAddPaymentInfo } = useMetaPixel();

  // Get product data from URL params and fetch real price from server
  useEffect(() => {
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const productImage = searchParams.get('productImage');
    const productDescription = searchParams.get('productDescription');
    const productQuantity = searchParams.get('quantity');
    const productVariantSize = searchParams.get('variantSize');

    if (productId && productName && productImage) {
      const qty = parseInt(productQuantity || '1');
      setQuantity(qty);
      setVariantSize(productVariantSize || '');

      // Fetch the real variant price from the server
      setIsFetchingPrice(true);
      fetch(`/api/products/${productId}`)
        .then(r => r.json())
        .then(data => {
          const prod = data.product;
          if (!prod) { router.push('/products'); return; }

          const variants: any[] = prod.variants || [];
          const variant = variants.find(
            (v: any) => v.size?.trim().toLowerCase() === (productVariantSize || '').trim().toLowerCase()
          );
          const unitPrice: number = variant?.price ?? prod.price;
          const unitOriginalPrice: number = variant?.originalPrice ?? prod.original_price ?? unitPrice;

          setProduct({
            id: prod.id,
            name: prod.name || productName,
            price: unitPrice,
            image: prod.image || productImage,
            description: prod.description || productDescription || '',
            originalPrice: unitOriginalPrice,
            variants: prod.variants || [],
          });
          setServerBaseTotal(unitPrice * qty);
          setServerFinalTotal(unitPrice * qty);
        })
        .catch(() => router.push('/products'))
        .finally(() => setIsFetchingPrice(false));
    } else if (searchParams.get('fromCart') === 'true') {
      setProduct(null);
    } else {
      router.push('/products');
    }

    const initialCoupon = searchParams.get('coupon');
    if (initialCoupon) setCouponCode(initialCoupon);
  }, [searchParams, router]);

  // Compute server base total for cart checkout whenever cartItems changes
  useEffect(() => {
    if (isCartCheckout && cartItems.length > 0) {
      setServerBaseTotal(cartSubtotal);
      setServerFinalTotal(cartSubtotal);
    }
  }, [isCartCheckout, cartItems, cartSubtotal]);

  // Auto-apply coupon from URL if present and product/cart is ready
  useEffect(() => {
    if (couponCode && !couponApplied && (product || (isCartCheckout && cartItems.length > 0))) {
      handleApplyCoupon(couponCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isCartCheckout, cartItems, couponCode]);

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
    if (!formData.address.flat) newErrors.flat = 'Flat/House no. is required';
    if (!formData.address.area) newErrors.area = 'Area/Street is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.state) newErrors.state = 'State is required';
    if (!formData.address.zip) newErrors.zip = 'ZIP code is required';
    
    // Quantity validation (only if single product)
    if (!isCartCheckout) {
      if (quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
      if (quantity > 100) newErrors.quantity = 'Maximum quantity is 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePincodeBlur = () => {
    const pin = formData.address.zip.trim();
    if (!pin) {
      setDeliveryEstimate(null);
      return;
    }
    
    setIsCheckingPincode(true);
    setDeliveryEstimate({ message: 'Checking delivery...', color: 'text-gray-500' });
    
    setTimeout(() => {
      setIsCheckingPincode(false);
      if (!/^\d{6}$/.test(pin)) {
        setDeliveryEstimate({ message: 'Please enter a valid 6-digit PIN code', color: 'text-red-500' });
      } else if (pin.startsWith('38') || pin.startsWith('39')) {
        setDeliveryEstimate({ message: '📦 Estimated delivery: 2–3 business days', color: 'text-[#1a5c38]' });
      } else if (pin.startsWith('40') || pin.startsWith('11')) {
        setDeliveryEstimate({ message: '📦 Estimated delivery: 3–4 business days', color: 'text-[#1a5c38]' });
      } else {
        setDeliveryEstimate({ message: '📦 Estimated delivery: 5–7 business days', color: 'text-[#1a5c38]' });
      }
    }, 600);
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
    setCurrentOrderId(null); // Clear cached order since price will change
    // Clear quantity error when user adjusts quantity
    if (errors.quantity) {
      setErrors(prev => ({
        ...prev,
        quantity: ''
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm() || (!product && !isCartCheckout)) {
      setIsProcessingPayment(false);
      return;
    }

    setIsProcessingPayment(true);

    // — Meta Conversions API: InitiateCheckout
    const checkoutCustomer = {
      email: formData.email || undefined,
      phone: formData.mobile || undefined,
      firstName: formData.name.split(' ')[0] || undefined,
      lastName: formData.name.split(' ').slice(1).join(' ') || undefined,
      city: formData.address.city || undefined,
      state: formData.address.state || undefined,
      zip: formData.address.zip || undefined,
    };
    trackInitiateCheckout({
      contentName: isCartCheckout ? 'Cart Checkout' : product?.name,
      contentIds: isCartCheckout
        ? cartItems.map((i: any) => i.product)
        : product ? [product.id] : undefined,
      contents: isCartCheckout
        ? cartItems.map((i: any) => ({ id: i.product, quantity: i.quantity, item_price: i.price }))
        : product ? [{ id: product.id, quantity, item_price: product.price }] : undefined,
      value: finalTotal,
      currency: 'INR',
      contentType: 'product',
      customer: checkoutCustomer,
    } as any);

    // — Meta Conversions API: AddPaymentInfo (user has filled in shipping and will pay)
    trackAddPaymentInfo({ customer: checkoutCustomer });
    // ─────────────────────────────────────────────────────────────────────
    
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
          ...(isCartCheckout ? { cartItems } : {
            product: {
              ...product,
              variantSize: variantSize // Include variant size in product data
            },
            quantity: quantity,
          }),
          totalAmount: finalTotal, // Use final total with coupon discount
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          couponCode: couponApplied ? couponCode : null,
          couponDiscount: couponDiscount,
          shippingAddress: {
            ...formData.address,
            street: [formData.address.flat, formData.address.area, formData.address.landmark].filter(Boolean).join(', ')
          }
        };

        const createOrderResponse = await fetch('/api/orders', {
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
          toast.error('Your order has expired. Please try again with a fresh checkout.');
          setIsProcessingPayment(false);
          return;
        } else if (razorpayResponse.status === 400 && errorData.message?.includes('Maximum payment attempts')) {
          // Max attempts exceeded
          setCurrentOrderId(null);
          toast.error('Maximum payment attempts exceeded. Starting fresh checkout...');
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
        description: `Payment for ${isCartCheckout ? 'Multiple Items' : product?.name}`,
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
              // Clear cart on successful order
              if (isCartCheckout) {
                dispatch(clearCart());
              }

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
            toast.error('Payment successful but failed to update order. Please contact support.');
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
        
        toast.error(userMessage);
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
      toast.error(`Checkout Error: ${errorMessage}`);
      setIsProcessingPayment(false);
      setPaymentStep('');
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
        setPaymentTimeout(null);
      }
    }
  };

  if (!product && !isCartCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (isCartCheckout && (!cartItems || cartItems.length === 0) && !isPaymentCompleted && !isProcessingPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-green-600 font-semibold hover:underline">
            Go back to products
          </Link>
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

  // Apply coupon via server-side validation
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
    setCouponError('');
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const body = isCartCheckout
      ? { couponCode: code.trim(), cartItems: cartItems.map((i: any) => ({ productId: i.product, variantSize: i.variantSize, quantity: i.quantity })) }
      : { couponCode: code.trim(), productId: product?.id, variantSize, quantity };

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.valid) {
        setCouponApplied(true);
        setCouponType(data.couponType as any);
        setServerFinalTotal(data.finalTotal);
        setServerCouponDiscount(data.couponDiscount);
        setCouponError('');
        setCurrentOrderId(null); // Clear cached order since price changed
      } else {
        setCouponApplied(false);
        setCouponType('none');
        setServerFinalTotal(serverBaseTotal);
        setServerCouponDiscount(0);
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponType('none');
    setCouponError('');
    setServerFinalTotal(serverBaseTotal);
    setServerCouponDiscount(0);
    setCurrentOrderId(null); // Clear cached order since price changed
  };

  // Use server-computed values for display and payment
  const originalPrice = isCartCheckout
    ? cartItems.reduce((acc: number, item: any) => acc + ((item.originalPrice || item.price) * item.quantity), 0)
    : (product ? (product.originalPrice ?? product.price) * quantity : 0);
  const discountedPrice = serverBaseTotal;
  const finalTotal = serverFinalTotal;
  const couponDiscount = serverCouponDiscount;
  const kislayDiscount = Math.max(0, originalPrice - discountedPrice);

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
        <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="order-last md:order-first lg:col-span-2">
            <ShippingForm
              formData={formData}
              errors={errors}
              emailValidation={emailValidation}
              deliveryEstimate={deliveryEstimate}
              handleInputChange={handleInputChange}
              handlePincodeBlur={handlePincodeBlur}
            />
          </div>

          {/* Order Summary */}
          <div className="order-first md:order-last lg:col-span-1 mb-6 md:mb-0">
            <OrderSummary
              isCartCheckout={isCartCheckout}
              cartItems={cartItems}
              product={product}
              variantSize={variantSize}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              errors={errors}
              originalPrice={originalPrice}
              kislayDiscount={kislayDiscount}
              couponApplied={couponApplied}
              couponCode={couponCode}
              couponDiscount={couponDiscount}
              finalTotal={finalTotal}
              isProcessingPayment={isProcessingPayment}
              isPaymentCompleted={isPaymentCompleted}
              paymentStep={paymentStep}
              handlePayment={handlePayment}
              couponSection={
                <CouponBox
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  couponApplied={couponApplied}
                  couponError={couponError}
                  handleApplyCoupon={() => handleApplyCoupon()}
                  handleRemoveCoupon={handleRemoveCoupon}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
