'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TouchEvent } from 'react';

import CheckoutModal from '@/components/CheckoutModal';
import EnquireNowModal from '@/components/EnquireNowModal';
import ProductReviews from '@/components/ProductReviews';
import { MessageSquare } from 'lucide-react';

type Variant = {
  id: string;
  label: string;
  name: string;
  price: number;
  mrp: number;
  savings: number;
};

type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
};

const PRODUCT_NAME = 'Kislay Monk Fruit Sweetener Drops';
const PRODUCT_TAGLINE = 'Pure Monk Fruit Sweetener — Zero Calories, Zero Guilt';
const BRAND_TAGLINE = 'Naturally Trusted | Deeply Connected | Truly Healthy';
const DEFAULT_PRODUCT_ID = 'kislay-monk-fruit-sweetener-drops';

const productImages = ['/product1.png', '/product2.png', '/product3.png', '/product4.png', '/product5.png'];

const variants: Variant[] = [
  {
    id: '10ml',
    label: 'Base Price',
    name: '10ml Single',
    price: 299,
    mrp: 399,
    savings: 100,
  },
  {
    id: '10ml pack of 2',
    label: 'Bundle Pack',
    name: '2x10ml Bundle',
    price: 549,
    mrp: 798,
    savings: 249,
  },
  {
    id: '10ml pack of 3',
    label: 'Most Popular',
    name: '3x10ml Bundle',
    price: 799,
    mrp: 1197,
    savings: 398,
  },
  {
    id: '30ml',
    label: 'Longer Lasting',
    name: '30ml Larger Bottle',
    price: 699,
    mrp: 999,
    savings: 300,
  },
];

const trustItems = [
  { icon: '🧪', text: 'Clinically Tested' },
  { icon: '🌿', text: '100% Natural Monk Fruit' },
  { icon: '✓', text: 'FSSAI Approved' },
  { icon: '0️⃣', text: 'Zero Calories · Zero Carbs' },
];

const socialProofStats = [
  { value: '1k+', label: 'Happy Customers' },
  { value: '5.0★', label: 'Average Rating' },
  { value: '300x', label: 'Sweeter Than Sugar' },
];

const ingredients = [
  {
    icon: '🍈',
    name: 'Monk Fruit Extract',
    benefit: 'The natural sweetness source, 0 glycemic index',
  },
  {
    icon: '💧',
    name: 'Purified Water',
    benefit: 'Clean base, no fillers, no additives',
  },
  {
    icon: '✨',
    name: 'Vitamin C',
    benefit: 'The active compound responsible for longer shelf life',
  },
];

const audienceChecklist = [
  'You have diabetes or pre-diabetes',
  'You follow a keto or low-carb diet',
  'Sugar runs in your family',
  'You want to lose weight without sacrificing taste',
  'You want a healthier sweetener for your children',
  "You're tired of bitter aftertaste from artificial sweeteners",
];

const certificationBadges = [
  { icon: '✓', title: 'FSSAI Approved' },
  { icon: '🌿', title: '100% Natural Ingredients' },
  { icon: '🧪', title: 'Third-Party Lab Tested' },
];

