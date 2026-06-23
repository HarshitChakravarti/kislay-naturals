'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  image?: string;
};

const BRAND_TAGLINE = 'Naturally Trusted | Deeply Connected | Truly Healthy';

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

// ingredients array is now computed inside ProductDetailClient based on the product

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

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN').format(price);
}

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();

  const productNameLower = product?.name?.toLowerCase() || '';
  let thirdIngredient = {
    icon: '✨',
    name: 'Vitamin C',
    benefit: 'The active compound responsible for longer shelf life',
  };

  if (productNameLower.includes('erythritol')) {
    thirdIngredient = {
      icon: '❄️',
      name: 'Erythritol',
      benefit: 'A natural sugar alcohol that provides bulk and sweetness without calories',
    };
  } else if (productNameLower.includes('allulose')) {
    thirdIngredient = {
      icon: '🍯',
      name: 'Allulose',
      benefit: 'A rare sugar that tastes like sugar but has almost no calories',
    };
  }

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
    thirdIngredient,
  ];

  // --- DYNAMIC THEME SETUP ---
  const themeColor = product.theme_color || 'green'; // Fetch from DB!
  
  const themes: Record<string, any> = {
    green: {
      bgMain: 'bg-[#16a34a]',
      bgHover: 'hover:bg-[#15803d]',
      textMain: 'text-[#16a34a]',
      textHover: 'hover:text-[#15803d]',
      borderMain: 'border-[#16a34a]',
      borderHover: 'hover:border-[#16a34a]',
      bgLight: 'bg-[#e8f5ee]',
      bgLightHover: 'hover:bg-[#e8f5ee]',
      bgLighter: 'bg-[#f0faf5]',
      borderLight: 'border-[#d7eadf]',
      shadow: 'shadow-[0_4px_12px_rgba(26,92,56,0.1)]'
    },
    blue: {
      bgMain: 'bg-[#3c505a]',
      bgHover: 'hover:bg-[#2d3c43]',
      textMain: 'text-[#3c505a]',
      textHover: 'hover:text-[#2d3c43]',
      borderMain: 'border-[#3c505a]',
      borderHover: 'hover:border-[#3c505a]',
      bgLight: 'bg-[#eceeef]',
      bgLightHover: 'hover:bg-[#e2e6e8]',
      bgLighter: 'bg-[#f5f6f7]',
      borderLight: 'border-[#d8dcde]',
      shadow: 'shadow-[0_4px_12px_rgba(60,80,90,0.1)]'
    },
    orange: {
      bgMain: 'bg-[#9d7f3c]',
      bgHover: 'hover:bg-[#856c33]',
      textMain: 'text-[#9d7f3c]',
      textHover: 'hover:text-[#856c33]',
      borderMain: 'border-[#9d7f3c]',
      borderHover: 'hover:border-[#9d7f3c]',
      bgLight: 'bg-[#9d7f3c]/10',
      bgLightHover: 'hover:bg-[#9d7f3c]/20',
      bgLighter: 'bg-[#9d7f3c]/5',
      borderLight: 'border-[#9d7f3c]/30',
      shadow: 'shadow-[0_4px_12px_rgba(157,127,60,0.2)]'
    }
  };
  const t = themes[themeColor] || themes['green'];
  // ---------------------------


  // 1. Dynamic product details mapping
  const PRODUCT_NAME = product.name;
  const PRODUCT_TAGLINE = product.tagline || 'Pure Monk Fruit Sweetener — Zero Calories, Zero Guilt';
  const PRODUCT_ID = product.id;

  // 2. Dynamic variants mapping
  const mappedVariants: Variant[] = (product.variants || []).map((v: any, index: number) => {
    let label = 'Base Price';
    let name = v.size;

    // Preserve the clean labels & naming for original sweetener variants, but adapt gracefully to others
    if (v.size.toLowerCase().includes('pack of 2')) {
      label = 'Bundle Pack';
      name = '2x10ml Bundle';
    } else if (v.size.toLowerCase().includes('pack of 3')) {
      label = 'Most Popular';
      name = '3x10ml Bundle';
    } else if (v.size.toLowerCase().includes('30ml')) {
      label = 'Longer Lasting';
      name = '30ml Larger Bottle';
    } else if (v.size.toLowerCase().includes('10ml')) {
      label = 'Base Price';
      name = '10ml Single';
    } else {
      // Fallbacks for other dynamic products
      if (index === 0) label = 'Base Price';
      else if (index === 1) label = 'Bundle Pack';
      else if (index === 2) label = 'Most Popular';
      else label = 'Variant Option';
    }

    return {
      id: v.size,
      label,
      name,
      price: v.price,
      mrp: v.originalPrice || v.price,
      savings: Math.max(0, (v.originalPrice || v.price) - v.price),
      image: v.image
    };
  });

  // Fallback variants if database contains empty arrays
  const variants = mappedVariants.length > 0 ? mappedVariants : [
    {
      id: 'default',
      label: 'Base Price',
      name: 'Standard Unit',
      price: product.price || 299,
      mrp: product.original_price || product.price || 399,
      savings: Math.max(0, (product.original_price || product.price || 399) - (product.price || 299)),
    }
  ];

  // Set default selected variant: Try to find 'Most Popular' (index 2 for monk fruit) or fallback to first one
  const defaultSelected = variants.find(v => v.label === 'Most Popular') || variants[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(defaultSelected);
  const [quantity, setQuantity] = useState(1);

  // Reset selected image to 0 when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  // Compute carousel list: Move variant's cover image to the front, and filter out irrelevant covers based on variant size selection
  const baseImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/sweetener-drops/10ml.png'];

  const productImages = (() => {
    let list = baseImages;
    
    const isPack = selectedVariant?.id.toLowerCase().includes('pack of');
    if (isPack) {
      // If the selected variant is a pack, exclude all single-bottle cover images from the carousel
      list = list.filter(img => 
        img !== '/sweetener-drops/10ml.png' && 
        img !== '/sweetener-drops/30ml.png' && 
        img !== '/sweetener-drops/1.png' &&
        img !== product.image
      );
    } else {
      // If a single bottle or bag size is selected, exclude the cover image of the OTHER size
      const sizeId = selectedVariant?.id || '';
      if (sizeId.includes('10ml')) {
        list = list.filter(img => img !== '/sweetener-drops/30ml.png');
      } else if (sizeId.includes('30ml')) {
        list = list.filter(img => img !== '/sweetener-drops/10ml.png');
      } else if (sizeId.toLowerCase().includes('200g')) {
        list = list.filter(img => 
          img !== '/erythritol/400g.png' && 
          img !== '/allulose/400g.png'
        );
      } else if (sizeId.toLowerCase().includes('400g')) {
        list = list.filter(img => 
          img !== '/erythritol/1.png' && 
          img !== '/allulose/1.png'
        );
      }
    }

    if (selectedVariant?.image) {
      const variantImg = selectedVariant.image;
      return [variantImg, ...list.filter(img => img !== variantImg)];
    }

    return list;
  })();
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
      <div className={`fixed inset-x-0 bottom-0 z-50 border-t ${t.borderLight} bg-white/95 px-4 pb-[max(calc(env(safe-area-inset-bottom)+0.75rem),0.75rem)] pt-3 backdrop-blur-md shadow-[0_-8px_16px_rgba(0,0,0,0.08)] md:hidden`}>
        <div className="grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
              {selectedVariant.name} {quantity > 1 ? `(x${quantity})` : ''}
            </p>
            <p className={`text-left text-2xl font-bold tracking-tight ${t.textMain}`}>
              ₹{formatPrice(selectedVariant.price * quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className={`flex h-[52px] w-full items-center justify-center rounded-[50px] ${t.bgMain} px-4 text-[15px] font-bold text-white shadow-md transition-all duration-200 ease-in-out ${t.bgHover} active:scale-[0.98]`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            Buy Now
          </button>
        </div>
      </div>

      {/* Trust Strip */}
      <section className={`w-full ${t.bgMain} text-white`}>
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
            className={`relative aspect-square overflow-hidden rounded-[12px] border ${t.borderLight} bg-[#f8fcfa]`}
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
                    ? '${t.borderMain}'
                    : '${t.borderLight} hover:${t.borderMain}'
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

        <div className={`rounded-[12px] border ${t.borderLight} bg-white p-4 md:p-6`}>
          <div className={`inline-flex rounded-[8px] ${t.bgLight} px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${t.textMain}`}>
            Natural Sweetener
          </div>

          <h1 className="mt-4 text-[26px] font-semibold leading-tight text-[#1a1a1a] md:text-[32px]">
            {PRODUCT_NAME}
          </h1>
          <p className="mt-2 text-left text-sm font-normal text-[#6b7280] md:text-base">
            {product.description}
          </p>
          <p className="mt-1 text-left text-xs font-normal text-[#6b7280] md:text-sm">
            {product.tagline}
          </p>

          <button
            type="button"
            onClick={handleReviewsClick}
            className={`mt-4 flex items-center gap-2 text-sm font-normal ${t.textMain} transition-colors duration-200 ease-in-out ${t.textHover}`}
          >
            <span className="text-[#c9962a]">★★★★★</span>
            <span>5.0 · 24 reviews</span>
          </button>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className={`text-[34px] font-semibold leading-none ${t.textMain} md:text-[42px]`}>
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
                    className={`relative flex min-h-[120px] sm:min-h-[150px] flex-col justify-between rounded-[12px] border bg-white p-3 sm:p-4 text-left transition-colors duration-200 ease-in-out ${
                      isSelected ? '${t.borderMain} ${t.shadow}' : '${t.borderLight} hover:${t.borderMain}'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 sm:gap-3">
                        <span
                          className={`rounded-[8px] px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide leading-none ${
                            variant.label === 'Most Popular'
                              ? 'bg-[#fff7e6] text-[#c9962a]'
                              : '${t.bgLight} ${t.textMain}'
                          }`}
                        >
                          {variant.label}
                        </span>
                        {isSelected && (
                          <span className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full ${t.bgMain} text-[10px] sm:text-xs font-semibold text-white`}>
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
                        <span className={`text-lg sm:text-2xl font-semibold leading-none ${t.textMain}`}>
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

          <div className={`mt-5 flex items-center justify-between rounded-[12px] border ${t.borderLight} px-4 py-3`}>
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${t.borderLight} text-lg font-normal ${t.textMain} transition-colors duration-200 ease-in-out hover:${t.bgLight}`}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${t.borderLight} text-lg font-normal ${t.textMain} transition-colors duration-200 ease-in-out hover:${t.bgLight}`}
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
            className={`mt-5 flex h-[52px] w-full items-center justify-center rounded-[50px] ${t.bgMain} text-base font-semibold text-white transition-colors duration-200 ease-in-out ${t.bgHover}`}
          >
            ⚡ Buy Now
          </button>

          <button
            type="button"
            onClick={() => setIsEnquireModalOpen(true)}
            className={`mt-3 flex h-[48px] w-full items-center justify-center rounded-[50px] border ${t.borderMain} bg-white text-sm font-semibold ${t.textMain} transition-colors duration-200 ease-in-out hover:${t.bgLight}`}
          >
            Have Questions? Enquire Now
          </button>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 md:grid-cols-3 md:px-6 md:pb-12">
        {socialProofStats.map((stat) => (
          <div key={stat.label} className={`rounded-[12px] ${t.bgLight} p-5 text-center`}>
            <p className={`text-center text-3xl font-semibold ${t.textMain} md:text-4xl`}>
              {stat.value}
            </p>
            <p className="mt-1 text-center text-sm font-normal text-[#6b7280]">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Ingredients Spotlight */}
      <section className={`${t.bgLight}`}>
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
            What&apos;s Inside?
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
      <section className={`${t.bgLight}`}>
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
            This is for you if...
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {audienceChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[12px] bg-white p-4">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${t.bgMain} text-xs font-semibold text-white`}>
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
      <section className={`${t.bgLighter}`}>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[minmax(0,1fr)_360px] md:px-6 md:py-12">
          <div>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
              🧪 Clinically Tested & Lab Verified
            </h2>
            <p className="mt-3 max-w-2xl text-left text-sm font-normal leading-6 text-[#6b7280] md:text-base">
              Independent lab tests confirm: Kislay Monk Fruit drops have zero effect on blood
              glucose levels.
            </p>

            <div className={`mt-6 rounded-[12px] border ${t.borderLight} bg-white p-5`}>
              <div className="grid max-w-sm grid-cols-10 gap-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={`aspect-square rounded-full border ${
                      index < 9 ? '${t.borderMain} ${t.bgMain}' : '${t.borderMain} bg-white'
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
              className={`mt-5 inline-flex h-12 items-center rounded-[50px] border ${t.borderMain} px-6 text-sm font-semibold ${t.textMain} transition-colors duration-200 ease-in-out hover:${t.bgLight}`}
            >
              Download Full Lab Report (PDF)
            </a>
          </div>

          <div className="space-y-3">
            {certificationBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3 rounded-[12px] bg-white p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bgLight} text-lg`}>
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
      <section ref={reviewsRef} className={`scroll-mt-28 ${t.bgLight}`}>
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
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border ${t.borderMain} bg-white px-5 py-3 text-sm font-semibold ${t.textMain} transition ${t.borderHover} ${t.bgLightHover} sm:w-auto`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Write a Review</span>
            </button>
          </div>

          <ProductReviews
            productId={PRODUCT_ID}
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
          id: PRODUCT_ID,
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
