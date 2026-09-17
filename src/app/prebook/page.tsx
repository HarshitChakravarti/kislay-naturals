"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Leaf,
  Gift,
  Zap,
  Heart,
  Clock,
  Sparkles,
  Droplets,
  Activity,
} from "lucide-react";

// ─── Seabuckthorn Benefits ───────────────────────────────────────────────────
const seabuckthornBenefits = [
  {
    image: "/images/benefits/vitamin-c.jpg",
    title: "Rich in Vitamin C",
    description:
      "Packed with natural Vitamin C to boost your immunity and promote radiant skin.",
  },
  {
    image: "/images/benefits/omega-7.jpg",
    title: "Omega-7 Fatty Acids",
    description:
      "A rare plant source of Omega-7, essential for healthy skin, hair, and nails.",
  },
  {
    image: "/images/benefits/antioxidants.jpg",
    title: "Powerful Antioxidants",
    description:
      "Protects your cells from oxidative stress and environmental damage.",
  },
  {
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    title: "Digestive Support",
    description:
      "Supports a healthy gut lining and promotes smooth digestion naturally.",
  },
  {
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80",
    title: "Heart Health",
    description:
      "Helps maintain healthy cholesterol and supports overall cardiovascular wellness.",
  },
  {
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80",
    title: "100% Pure & Cold Processed",
    description:
      "Retains maximum nutrients without heat damage. No artificial additives.",
  },
];

// ─── Pre-order product constants ─────────────────────────────────────────────
const PREORDER_PRODUCT_ID = "46e01087-7c08-418e-8b53-9b7c071ad388";
const PREORDER_PRODUCT_NAME = "Kislay Seabuckthorn Pulp Pre-order Bundle";
const PREORDER_PRODUCT_DESCRIPTION =
  "Pre-order bundle includes a free Kislay Monk Fruit Sweetener Drops (10ml) bottle worth Rs.399.";
const PREORDER_IMAGE = "/images/prelaunch/seabuckthorn-prebook.jpg";
const PREORDER_MRP = 1199;
const PREORDER_GIFT_VALUE = 399;
const PREORDER_TOTAL_VALUE = PREORDER_MRP + PREORDER_GIFT_VALUE; // 1598
const PREORDER_PRICE = 649;
const PREORDER_SAVINGS = PREORDER_TOTAL_VALUE - PREORDER_PRICE; // 949
const PREORDER_DISCOUNT_PCT = Math.round(
  (PREORDER_SAVINGS / PREORDER_TOTAL_VALUE) * 100
); // 59
// ─────────────────────────────────────────────────────────────────────────────

/** URL to the shared /checkout page, pre-filled with this pre-order product. */
const checkoutUrl =
  "/checkout?productId=" +
  encodeURIComponent(PREORDER_PRODUCT_ID) +
  "&productName=" +
  encodeURIComponent(PREORDER_PRODUCT_NAME) +
  "&productImage=" +
  encodeURIComponent(PREORDER_IMAGE) +
  "&productDescription=" +
  encodeURIComponent(PREORDER_PRODUCT_DESCRIPTION) +
  "&quantity=1";

// ─── Marquee ticker items ────────────────────────────────────────────────────
const tickerItems = [
  { text: "Wild Himalayan Seabuckthorn", icon: Leaf },
  { text: "Cold Processed", icon: Zap },
  { text: "Rich in Vitamin C & Omega-7", icon: Heart },
  { text: "Free Monk Fruit Drops Included", icon: Gift },
  { text: "Limited Pre-launch Batch", icon: Clock },
  { text: "100% Natural", icon: Sparkles },
];

