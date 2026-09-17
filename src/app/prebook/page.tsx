"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Leaf, Star, Gift, CheckCircle2 } from "lucide-react";

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

export default function PreBookPage() {
  return (
    <main className="min-h-screen bg-[#1a1208]">
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        {/* Full-bleed promo image */}
        <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[16/9] max-h-[90vh]">
          <Image
            src={PREORDER_IMAGE}
            alt="Kislay Seabuckthorn Pulp Pre-order Bundle — Prebook now and save Rs.949"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle dark gradient overlay at the bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1208]/80" />
        </div>

        {/* Floating headline — visible on medium+ screens */}
        <div className="hidden md:flex absolute inset-0 items-end justify-center pb-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-amber-300 font-heading text-lg font-semibold tracking-widest uppercase mb-1">
              Limited Pre-launch Offer
            </p>
            <h1 className="text-white font-heading text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
              Prebook Now.{" "}
              <span className="text-amber-400">Save Rs.{PREORDER_SAVINGS}.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Mobile headline (below image) ────────────────────────────────────── */}
      <div className="md:hidden text-center px-6 pt-6 pb-2">
        <p className="text-amber-400 font-heading text-sm font-semibold tracking-widest uppercase mb-1">
          Limited Pre-launch Offer
        </p>
        <h1 className="text-white font-heading text-3xl font-bold leading-tight">
          Prebook Now.{" "}
          <span className="text-amber-400">Save Rs.{PREORDER_SAVINGS}.</span>
        </h1>
      </div>

      {/* ── Value Proposition Strip ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-3xl px-4 py-8"
      >
        {/* Price breakdown card */}
        <div className="bg-[#2a1e0a] border border-amber-900/50 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center">

            {/* MRP */}
            <div>
              <p className="text-amber-200/70 text-xs uppercase tracking-widest mb-1">MRP</p>
              <p className="text-amber-200/60 text-2xl font-heading font-bold line-through decoration-red-400">
                Rs.{PREORDER_MRP.toLocaleString("en-IN")}
              </p>
            </div>

            <span className="text-amber-600 text-2xl font-bold hidden sm:block">+</span>

            {/* Free gift */}
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-amber-200/70 text-xs uppercase tracking-widest mb-0.5">Free Gift</p>
                <p className="text-amber-100 text-sm font-semibold leading-tight">
                  Kislay Monk Fruit Drops
                  <span className="block text-amber-400 text-xs">
                    (10ml, worth Rs.{PREORDER_GIFT_VALUE})
                  </span>
                </p>
              </div>
            </div>

            <span className="text-amber-600 text-2xl font-bold hidden sm:block">=</span>

            {/* Total value */}
            <div>
              <p className="text-amber-200/70 text-xs uppercase tracking-widest mb-1">Total Value</p>
              <p className="text-amber-200/60 text-xl font-heading font-bold line-through decoration-red-400">
                Rs.{PREORDER_TOTAL_VALUE.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="hidden sm:flex items-center text-amber-400 font-bold text-xl">
              {"\u2192"}
            </div>

            {/* Prebook price */}
            <div className="bg-amber-500 rounded-xl px-5 py-3 shadow-lg">
              <p className="text-amber-900 text-xs font-bold uppercase tracking-widest mb-0.5">
                Prebook Price
              </p>
              <p className="text-amber-900 text-4xl font-heading font-bold">
                Rs.{PREORDER_PRICE.toLocaleString("en-IN")}
              </p>
              <p className="text-amber-800 text-xs mt-0.5">You save Rs.{PREORDER_SAVINGS}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href={checkoutUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-heading font-bold text-xl px-10 py-4 rounded-2xl shadow-lg shadow-amber-900/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Prebook Now &mdash; Rs.{PREORDER_PRICE}
          </Link>
          <p className="text-amber-200/50 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure payment via Razorpay
          </p>
        </div>
      </motion.section>

      {/* ── What is in the Bundle ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mx-auto max-w-3xl px-4 pb-8"
      >
        <h2 className="text-amber-300 font-heading text-xl font-bold text-center mb-4">
          What is in Your Bundle?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Product 1 — Seabuckthorn Pulp */}
          <div className="bg-[#2a1e0a] border border-amber-900/40 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-amber-100 font-semibold text-base leading-tight">
                  Kislay Seabuckthorn Pulp
                </h3>
                <p className="text-amber-200/60 text-xs mt-1">
                  MRP Rs.{PREORDER_MRP.toLocaleString("en-IN")}
                </p>
                <p className="text-amber-200/70 text-sm mt-2 leading-relaxed">
                  Pure, cold-processed seabuckthorn pulp packed with Vitamin C, Omega-7,
                  antioxidants, and natural goodness.
                </p>
              </div>
            </div>
          </div>

          {/* Product 2 — Free Gift */}
          <div className="bg-[#2a1e0a] border border-amber-900/40 rounded-xl p-5 relative overflow-hidden">
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              FREE
            </span>
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-amber-100 font-semibold text-base leading-tight">
                  Kislay Monk Fruit Sweetener Drops
                </h3>
                <p className="text-amber-200/60 text-xs mt-1">
                  Worth Rs.{PREORDER_GIFT_VALUE} &mdash; included free
                </p>
                <p className="text-amber-200/70 text-sm mt-2 leading-relaxed">
                  Zero-calorie, 100% natural monk fruit drops. One drop replaces one teaspoon
                  of sugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Why Pre-book ─────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mx-auto max-w-3xl px-4 pb-8"
      >
        <h2 className="text-amber-300 font-heading text-xl font-bold text-center mb-4">
          Why Prebook?
        </h2>
        <div className="space-y-3">
          {[
            {
              Icon: Star,
              text: "Be among the first customers to receive Kislay Seabuckthorn Pulp.",
            },
            {
              Icon: Gift,
              text: "Free Monk Fruit Sweetener Drops (Rs.399 value) — exclusively for prebookers.",
            },
            {
              Icon: CheckCircle2,
              text: "Lock in the lowest price of Rs." + PREORDER_PRICE + " before it goes up.",
            },
            {
              Icon: Truck,
              text: "Ships in 4-6 weeks after launch. We will notify you by email and WhatsApp.",
            },
            {
              Icon: ShieldCheck,
              text: "100% secure payment via Razorpay — your money is protected.",
            },
          ].map(({ Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 bg-[#2a1e0a]/60 border border-amber-900/30 rounded-xl px-4 py-3"
            >
              <Icon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-100/80 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mx-auto max-w-3xl px-4 pb-16 text-center"
      >
        <p className="text-amber-200/70 text-sm mb-4">
          Limited prebooking slots. Secure yours before they run out.
        </p>
        <Link
          href={checkoutUrl}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-heading font-bold text-xl px-10 py-4 rounded-2xl shadow-lg shadow-amber-900/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Prebook Now &mdash; Rs.{PREORDER_PRICE}
        </Link>
        <p className="text-amber-200/40 text-xs mt-3">
          Natural Goodness. A Sweeter You. &middot; kislaynaturals.com
        </p>
      </motion.section>
    </main>
  );
}
