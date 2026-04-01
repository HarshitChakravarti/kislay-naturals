'use client';

export default function OfferBanner() {
  return (
    <section className="relative overflow-hidden border-b border-emerald-900/25 bg-gradient-to-r from-emerald-800 via-green-600 to-lime-500 text-white">
      <div className="pointer-events-none absolute -left-20 top-0 h-14 w-40 bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-14 w-40 bg-yellow-200/20 blur-2xl" />

      <div className="relative py-2.5">
        <div className="offer-marquee" role="status" aria-label="Offer banner">
          <div className="offer-group">
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
          </div>
          <div className="offer-group" aria-hidden="true">
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
            <span className="offer-text">BUY 30ML AND GET 10ML FREE, SHOP NOW</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .offer-marquee {
          display: flex;
          width: max-content;
          white-space: nowrap;
          animation: move-offer-ltr 10.5s linear infinite;
          will-change: transform;
        }

        .offer-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .offer-text {
          display: inline-block;
          margin-right: 4rem;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
        }

        @media (min-width: 640px) {
          .offer-text {
            font-size: 0.95rem;
          }
        }

        @keyframes move-offer-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
