'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Product, ProductVariant } from '@/types';
import ProductReviews from './ProductReviews';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

const FeatureCard = ({ emoji, title, description }: { emoji: string, title: string, description: string }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center space-y-2 hover:border-gray-200 transition-colors">
    <div className="flex items-center justify-center">
      <span className="text-xl">{emoji}</span>
    </div>
    <div className="space-y-1">
      <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed text-center">{description}</p>
    </div>
  </div>
);

interface ProductDetailsProps {
  product: Product;
  onOpenCheckout?: (quantity: number, productWithVariant?: Product, variantSize?: string) => void;
}

export default function ProductDetails({ product, onOpenCheckout }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Initialize variants with default values if not present
  const defaultVariants: ProductVariant[] = product.variants && product.variants.length > 0 
    ? product.variants 
    : [
        { size: '10ml', price: 299, originalPrice: 399 },
        { size: '30ml', price: 799, originalPrice: 999 }
      ];
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariants[0]);
  
  const [reviewStats, setReviewStats] = useState({
    avgRating: product.avgRating || 0,
    numReviews: product.numReviews || 0
  });

  const [isEnquireFormVisible, setIsEnquireFormVisible] = useState(false);
  const [enquireFormData, setEnquireFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const productImages = [
    '/product1.png',
    '/product2.png',
    '/product3.png',
    '/product4.png',
    '/product5.png',
  ];

  // Fetch fresh review stats to match the reviews section
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        // Fetch all reviews with a high limit to get accurate count
        const response = await fetch(`/api/reviews?productId=${product.id}&limit=1000`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const reviews = data.data;
          // Use the count from API pagination (most accurate) or fall back to array length
          const totalReviews = data.pagination?.totalReviews ?? reviews.length;
          
          // Filter out reviews with null/undefined ratings for average calculation
          const reviewsWithRatings = reviews.filter((r: any) => 
            r.rating !== null && r.rating !== undefined && !isNaN(Number(r.rating))
          );
          
          // Calculate average only from reviews with valid ratings
          const sumRatings = reviewsWithRatings.reduce((sum: number, review: any) => {
            const rating = typeof review.rating === 'number' ? review.rating : parseFloat(String(review.rating));
            return sum + (isNaN(rating) ? 0 : rating);
          }, 0);
          
          const averageRating = reviewsWithRatings.length > 0 ? sumRatings / reviewsWithRatings.length : 0;
          
          setReviewStats({
            avgRating: Math.round(averageRating * 10) / 10,
            numReviews: totalReviews
          });
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      }
    };

    fetchReviewStats();
  }, [product.id]);

  const handleReviewSubmit = useCallback(() => {
    // Refetch review stats when a new review is submitted
    const fetchReviewStats = async () => {
      try {
        // Fetch all reviews with a high limit to get accurate count
        const response = await fetch(`/api/reviews?productId=${product.id}&limit=1000`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const reviews = data.data;
          // Use the count from API pagination (most accurate) or fall back to array length
          const totalReviews = data.pagination?.totalReviews ?? reviews.length;
          
          // Filter out reviews with null/undefined ratings for average calculation
          const reviewsWithRatings = reviews.filter((r: any) => 
            r.rating !== null && r.rating !== undefined && !isNaN(Number(r.rating))
          );
          
          // Calculate average only from reviews with valid ratings
          const sumRatings = reviewsWithRatings.reduce((sum: number, review: any) => {
            const rating = typeof review.rating === 'number' ? review.rating : parseFloat(String(review.rating));
            return sum + (isNaN(rating) ? 0 : rating);
          }, 0);
          
          const averageRating = reviewsWithRatings.length > 0 ? sumRatings / reviewsWithRatings.length : 0;
          
          setReviewStats({
            avgRating: Math.round(averageRating * 10) / 10,
            numReviews: totalReviews
          });
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      }
    };

    // Small delay to ensure the review is saved before fetching
    setTimeout(() => {
      fetchReviewStats();
    }, 500);
    router.refresh();
  }, [router, product.id]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleEnquireInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquireFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const whatsappMessage = `*New Product Enquiry*\n\n` +
        `*Product:* ${product.name}\n` +
        `*Name:* ${enquireFormData.name}\n` +
        `*Email:* ${enquireFormData.email}\n` +
        `*Mobile:* ${enquireFormData.mobile}\n` +
        `*Address:* ${enquireFormData.address}\n` +
        `*Message:* ${enquireFormData.message}\n\n` +
        `*Enquiry Date:* ${new Date().toLocaleDateString('en-IN')}`;

      const phoneNumber = '917043630938';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      window.open(whatsappUrl, '_blank');
      
      setEnquireFormData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        message: ''
      });
      
      setIsEnquireFormVisible(false);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      alert('There was an error sending your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnquireFormValid = enquireFormData.name && enquireFormData.email && enquireFormData.mobile && enquireFormData.address;

  return (
    <div className="w-full">
      <div className="w-full bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 py-3 hover:text-white/90 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm md:text-base">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={productImages[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6 transition-transform duration-500 hover:scale-105"
                  priority
                />
                
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {productImages.map((img, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: selectedImage === i ? 1.12 : 0.85,
                      opacity: selectedImage === i ? 1 : 0.8,
                      y: selectedImage === i ? -2 : 2
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    whileHover={{ scale: selectedImage === i ? 1.14 : 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer
                      ${selectedImage === i ? 'border-green-500' : 'border-transparent'}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 18vw, 9vw"
                      className="object-contain p-1"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
                <div className="text-center space-y-3.5">
                  <div className="flex items-center justify-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Have Questions?</h3>
                  </div>
                  <p className="text-gray-600 text-center leading-relaxed text-sm">
                    Get personalized assistance about this product. We are here to help!
                  </p>
                  <motion.button
                    onClick={() => setIsEnquireFormVisible(!isEnquireFormVisible)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{isEnquireFormVisible ? 'Hide Form' : 'Enquire Now'}</span>
                  </motion.button>
                </div>

                {isEnquireFormVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 pt-5 border-t border-green-200"
                  >
                    <form onSubmit={handleEnquireSubmit} className="space-y-3.5">
                      <div>
                        <label htmlFor="enquire-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="enquire-name"
                          name="name"
                          value={enquireFormData.name}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="enquire-email"
                          name="email"
                          value={enquireFormData.email}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          id="enquire-mobile"
                          name="mobile"
                          value={enquireFormData.mobile}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your mobile number"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-address" className="block text-sm font-medium text-gray-700 mb-2">
                          Short Address *
                        </label>
                        <input
                          type="text"
                          id="enquire-address"
                          name="address"
                          value={enquireFormData.address}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="City, State"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-message" className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Message
                        </label>
                        <textarea
                          id="enquire-message"
                          name="message"
                          value={enquireFormData.message}
                          onChange={handleEnquireInputChange}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                          placeholder="Any specific questions or requirements..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={!isEnquireFormValid || isSubmitting}
                        whileHover={{ scale: isEnquireFormValid ? 1.02 : 1 }}
                        whileTap={{ scale: isEnquireFormValid ? 0.98 : 1 }}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isEnquireFormValid
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Enquiry via WhatsApp</span>
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-3.5 p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700 text-center text-justify">
                        Your enquiry will be sent directly to our WhatsApp for quick response
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            <div>
              <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avgRating = reviewStats.avgRating || 0;
                    // Round to nearest integer for star display
                    const roundedRating = Math.round(avgRating);
                    return (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= roundedRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewStats.numReviews || 0} {reviewStats.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {/* Price Display - At the Top */}
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-700">
                    ₹{selectedVariant.price?.toFixed(2)}
                  </span>
                  {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{selectedVariant.originalPrice.toFixed(2)}
                      </span>
                      
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes • Free shipping across India</p>
              </div>

              {/* Size Selection - Below Price */}
              {defaultVariants.length > 1 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Select Size</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {defaultVariants.map((variant) => (
                      <motion.button
                        key={variant.size}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all ${
                          selectedVariant.size === variant.size
                            ? 'border-green-600 bg-green-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center space-y-0.5">
                          <div className={`font-semibold text-sm ${
                            selectedVariant.size === variant.size ? 'text-green-700' : 'text-gray-900'
                          }`}>
                            {variant.size === '30ml' ? '30ml (10ml extra free)' : variant.size}
                          </div>
                          <div className="text-xs">
                            <span className={`font-medium ${
                              selectedVariant.size === variant.size ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              ₹{variant.price}
                            </span>
                            {variant.originalPrice > variant.price && (
                              <span className="text-gray-400 line-through ml-1">₹{variant.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">What&apos;s in the box?</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="prose prose-sm max-w-none text-gray-600 space-y-3">
                  {product.description?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${index === 0 ? "text-base font-medium text-gray-900" : "text-sm"} leading-relaxed`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">Why it&apos;s different?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <FeatureCard emoji="🌿" title="100% Natural" description="Monk Fruit Extract" />
                <FeatureCard emoji="🔥" title="Zero Calories" description="Zero Glycemic Index" />
                <FeatureCard emoji="💚" title="Diabetic Friendly" description="Keto-Friendly & Diabetic-Safe" />
                <FeatureCard emoji="💧" title="Easy Use" description="Convenient Drop Format - Easy to Mix" />
                <FeatureCard emoji="☕" title="Versatile" description="Perfect for Tea, Coffee, Smoothies & More" />
                <FeatureCard emoji="✨" title="Pure & Clean" description="No Artificial Flavors, Colors or Preservatives" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-base">Quantity</span>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <motion.button
              onClick={() => {
                // Pass variant info along with quantity
                const productWithVariant: Product = {
                  ...product,
                  price: selectedVariant.price,
                  originalPrice: selectedVariant.originalPrice,
                };
                onOpenCheckout?.(quantity, productWithVariant, selectedVariant.size);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Buy Now</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:hidden"
            >
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="text-center space-y-2.5">
                  <div className="flex items-center justify-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-900">Have Questions?</h3>
                  </div>
                  <p className="text-gray-600 text-center leading-relaxed text-xs">
                    Get personalized assistance about this product. We are here to help!
                  </p>
                  <motion.button
                    onClick={() => setIsEnquireFormVisible(!isEnquireFormVisible)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors text-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{isEnquireFormVisible ? 'Hide Form' : 'Enquire Now'}</span>
                  </motion.button>
                </div>

                {isEnquireFormVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 pt-5 border-t border-green-200"
                  >
                    <form onSubmit={handleEnquireSubmit} className="space-y-3.5">
                      <div>
                        <label htmlFor="enquire-name-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="enquire-name-mobile"
                          name="name"
                          value={enquireFormData.name}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-email-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="enquire-email-mobile"
                          name="email"
                          value={enquireFormData.email}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-mobile-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          id="enquire-mobile-mobile"
                          name="mobile"
                          value={enquireFormData.mobile}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your mobile number"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-address-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Short Address *
                        </label>
                        <input
                          type="text"
                          id="enquire-address-mobile"
                          name="address"
                          value={enquireFormData.address}
                          onChange={handleEnquireInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="City, State"
                        />
                      </div>

                      <div>
                        <label htmlFor="enquire-message-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Message
                        </label>
                        <textarea
                          id="enquire-message-mobile"
                          name="message"
                          value={enquireFormData.message}
                          onChange={handleEnquireInputChange}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                          placeholder="Any specific questions or requirements..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={!isEnquireFormValid || isSubmitting}
                        whileHover={{ scale: isEnquireFormValid ? 1.02 : 1 }}
                        whileTap={{ scale: isEnquireFormValid ? 0.98 : 1 }}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isEnquireFormValid
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Enquiry via WhatsApp</span>
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-3.5 p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700 text-center text-justify">
                        Your enquiry will be sent directly to our WhatsApp for quick response
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <ProductReviews 
          productId={product.id.toString()} 
          productName={product.name}
          onReviewSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
}