// Reviews are now fetched from the server API (Supabase)
const REVIEWS_PER_PAGE = 24;

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN').format(price);
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[2]);
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showStickyBars, setShowStickyBars] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const mainCtaRef = useRef<HTMLButtonElement | null>(null);
  const reviewsRef = useRef<HTMLElement | null>(null);
  const trustTickerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const target = mainCtaRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBars(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ticker = trustTickerRef.current;

    if (!ticker) {
      return;
    }

    const interval = window.setInterval(() => {
      if (window.innerWidth >= 768) {
        return;
      }

      ticker.scrollLeft += 1;

      if (ticker.scrollLeft >= ticker.scrollWidth / 2) {
        ticker.scrollLeft = 0;
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, []);

  const handleBuyNow = () => {
    setIsCheckoutOpen(true);
  };

  const handleReviewsClick = () => {
    setIsReviewFormOpen(true);
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      setSelectedImage((current) =>
        deltaX > 0
          ? (current + 1) % productImages.length
          : (current - 1 + productImages.length) % productImages.length
      );
    }

    touchStartX.current = null;
  };

  return (
    <main className="min-h-screen bg-white pb-24 font-heading font-normal text-[#1a1a1a] md:pb-0">
      {/* Sticky Mobile CTA Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d7eadf] bg-white/95 px-4 pb-[max(calc(env(safe-area-inset-bottom)+0.75rem),0.75rem)] pt-3 backdrop-blur-md shadow-[0_-8px_16px_rgba(0,0,0,0.08)] md:hidden">
        <div className="grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
              {selectedVariant.name} {quantity > 1 ? `(x${quantity})` : ''}
            </p>
            <p className="text-left text-2xl font-bold tracking-tight text-[#1a5c38]">
              ₹{formatPrice(selectedVariant.price * quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex h-[52px] w-full items-center justify-center rounded-[50px] bg-[#1a5c38] px-4 text-[15px] font-bold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-[#13472b] active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            Buy Now
          </button>
        </div>
      </div>

      {/* Trust Strip */}
      <section className="w-full bg-[#1a5c38] text-white">
        <div
          ref={trustTickerRef}
          className="mx-auto flex max-w-7xl gap-8 overflow-hidden whitespace-nowrap px-4 py-2 text-[12px] md:justify-center md:gap-10 md:px-6 md:text-sm"
        >
          {trustItems.map((item) => (
            <div key={item.text} className="flex shrink-0 items-center gap-2 font-normal">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
          {trustItems.map((item) => (
            <div
              key={`${item.text}-mobile-loop`}
              className="flex shrink-0 items-center gap-2 font-normal md:hidden"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Product Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] md:px-6 md:py-12">
        <div className="space-y-4">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative aspect-square overflow-hidden rounded-[12px] border border-[#d7eadf] bg-[#f8fcfa]"
          >
            <Image
              src={productImages[selectedImage]}
              alt={`${PRODUCT_NAME} product image ${selectedImage + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {productImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-[12px] border bg-white transition-colors duration-200 ease-in-out ${
                  selectedImage === index
                    ? 'border-[#1a5c38]'
                    : 'border-[#d7eadf] hover:border-[#1a5c38]'
                }`}
                aria-label={`View product image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${PRODUCT_NAME} thumbnail ${index + 1}`}
                  fill
                  sizes="20vw"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[12px] border border-[#d7eadf] bg-white p-4 md:p-6">
          <div className="inline-flex rounded-[8px] bg-[#e8f5ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1a5c38]">
            Natural Sweetener
          </div>

          <h1 className="mt-4 text-[26px] font-semibold leading-tight text-[#1a1a1a] md:text-[32px]">
            {PRODUCT_NAME}
          </h1>
          <p className="mt-2 text-left text-sm font-normal text-[#6b7280] md:text-base">
            {PRODUCT_TAGLINE}
          </p>
          <p className="mt-1 text-left text-xs font-normal text-[#6b7280] md:text-sm">
            {BRAND_TAGLINE}
          </p>

          <button
            type="button"
            onClick={handleReviewsClick}
            className="mt-4 flex items-center gap-2 text-sm font-normal text-[#1a5c38] transition-colors duration-200 ease-in-out hover:text-[#13472b]"
          >
            <span className="text-[#c9962a]">★★★★★</span>
            <span>5.0 · 24 reviews</span>
          </button>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-[34px] font-semibold leading-none text-[#1a5c38] md:text-[42px]">
              ₹{formatPrice(selectedVariant.price)}
            </span>
            <span className="text-lg font-normal text-[#9ca3af] line-through">
              ₹{formatPrice(selectedVariant.mrp)}
            </span>
            <span className="rounded-[8px] bg-[#fff7e6] px-3 py-1 text-xs font-semibold uppercase text-[#c9962a]">
              Save ₹{formatPrice(selectedVariant.savings)}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
              Choose your pack
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 min-[480px]:grid-cols-2">
              {variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative flex min-h-[150px] flex-col justify-between rounded-[12px] border bg-white p-3 sm:p-4 text-left transition-colors duration-200 ease-in-out ${
                      isSelected ? 'border-[#1a5c38] shadow-[0_4px_12px_rgba(26,92,56,0.1)]' : 'border-[#d7eadf] hover:border-[#1a5c38]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 sm:gap-3">
                        <span
                          className={`rounded-[8px] px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide leading-none ${
                            variant.label === 'Most Popular'
                              ? 'bg-[#fff7e6] text-[#c9962a]'
                              : 'bg-[#e8f5ee] text-[#1a5c38]'
                          }`}
                        >
                          {variant.label}
                        </span>
                        {isSelected && (
                          <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[#1a5c38] text-[10px] sm:text-xs font-semibold text-white">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-3 sm:mt-4 text-left text-[13px] sm:text-base font-semibold leading-tight text-[#1a1a1a]">
                        {variant.name}
                      </p>
                    </div>
                    
                    <div className="mt-2 sm:mt-3">
                      <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-2xl font-semibold leading-none text-[#1a5c38]">
                          ₹{formatPrice(variant.price)}
                        </span>
                        <span className="text-[11px] sm:text-sm font-normal text-[#9ca3af] line-through">
                          ₹{formatPrice(variant.mrp)}
                        </span>
                      </div>
                      <p className="mt-1 sm:mt-2 text-left text-[10px] sm:text-xs font-normal text-[#c9962a]">
                        Save ₹{formatPrice(variant.savings)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[12px] border border-[#d7eadf] px-4 py-3">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7eadf] text-lg font-normal text-[#1a5c38] transition-colors duration-200 ease-in-out hover:bg-[#e8f5ee]"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7eadf] text-lg font-normal text-[#1a5c38] transition-colors duration-200 ease-in-out hover:bg-[#e8f5ee]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            ref={mainCtaRef}
            type="button"
            onClick={handleBuyNow}
            className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[50px] bg-[#1a5c38] text-base font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-[#13472b]"
          >
            ⚡ Buy Now
          </button>

          <button
            type="button"
            onClick={() => setIsEnquireModalOpen(true)}
            className="mt-3 flex h-[48px] w-full items-center justify-center rounded-[50px] border border-[#1a5c38] bg-white text-sm font-semibold text-[#1a5c38] transition-colors duration-200 ease-in-out hover:bg-[#e8f5ee]"
          >
            Have Questions? Enquire Now
          </button>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 md:grid-cols-3 md:px-6 md:pb-12">
        {socialProofStats.map((stat) => (
          <div key={stat.label} className="rounded-[12px] bg-[#e8f5ee] p-5 text-center">
            <p className="text-center text-3xl font-semibold text-[#1a5c38] md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-center text-sm font-normal text-[#6b7280]">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Ingredients Spotlight */}
      <section className="bg-[#e8f5ee]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
            What's Inside?
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {ingredients.map((ingredient) => (
              <div key={ingredient.name} className="rounded-[12px] bg-white p-5">
                <div className="text-[40px] leading-none">{ingredient.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a]">{ingredient.name}</h3>
                <p className="mt-2 text-left text-sm font-normal text-[#6b7280]">
                  {ingredient.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-3 bg-white md:h-4" aria-hidden="true" />

      {/* Who Is This For */}
      <section className="bg-[#e8f5ee]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
            This is for you if...
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {audienceChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[12px] bg-white p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a5c38] text-xs font-semibold text-white">
                  ✓
                </span>
                <p className="text-left text-sm font-normal text-[#1a1a1a] md:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-3 bg-white md:h-4" aria-hidden="true" />

      {/* Lab Verified Section */}
      <section className="bg-[#f0faf5]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[minmax(0,1fr)_360px] md:px-6 md:py-12">
          <div>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
              🧪 Clinically Tested & Lab Verified
            </h2>
            <p className="mt-3 max-w-2xl text-left text-sm font-normal leading-6 text-[#6b7280] md:text-base">
              Independent lab tests confirm: Kislay Monk Fruit drops have zero effect on blood
              glucose levels.
            </p>

            <div className="mt-6 rounded-[12px] border border-[#d7eadf] bg-white p-5">
              <div className="grid max-w-sm grid-cols-10 gap-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={`aspect-square rounded-full border ${
                      index < 9 ? 'border-[#1a5c38] bg-[#1a5c38]' : 'border-[#1a5c38] bg-white'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-left text-sm font-semibold text-[#1a1a1a]">
                9 out of 10 users reported no blood sugar spike after 30 days
              </p>
            </div>

            <a
              href="https://qbubtexkhvhrrakoohiu.supabase.co/storage/v1/object/public/public_docs/labreport.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-12 items-center rounded-[50px] border border-[#1a5c38] px-6 text-sm font-semibold text-[#1a5c38] transition-colors duration-200 ease-in-out hover:bg-[#e8f5ee]"
            >
              Download Full Lab Report (PDF)
            </a>
          </div>

          <div className="space-y-3">
            {certificationBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3 rounded-[12px] bg-white p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5ee] text-lg">
                  {badge.icon}
                </span>
                <p className="text-left text-base font-semibold text-[#1a1a1a]">{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-3 bg-white md:h-4" aria-hidden="true" />

      {/* Customer Reviews Section */}
      <section ref={reviewsRef} className="scroll-mt-28 bg-[#e8f5ee]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
                Customer Reviews
              </h2>
              <p className="mt-1 text-left text-sm font-normal text-[#6b7280]">
                Real feedback from customers using this product every day.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewFormOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-800 transition hover:border-green-500 hover:bg-green-50 sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Write a Review</span>
            </button>
          </div>

          <ProductReviews
            productId={params?.id ?? DEFAULT_PRODUCT_ID}
            productName={PRODUCT_NAME}
            openReviewForm={isReviewFormOpen}
          />
        </div>
      </section>

      {/* Enquire Now Modal */}
      <EnquireNowModal
        isOpen={isEnquireModalOpen}
        onClose={() => setIsEnquireModalOpen(false)}
        productName={PRODUCT_NAME}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={{
          id: params?.id ?? DEFAULT_PRODUCT_ID,
          name: PRODUCT_NAME,
          price: selectedVariant.price,
          image: productImages[0],
          description: PRODUCT_TAGLINE
        } as any}
        quantity={quantity}
        variantSize={selectedVariant.id}
      />
    </main>
  );
}
