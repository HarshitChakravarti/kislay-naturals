import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, FileCheck, ShieldCheck, Star } from "lucide-react";

const aggregateRating = {
  rating: "4.7",
  count: "50+",
};

const videoTestimonials = [
  {
    id: 1,
    name: "Customer review",
    caption: "Sugar-free sweetness in everyday tea and coffee",
    src: "/testimonials/1.mp4",
  },
  {
    id: 2,
    name: "Customer review",
    caption: "A quick phone-shot review after trying Kislay",
    src: "/testimonials/2.mp4",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Tanishka",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    review: "It is a very nice alternative to sugar. I use it in my morning tea and it keeps the taste clean.",
    rating: 5,
  },
  {
    id: 2,
    name: "Harshit",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    review: "Tried your sugar replacement and I am genuinely impressed. It tastes amazing and I could not tell there was no sugar in it.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sanju",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    review: "As someone managing diabetes, finding something that satisfies sweet cravings without sugar has always been difficult. Kislay has been a helpful daily swap.",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    review: "Perfect for tea and coffee. No bitter aftertaste like other sweeteners, and my family has started using it too.",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Nisha",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review: "I was trying to reduce refined sugar at home. A few drops are enough, so the bottle lasts longer than expected.",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Amit",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    review: "Good option for my keto routine. I add it to black coffee and curd bowls without worrying about extra calories.",
    rating: 4.5,
  },
  {
    id: 7,
    name: "Meera",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    review: "My parents wanted something sugar-free that still felt easy to use. This has become our regular kitchen bottle.",
    rating: 5,
  },
  {
    id: 8,
    name: "Rohit",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    review: "The sweetness is strong, so I only need a small amount. It works well in lemonade and iced tea.",
    rating: 4,
  },
];

const trustMarkers = [
  {
    label: "FSSAI compliant",
    detail: "Food safety standards",
    icon: ShieldCheck,
  },
  {
    label: "Lab report available",
    detail: "View quality documents",
    icon: FileCheck,
    href: "/lab-report",
  },
  {
    label: "Verified purchases",
    detail: "Reviews from buyers",
    icon: BadgeCheck,
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => {
        const fillPercent = Math.max(0, Math.min(100, (rating - index) * 100));

        return (
          <span key={index} className="relative block h-4 w-4 text-gray-300">
            <Star className="h-4 w-4 fill-current" strokeWidth={0} />
            {fillPercent > 0 && (
              <span className="absolute inset-0 overflow-hidden text-yellow-400" style={{ width: `${fillPercent}%` }}>
                <Star className="h-4 w-4 fill-current" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

const Testimonials = () => (
  <section className="w-full bg-white">
    <div className="relative w-full overflow-hidden bg-green-700 py-12 text-white">
      <div className="absolute bottom-0 left-0 right-0 z-0 h-8 bg-gradient-to-t from-black/10 to-transparent"></div>

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
              <RatingStars rating={Number(aggregateRating.rating)} />
              <span>{aggregateRating.rating} from {aggregateRating.count} happy customers</span>
            </div>
            <h2 className="mb-4 font-heading text-3xl font-semibold md:text-5xl text-center">
              <span className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                WHAT OUR CUSTOMERS SAY
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl text-center">
              Real reactions from customers using Kislay Monk Fruit Sweetener in tea, coffee, desserts and daily sugar swaps.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-4 border-y border-green-100 py-5 sm:grid-cols-3">
        {trustMarkers.map((marker) => {
          const Icon = marker.icon;
          const content = (
            <div className="flex h-full items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{marker.label}</span>
                <span className="block text-xs text-slate-500">{marker.detail}</span>
              </span>
            </div>
          );

          return marker.href ? (
            <Link key={marker.label} href={marker.href} className="rounded-lg p-2 transition hover:bg-green-50">
              {content}
            </Link>
          ) : (
            <div key={marker.label} className="rounded-lg p-2">
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-green-900 md:text-3xl">Video Testimonials</h3>
            <p className="mt-1 text-sm text-slate-600">Short phone-shot reviews from customers.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:max-w-4xl">
          {videoTestimonials.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-lg border border-green-100 bg-slate-950 shadow-sm">
              <div className="aspect-[9/16] max-h-[560px] bg-slate-900">
                <video className="h-full w-full object-cover" controls playsInline preload="metadata">
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
              <div className="border-t border-white/10 bg-slate-950 p-4 text-white">
                <p className="text-sm font-semibold">{video.name}</p>
                <p className="mt-1 text-xs text-white/70">{video.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="flex min-h-[230px] flex-col rounded-lg border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <Image
                src={testimonial.avatar}
                alt={`${testimonial.name} customer photo`}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-slate-900">{testimonial.name}</h3>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-green-600" aria-label="Verified purchase" />
                </div>
                <div className="mt-1">
                  <RatingStars rating={testimonial.rating} />
                </div>
              </div>
            </div>

            <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified purchase
            </span>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-green-900">&quot;{testimonial.review}&quot;</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
