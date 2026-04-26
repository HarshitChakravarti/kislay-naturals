'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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
  MessageSquare,
} from 'lucide-react';

const PRODUCT_TAGLINE = 'Pure Monk Fruit Sweetener - Zero Calories, Zero Guilt';

const FEATURE_ITEMS = [
  { emoji: '🌿', title: '100% Natural', description: 'Monk Fruit Extract' },
  { emoji: '🔥', title: 'Zero Calories', description: 'Zero Glycemic Index' },
  { emoji: '💚', title: 'Diabetic Friendly', description: 'Keto-Friendly and Diabetic-Safe' },
  { emoji: '💧', title: 'Easy Use', description: 'Convenient drop format that mixes easily' },
  { emoji: '☕', title: 'Versatile', description: 'Perfect for tea, coffee, smoothies and more' },
  { emoji: '✨', title: 'Pure & Clean', description: 'No artificial flavors, colors or preservatives' },
];

const priceFormatter = new Intl.NumberFormat('en-IN');

const normalizeVariantSize = (size: string) => size.trim().toLowerCase();

const formatPrice = (price: number) => priceFormatter.format(price);

/* Mobile-only: Why It's Different */

const FeatureCard = ({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) => (
  <div className="group relative h-full overflow-hidden rounded-2xl border border-green-100/90 border-t-[3px] border-t-[#4CAF50] bg-white p-4 text-left shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-transform duration-150 active:scale-[0.97] md:rounded-[24px] md:border-t md:border-t-green-100/90 md:p-5 md:shadow-[0_14px_30px_rgba(15,23,42,0.05)] md:transition-all md:duration-300 md:hover:-translate-y-1 md:hover:border-green-200 md:hover:shadow-[0_20px_40px_rgba(45,122,58,0.10)] md:active:scale-100">
    <div className="absolute inset-x-0 top-0 hidden h-1 bg-gradient-to-r from-green-700 via-green-500 to-amber-300 opacity-80 md:block" />
    <div className="pointer-events-none absolute -right-8 top-0 hidden h-20 w-20 rounded-full bg-green-100/70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 md:block" />
    <div className="relative flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FAF3] text-[32px] leading-none shadow-sm ring-1 ring-green-100 md:h-12 md:w-12 md:rounded-2xl md:text-2xl">
          <span>{emoji}</span>
        </div>
      </div>

      <div className="mt-2.5 space-y-1 md:mt-4 md:space-y-2">
        <h4 className="text-[13px] font-bold leading-tight text-[#1A3C1F] md:text-lg md:font-semibold md:leading-snug md:text-slate-900">
          {title}
        </h4>
        <p className="hidden text-xs leading-relaxed text-slate-600 md:block md:text-sm">
          {description}
        </p>
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
    numReviews: product.numReviews || 0,
  });
  const [isEnquireFormVisible, setIsEnquireFormVisible] = useState(false);
  const [enquireFormData, setEnquireFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productImages = getProductGalleryForVariant(selectedVariant);

  const getVariantSavings = useCallback(
    (variant: ProductVariant) => Math.max(0, (variant.originalPrice || 0) - variant.price),
    []
  );

  const getVariantDescription = useCallback((variant: ProductVariant) => {
    if (normalizeVariantSize(variant.size) === '30ml') {
      return 'Larger bottle';
    }

    const bottleCount = getBundleUnitCount(variant);
    return bottleCount === 1 ? 'Single bottle' : `${bottleCount} x 10ml bottles`;
  }, []);

  const fetchReviewStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${product.id}&limit=1000`);
      const data = await response.json();

      if (data.success && data.data) {
        const reviews = data.data;
        const totalReviews = data.pagination?.totalReviews ?? reviews.length;
        const reviewsWithRatings = reviews.filter(
          (review: { rating?: number | string | null }) =>
            review.rating !== null &&
            review.rating !== undefined &&
            !Number.isNaN(Number(review.rating))
        );
        const sumRatings = reviewsWithRatings.reduce(
          (sum: number, review: { rating?: number | string | null }) => {
            const rating =
              typeof review.rating === 'number'
                ? review.rating
                : Number.parseFloat(String(review.rating));
            return sum + (Number.isNaN(rating) ? 0 : rating);
          },
          0
        );
        const averageRating =
          reviewsWithRatings.length > 0 ? sumRatings / reviewsWithRatings.length : 0;

        setReviewStats({
          avgRating: Math.round(averageRating * 10) / 10,
          numReviews: totalReviews,
        });
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  }, [product.id]);

  useEffect(() => {
    setSelectedVariant(initialVariant);
    setQuantity(1);
  }, [initialVariant, product.id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant.size]);

  useEffect(() => {
    void fetchReviewStats();
  }, [fetchReviewStats]);

  const handleReviewSubmit = useCallback(() => {
    window.setTimeout(() => {
      void fetchReviewStats();
    }, 500);
    router.refresh();
  }, [fetchReviewStats, router]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleEnquireInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEnquireFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const whatsappMessage =
        `*New Product Enquiry*\n\n` +
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
        message: '',
      });
      setIsEnquireFormVisible(false);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      alert('There was an error sending your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    const productWithVariant: Product = {
      ...product,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      image: productImages[0],
      variants: defaultVariants,
    };

    onOpenCheckout?.(quantity, productWithVariant, selectedVariant.size);
  };

  const handleScrollToReviews = () => {
    document.getElementById('reviews')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const bestVariantSavings = Math.max(0, ...defaultVariants.map(getVariantSavings));
  const selectedSavings = getVariantSavings(selectedVariant);
  const selectedVariantDescription = getVariantDescription(selectedVariant);
  const isEnquireFormValid =
    enquireFormData.name &&
    enquireFormData.email &&
    enquireFormData.mobile &&
    enquireFormData.address;

  const orderedVariants = useMemo(() => {
    const priorityMap = new Map([
      ['10ml', 0],
      ['10ml pack of 2', 1],
      ['10ml pack of 3', 2],
      ['30ml', 3],
    ]);

    return [...defaultVariants].sort((first, second) => {
      const firstPriority = priorityMap.get(normalizeVariantSize(first.size)) ?? 99;
      const secondPriority = priorityMap.get(normalizeVariantSize(second.size)) ?? 99;
      return firstPriority - secondPriority;
    });
  }, [defaultVariants]);

  const descriptionParagraphs = (product.description || '')
    .split('\n\n')
    .filter((paragraph) => paragraph.trim().length > 0);

  const renderStars = (rating: number, sizeClass = 'h-4 w-4') => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-green-100'
          }`}
        />
      ))}
    </span>
  );

  const getVariantTitle = (variant: ProductVariant) => {
    const normalizedSize = normalizeVariantSize(variant.size);
    const bundleCount = getBundleUnitCount(variant);

    if (normalizedSize === '10ml') {
      return '10ml Single';
    }

    if (bundleCount > 1) {
      return `${bundleCount}x10ml Bundle`;
    }

    if (normalizedSize === '30ml') {
      return '30ml Larger Bottle';
    }

    return variant.size;
  };

  const getVariantEyebrow = (variant: ProductVariant) => {
    const normalizedSize = normalizeVariantSize(variant.size);
    const bundleCount = getBundleUnitCount(variant);

    if (normalizedSize === '10ml') {
      return 'Base price';
    }

    if (bundleCount === 3) {
      return 'Best value';
    }

    if (bundleCount > 1) {
      return 'Bundle pack';
    }

    if (normalizedSize === '30ml') {
      return 'Longer-lasting bottle';
    }

    return getVariantDescription(variant);
  };

  const selectedVariantTitle = getVariantTitle(selectedVariant);

  return (
    <div className="w-full bg-white scroll-smooth">
      <div className="w-full bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 py-3 text-sm font-medium transition-colors hover:text-white/90 md:text-base"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 pb-32 sm:px-6 sm:py-6 md:pb-10 lg:px-8 lg:py-8 lg:pb-8">
        {/* SECTION 1 - Hero Product Section */}
        <section className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-w-0 lg:sticky lg:top-6"
          >
            <div className="rounded-[26px] border border-green-100 bg-gradient-to-br from-white via-white to-green-50/60 p-3 shadow-[0_24px_60px_rgba(17,24,39,0.06)] sm:rounded-[32px] sm:p-5">
              <div className="group relative aspect-[4/3.7] overflow-hidden rounded-[22px] bg-white shadow-inner ring-1 ring-green-100/80 sm:aspect-square sm:rounded-[28px]">
                <Image
                  src={productImages[selectedImage] || product.image}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-contain p-4 sm:p-6"
                  priority
                />

                <button
                  onClick={previousImage}
                  className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md transition hover:bg-white sm:left-3 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md transition hover:bg-white sm:right-3 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0">
                {productImages.slice(0, 5).map((image, index) => (
                  <motion.button
                    key={`${image}-${index}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-sm transition-all sm:w-auto ${
                      selectedImage === index
                        ? 'border-green-600 ring-2 ring-green-100'
                        : 'border-green-100 hover:border-green-200'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 18vw, 9vw"
                      className="object-contain p-1"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="min-w-0"
          >
            <div className="rounded-[26px] border border-green-100 bg-white p-4 shadow-[0_24px_60px_rgba(17,24,39,0.06)] sm:rounded-[32px] sm:p-6">
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-800">
                    Natural Sweetener
                  </div>
                  <div className="space-y-2">
                    <h1 className="break-words text-[1.55rem] font-bold leading-tight text-slate-900 sm:text-3xl">
                      {product.name}
                    </h1>
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {PRODUCT_TAGLINE}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleScrollToReviews}
                    className="inline-flex w-full items-center justify-between gap-2 rounded-2xl bg-green-50 px-3.5 py-2 text-left text-sm font-medium text-green-800 transition hover:bg-green-100 sm:w-auto sm:justify-start sm:rounded-full sm:px-3 sm:py-1.5"
                  >
                    <span className="shrink-0">{renderStars(reviewStats.avgRating)}</span>
                    <span className="min-w-0 truncate">
                      {reviewStats.numReviews > 0
                        ? `${reviewStats.avgRating.toFixed(1)} · ${reviewStats.numReviews} review${
                            reviewStats.numReviews === 1 ? '' : 's'
                          }`
                        : 'No reviews yet'}
                    </span>
                  </button>
                </div>

                <div className="rounded-[24px] border border-green-100 bg-[#F0FAF3] p-3.5 sm:rounded-[28px] sm:p-5">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-green-100 pb-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-end gap-2">
                        <span className="text-[1.9rem] font-bold tracking-tight text-green-800 sm:text-4xl">
                          ₹{formatPrice(selectedVariant.price)}
                        </span>
                        {selectedVariant.originalPrice > selectedVariant.price && (
                          <span className="text-base font-medium text-slate-400 line-through sm:text-xl">
                            ₹{formatPrice(selectedVariant.originalPrice)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {selectedVariantDescription} · Inclusive of all taxes
                      </p>
                    </div>

                    {selectedSavings > 0 && (
                      <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                        Save ₹{formatPrice(selectedSavings)}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Choose your pack
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      {orderedVariants.map((variant) => {
                        const isSelected = selectedVariant.size === variant.size;
                        const savings = getVariantSavings(variant);
                        const isBestValue = savings > 0 && savings === bestVariantSavings;

                        return (
                          <motion.button
                            key={variant.size}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedVariant(variant)}
                            className={`relative flex min-h-[160px] w-full flex-col justify-between rounded-[24px] border p-3 text-left transition-all sm:min-h-[168px] lg:min-h-[178px] lg:p-4 ${
                              isSelected
                                ? 'border-green-600 bg-white shadow-[0_18px_38px_rgba(45,122,58,0.14)]'
                                : 'border-green-100 bg-white/90 hover:border-green-300 hover:shadow-[0_14px_28px_rgba(17,24,39,0.08)]'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:text-[11px]">
                                  {getVariantEyebrow(variant)}
                                </span>
                                {isSelected && (
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                                    <Check className="h-3.5 w-3.5" />
                                  </span>
                                )}
                              </div>

                              <div>
                                <h3 className="text-[15px] font-semibold leading-snug text-slate-900 sm:text-base lg:text-[1.15rem]">
                                  {getVariantTitle(variant)}
                                </h3>
                                {isBestValue && (
                                  <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-amber-800 sm:text-[9px]">
                                    Best Value
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-end gap-1.5">
                                <span className="text-[1.65rem] font-bold leading-none text-green-800 sm:text-[1.75rem] lg:text-[2rem]">
                                  ₹{formatPrice(variant.price)}
                                </span>
                                {variant.originalPrice > variant.price && (
                                  <span className="text-[11px] text-slate-400 line-through sm:text-xs lg:text-base">
                                    ₹{formatPrice(variant.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-600">
                                {savings > 0 ? `Save ₹${formatPrice(savings)}` : 'Everyday clean sweetness'}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">Quantity</p>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-800 transition hover:bg-green-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="w-8 text-center text-base font-bold text-slate-900">
                          {quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setQuantity((current) => current + 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-800 transition hover:bg-green-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleBuyNow}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="hidden w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-[0_20px_36px_rgba(45,122,58,0.22)] transition hover:bg-green-800 md:flex md:text-lg"
                    >
                      <Zap className="h-5 w-5" />
                      <span>Buy Now</span>
                    </motion.button>

                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setIsEnquireFormVisible((current) => !current)}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:border-green-400 hover:bg-green-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="sm:hidden">Enquire Now</span>
                        <span className="hidden sm:inline">Have Questions? Enquire Now</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isEnquireFormVisible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-[24px] border border-green-100 bg-white p-4 shadow-sm">
                              <form onSubmit={handleEnquireSubmit} className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <label
                                      htmlFor="enquire-name"
                                      className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                      Full Name *
                                    </label>
                                    <input
                                      type="text"
                                      id="enquire-name"
                                      name="name"
                                      value={enquireFormData.name}
                                      onChange={handleEnquireInputChange}
                                      required
                                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                      placeholder="Enter your full name"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="enquire-email"
                                      className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                      Email Address *
                                    </label>
                                    <input
                                      type="email"
                                      id="enquire-email"
                                      name="email"
                                      value={enquireFormData.email}
                                      onChange={handleEnquireInputChange}
                                      required
                                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                      placeholder="Enter your email address"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="enquire-mobile"
                                      className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                      Mobile Number *
                                    </label>
                                    <input
                                      type="tel"
                                      id="enquire-mobile"
                                      name="mobile"
                                      value={enquireFormData.mobile}
                                      onChange={handleEnquireInputChange}
                                      required
                                      pattern="[0-9]{10}"
                                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                      placeholder="Enter your mobile number"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="enquire-address"
                                      className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                      Short Address *
                                    </label>
                                    <input
                                      type="text"
                                      id="enquire-address"
                                      name="address"
                                      value={enquireFormData.address}
                                      onChange={handleEnquireInputChange}
                                      required
                                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                      placeholder="City, State"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor="enquire-message"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                  >
                                    Additional Message
                                  </label>
                                  <textarea
                                    id="enquire-message"
                                    name="message"
                                    value={enquireFormData.message}
                                    onChange={handleEnquireInputChange}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                    placeholder="Any specific questions or requirements..."
                                  />
                                </div>

                                <motion.button
                                  type="submit"
                                  disabled={!isEnquireFormValid || isSubmitting}
                                  whileHover={{ scale: isEnquireFormValid ? 1.01 : 1 }}
                                  whileTap={{ scale: isEnquireFormValid ? 0.99 : 1 }}
                                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    isEnquireFormValid
                                      ? 'bg-primary text-primary-foreground hover:bg-green-800'
                                      : 'cursor-not-allowed bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-b-white" />
                                      <span>Sending...</span>
                                    </>
                                  ) : (
                                    <span>Send Enquiry via WhatsApp</span>
                                  )}
                                </motion.button>
                              </form>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mt-10 space-y-10 lg:mt-12">
          {/* SECTION 2 - What's In The Box */}
          <section className="rounded-[24px] border border-green-100 bg-[#F0FAF3] p-4 shadow-[0_20px_46px_rgba(17,24,39,0.05)] sm:rounded-[32px] sm:p-8">
            <div className="max-w-4xl space-y-3 sm:space-y-4">
              <div className="inline-flex rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-800">
                What&apos;s In The Box
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-green-900 sm:text-3xl">
                  Everything you need in one clean, simple pack
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-white/80 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-[28px] sm:p-6">
              <div className="space-y-3 text-sm leading-relaxed text-slate-600 sm:space-y-4 sm:text-base">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((paragraph, index) => (
                    <p
                      key={`${paragraph.slice(0, 24)}-${index}`}
                      className={index === 0 ? 'font-medium text-green-900' : ''}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="font-medium text-green-900">
                    Clean monk fruit sweetness designed for simple, everyday use.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3 - Why It&apos;s Different */}
          <section className="relative overflow-hidden rounded-[28px] border border-green-100 bg-gradient-to-br from-white via-[#FCFFFD] to-[#F0FAF3] px-4 py-6 shadow-[0_24px_56px_rgba(15,23,42,0.05)] md:p-6 lg:p-8">
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 rounded-full bg-green-100/50 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full bg-amber-100/30 blur-3xl" />

            <div className="relative grid gap-7 md:gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-8">
              <div className="space-y-5 md:space-y-4">
                <div className="inline-flex rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-800 shadow-sm md:tracking-[0.22em]">
                  Why It&apos;s Different
                </div>
                <div className="space-y-3">
                  <h2 className="mb-3 max-w-xl text-[26px] font-semibold leading-[1.3] tracking-tight text-green-900 md:mb-0 md:text-3xl md:leading-tight lg:text-[2.35rem]">
                    Natural sweetness with a cleaner, smarter profile
                  </h2>
                  <p className="max-w-xl text-left text-[14px] leading-[1.7] text-slate-600 md:text-base md:leading-relaxed">
                    Built for health-conscious routines, Kislay Naturals keeps sweetness
                    simple, versatile and trustworthy in every drop.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 md:pt-1">
                  <span className="rounded-full bg-[#2D7A3A] px-4 py-2 text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(45,122,58,0.25)] md:border md:border-green-200 md:bg-green-50 md:px-3 md:py-1.5 md:text-xs md:font-medium md:text-green-800 md:shadow-none">
                    6 everyday benefits
                  </span>
                  <span className="rounded-full border border-[#2D7A3A] bg-white px-4 py-2 text-[13px] font-semibold text-[#2D7A3A] md:border-slate-200 md:px-3 md:py-1.5 md:text-xs md:font-medium md:text-slate-600">
                    Tea, coffee, smoothies and more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {FEATURE_ITEMS.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    emoji={feature.emoji}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4 - Customer Reviews */}
          <section id="reviews" className="scroll-mt-24">
            <ProductReviews
              productId={String(product.id)}
              productName={product.name}
              onReviewSubmit={handleReviewSubmit}
            />
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-green-200 bg-white/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-18px_40px_rgba(17,24,39,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {selectedVariantTitle}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-xl font-bold tracking-tight text-green-900">
                ₹{formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{formatPrice(selectedVariant.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleBuyNow}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-w-[132px] items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_32px_rgba(45,122,58,0.2)] transition hover:bg-green-800"
          >
            <Zap className="h-4 w-4" />
            <span>Buy Now</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