export default function PreBookPage() {
  const marqueeItems = [
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
  ];

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      {/* ── Section 1: Exclusive Pre-Launch Offer Banner ───────────────────── */}
      <section className="relative bg-green-700 text-white py-8 md:py-12 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-semibold mb-3 font-heading uppercase !text-center text-center">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                Exclusive Pre-Launch Offer
              </span>
              {" 🍊"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto !text-center text-center">
              Get ₹{PREORDER_TOTAL_VALUE.toLocaleString("en-IN")} worth of
              products for just{" "}
              <span className="font-bold text-yellow-300">
                ₹{PREORDER_PRICE}
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Yellow Marquee Banner (Shifted below offer header) ──── */}
      <div className="relative w-full overflow-hidden bg-yellow-400 py-2.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-y border-yellow-500">
        <div className="flex w-max animate-marquee items-center gap-8 px-4 sm:gap-12">
          {marqueeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 text-green-950 font-bold text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap"
              >
                <Icon className="h-4 w-4 text-green-800 shrink-0" />
                <span>{item.text}</span>
                <span className="ml-8 text-green-900/30 sm:ml-12 text-lg">
                  •
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: Hero Image + Floating Offer Card ────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
          {/* Left: Hero promo image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-100 flex"
          >
            <Image
              src={PREORDER_IMAGE}
              alt="Kislay Seabuckthorn Pulp Pre-order Bundle — Prebook now and save ₹949"
              width={800}
              height={800}
              priority
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right: Offer card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col justify-center"
          >
            {/* Product title */}
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-gray-900 leading-tight mb-6">
              Kislay Seabuckthorn Pulp
              <span className="block text-base font-medium text-[#9d7f3c] mt-2">
                Pre-Launch Bundle Pack
              </span>
            </h2>

            {/* Price breakdown */}
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center justify-between text-base md:text-lg">
                <span className="text-gray-600">Seabuckthorn Pulp</span>
                <span className="text-gray-900 font-medium">
                  ₹{PREORDER_MRP.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-base md:text-lg text-green-600 font-medium bg-green-50 p-2 -mx-2 rounded-lg">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  Monk Fruit Drops (10ml)
                </span>
                <span className="font-semibold">
                  ₹{PREORDER_GIFT_VALUE}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 flex items-center justify-between text-base md:text-lg font-semibold">
                <span className="text-gray-700">Total Value</span>
                <span className="text-gray-500">
                  ₹{PREORDER_TOTAL_VALUE.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Big price + savings */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Pre-book Price
                  </p>
                  <p className="text-[38px] md:text-[44px] font-heading font-bold text-[#16a34a] leading-none">
                    ₹{PREORDER_PRICE}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-lg bg-[#fff7e6] px-3 py-1.5 text-xs font-bold uppercase text-[#c9962a] border border-[#c9962a]/20">
                  Save ₹{PREORDER_SAVINGS} — {PREORDER_DISCOUNT_PCT}% OFF
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={checkoutUrl}
              className="flex w-full h-[54px] items-center justify-center rounded-[50px] bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-lg shadow-lg shadow-green-600/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
              Prebook Now — ₹{PREORDER_PRICE}
            </Link>

            <p className="text-gray-400 text-xs flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure payment via
              Razorpay
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4: Benefits of Seabuckthorn Pulp ───────────────────────── */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-semibold text-[#2E7D32] mb-2 font-heading text-center">
              Benefits of Seabuckthorn Pulp
            </h2>
            <div className="w-16 h-1 bg-green-400 mx-auto rounded-full mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {seabuckthornBenefits.map(({ image, title, description }) => (
                <div
                  key={title}
                  className="flex flex-row overflow-hidden rounded-[12px] bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex w-1/2 flex-col justify-center p-5 pr-4">
                    <h3 className="font-heading text-lg sm:text-xl font-semibold text-[#1a1a1a]">
                      {title}
                    </h3>
                    <p className="mt-2 text-left text-sm font-normal text-[#6b7280]">
                      {description}
                    </p>
                  </div>
                  <div className="relative flex w-1/2 min-h-[180px] items-center justify-center bg-gray-100 overflow-hidden">
                    <Image 
                      src={image} 
                      alt={title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      sizes="(max-width: 768px) 50vw, 33vw" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: Sticky Mobile Bottom Bar ────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur-md shadow-[0_-8px_16px_rgba(0,0,0,0.08)] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#16a34a]">
                ₹{PREORDER_PRICE}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{PREORDER_TOTAL_VALUE.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-xs text-[#c9962a] font-semibold">
              Save ₹{PREORDER_SAVINGS} ({PREORDER_DISCOUNT_PCT}% OFF)
            </span>
          </div>
          <Link
            href={checkoutUrl}
            className="flex h-[46px] items-center justify-center rounded-[50px] bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-6 shadow-md transition-colors"
          >
            Prebook Now
          </Link>
        </div>
      </div>

      {/* Bottom padding spacer for sticky bar on mobile */}
      <div className="h-20 md:hidden" />
    </main>
  );
}
