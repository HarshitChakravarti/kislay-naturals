'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Product, ProductVariant } from '@/types';
import {
  getBundleUnitCount,
  getProductGalleryForVariant,
  normalizeProductVariants,
} from '@/lib/productVariants';
import ProductReviews from './ProductReviews';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

const FeatureCard = ({ emoji, title, description }: { emoji: string, title: string, description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/70 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_36px_rgba(22,101,52,0.10)]">
    <div className="pointer-events-none absolute -right-6 top-0 h-16 w-16 rounded-full bg-lime-100/60 blur-2xl" />
    <div className="relative flex flex-col items-center space-y-2 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-xl ring-1 ring-emerald-100">
        <span>{emoji}</span>
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm text-emerald-800">{title}</h4>
        <p className="text-xs leading-relaxed text-slate-500 text-center">{description}</p>
      </div>
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
  
  const defaultVariants: ProductVariant[] = useMemo(
    () => normalizeProductVariants(product.variants),
    [product.variants]
  );
  const initialVariant = defaultVariants[0];
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);
  
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
  const productImages = getProductGalleryForVariant(selectedVariant);

  useEffect(() => {
    setSelectedVariant(initialVariant);
    setQuantity(1);
  }, [initialVariant, product.id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant.size]);

  const getVariantSavings = (variant: ProductVariant) =>
    Math.max(0, (variant.originalPrice || 0) - variant.price);

  const getVariantDescription = (variant: ProductVariant) => {
    if (variant.size.toLowerCase() === '30ml') {
      return 'Larger bottle';
    }

    const bottleCount = getBundleUnitCount(variant);
    return bottleCount === 1 ? 'Single bottle' : `${bottleCount} x 10ml bottles`;
  };

  const bestVariantSavings = Math.max(...defaultVariants.map(getVariantSavings));
  const selectedSavings = getVariantSavings(selectedVariant);
  const selectedVariantDescription = getVariantDescription(selectedVariant);

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

            <div className="relative overflow-hidden rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-[0_24px_60px_rgba(22,101,52,0.08)]">
              <div className="pointer-events-none absolute -right-14 top-0 h-36 w-36 rounded-full bg-emerald-100/70 blur-3xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-lime-100/60 blur-3xl" />
              <div className="relative space-y-5 p-6 md:p-7">
                {/* Price Display - At the Top */}
                <div className="flex flex-col gap-4 border-b border-emerald-100/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-100">
                      Choose Your Pack
                    </span>
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                      <span className="text-4xl font-bold tracking-tight text-green-700">
                        ₹{selectedVariant.price?.toFixed(2)}
                      </span>
                      {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                        <span className="text-2xl font-medium text-gray-400 line-through">
                          ₹{selectedVariant.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-slate-600 ring-1 ring-slate-200/80">
                        {selectedVariantDescription}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">
                        Inclusive of all taxes
                      </span>
                      <span className="rounded-full bg-white/90 px-3 py-1 text-slate-600 ring-1 ring-slate-200/80">
                        Free shipping across India
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:max-w-[220px] sm:justify-end">
                    {selectedSavings > 0 && (
                      <span className="rounded-full bg-gradient-to-r from-amber-50 to-lime-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                        Save ₹{selectedSavings}
                      </span>
                    )}
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80">
                      Clean, natural sweetness
                    </span>
                  </div>
                </div>

                {/* Pack Selection */}
                {defaultVariants.length > 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                        Pick the pack that fits your routine
                      </h3>
                      <span className="text-xs font-medium text-slate-400">Tap to preview</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {defaultVariants.map((variant) => {
                        const isSelected = selectedVariant.size === variant.size;
                        const savings = getVariantSavings(variant);
                        const isBestValue = savings > 0 && savings === bestVariantSavings;
                        const description = getVariantDescription(variant);

                        return (
                          <motion.button
                            key={variant.size}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedVariant(variant)}
                            className={`group relative min-h-[138px] overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                              isSelected
                                ? 'border-emerald-500 bg-white shadow-[0_18px_40px_rgba(22,101,52,0.14)] ring-2 ring-emerald-100'
                                : 'border-white/70 bg-white/85 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:border-emerald-200 hover:bg-white hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]'
                            }`}
                          >
                            <div className={`absolute inset-x-0 top-0 h-1 transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400'
                                : 'bg-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-200 group-hover:via-lime-100 group-hover:to-amber-100'
                            }`} />

                            <div className="flex h-full flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                      isSelected ? 'text-emerald-700' : 'text-slate-400'
                                    }`}>
                                      {description}
                                    </div>
                                    <div className={`font-semibold text-lg leading-tight ${
                                      isSelected ? 'text-green-700' : 'text-slate-900'
                                    }`}>
                                      {variant.size}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2">
                                    {isBestValue && (
                                      <span className="rounded-full bg-gradient-to-r from-amber-50 to-lime-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800 ring-1 ring-emerald-100">
                                        Best Value
                                      </span>
                                    )}
                                    {isSelected && (
                                      <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {savings > 0 && (
                                  <div className="text-xs font-medium text-emerald-700">
                                    You save ₹{savings} on this pack
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 flex items-end justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-baseline gap-2">
                                    <span className={`text-2xl font-bold tracking-tight ${
                                      isSelected ? 'text-green-700' : 'text-slate-900'
                                    }`}>
                                      ₹{variant.price}
                                    </span>
                                    {variant.originalPrice > variant.price && (
                                      <span className="text-sm font-medium text-gray-400 line-through">
                                        ₹{variant.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                                  isSelected
                                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                                    : 'border-slate-200 bg-slate-50 text-slate-300 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                                }`}>
                                  <Check className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-[0_24px_60px_rgba(22,101,52,0.08)]">
              <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-emerald-100/70 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-lime-100/60 blur-3xl" />
              <div className="relative space-y-4 p-6 md:p-7">
                <div className="flex flex-col gap-2 border-b border-emerald-100/80 pb-4">
                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-100">
                    What&apos;s In The Box
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-emerald-800">Everything you need in one clean, simple pack</h3>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] ring-1 ring-emerald-50">
                  <div className="prose prose-sm max-w-none space-y-3 text-slate-600">
                  {product.description?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`${index === 0 ? "text-base font-medium text-emerald-800" : "text-sm"} leading-relaxed`}>
                      {paragraph}
                    </p>
                  ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-[0_24px_60px_rgba(22,101,52,0.08)]">
              <div className="pointer-events-none absolute -left-12 top-0 h-32 w-32 rounded-full bg-emerald-100/70 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-lime-100/60 blur-3xl" />
              <div className="relative space-y-4 p-6 md:p-7">
                <div className="flex flex-col gap-2 border-b border-emerald-100/80 pb-4">
                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-100">
                    Why It&apos;s Different
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-emerald-800">Natural sweetness with a cleaner, smarter profile</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <FeatureCard emoji="🌿" title="100% Natural" description="Monk Fruit Extract" />
                  <FeatureCard emoji="🔥" title="Zero Calories" description="Zero Glycemic Index" />
                  <FeatureCard emoji="💚" title="Diabetic Friendly" description="Keto-Friendly & Diabetic-Safe" />
                  <FeatureCard emoji="💧" title="Easy Use" description="Convenient Drop Format - Easy to Mix" />
                  <FeatureCard emoji="☕" title="Versatile" description="Perfect for Tea, Coffee, Smoothies & More" />
                  <FeatureCard emoji="✨" title="Pure & Clean" description="No Artificial Flavors, Colors or Preservatives" />
                </div>
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
                  image: productImages[0],
                  variants: defaultVariants,
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
