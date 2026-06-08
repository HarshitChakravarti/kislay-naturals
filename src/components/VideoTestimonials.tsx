import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  city: string;
  quote: string;
  videoSrc: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Garima Gupta",
    city: "Hyderabad",
    quote: "Tastes exactly like sugar, I use it in my chai every morning",
    videoSrc: "/testimonials/1.mp4",
  },
  {
    id: 2,
    name: "Shouvik Chaterjee",
    city: "Udaipur",
    quote: "My HbA1c has improved since switching to this",
    videoSrc: "/testimonials/2.mp4",
  },
  {
    id: 3,
    name: "Kanish",
    city: "Surat",
    quote: "Feels magical for people living a healthy and sugarfree lifestyle",
    videoSrc: "/testimonials/influencer.mp4",
  },
  {
    id: 4,
    name: "Vedha Shri",
    city: "Telangana",
    quote: "Best natural sweetener I've tried in years",
    videoSrc: "/testimonials/4.mp4",
  },
  {
    id: 5,
    name: "Rathan Kumar",
    city: "Secunderabad",
    quote: "Perfect for my keto diet, No bad aftertaste at all",
    videoSrc: "/testimonials/3.mp4",
  },
];

const VideoTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const postsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / postsPerPage);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const [playingVideos, setPlayingVideos] = useState<Record<number, boolean>>({});

  const togglePlay = (id: number, videoElement: HTMLVideoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setPlayingVideos(prev => ({ ...prev, [id]: true }));
    } else {
      videoElement.pause();
      setPlayingVideos(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleVideoPause = (id: number) => {
    setPlayingVideos(prev => ({ ...prev, [id]: false }));
  };

  const handleVideoPlay = (id: number) => {
    setPlayingVideos(prev => ({ ...prev, [id]: true }));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const scrollLeft = () => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.offsetWidth;
      scrollContainer.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.offsetWidth;
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (!scrollContainer.current) return;
    const { scrollLeft, offsetWidth } = scrollContainer.current;
    const newIndex = Math.round(scrollLeft / offsetWidth);
    setMobileIndex(newIndex);
  };

  const getCurrentPosts = () => {
    const startIndex = currentIndex * postsPerPage;
    return testimonials.slice(startIndex, startIndex + postsPerPage);
  };

  const renderStars = () => {
    return (
      <div className="flex text-yellow-500 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-white">
      <div className="relative bg-green-700 text-white w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col items-center justify-center text-center w-full">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 font-heading uppercase text-center">
                <span className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  WHAT OUR CUSTOMERS SAY
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white max-w-2xl mx-auto text-center">
                Real people. Real results. Unfiltered.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
        {/* Desktop Carousel */}
        <div className="relative hidden lg:block">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50"
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-3 gap-7 px-8 transition-all duration-300">
            {getCurrentPosts().map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-[320px] sm:h-[400px] w-full bg-black">
                  <video
                    className="w-full h-full object-cover"
                    src={`${testimonial.videoSrc}#t=0.001`}
                    preload="metadata"
                    controls={playingVideos[testimonial.id]}
                    onPause={() => handleVideoPause(testimonial.id)}
                    onPlay={() => handleVideoPlay(testimonial.id)}
                    onEnded={() => handleVideoPause(testimonial.id)}
                    onClick={(e) => togglePlay(testimonial.id, e.currentTarget)}
                  />
                  {!playingVideos[testimonial.id] && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
                      onClick={(e) => {
                        const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                        togglePlay(testimonial.id, video);
                      }}
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-col mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium border border-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </div>
                      <span className="text-sm text-gray-500">{testimonial.city}</span>
                    </div>
                  </div>

                  {renderStars()}

                  <p className="text-gray-600 italic text-sm line-clamp-2">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
              </div>
            ))}

            {currentIndex === totalPages - 1 && getCurrentPosts().length < 3 && (
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Share Your Story</h3>
                <p className="text-gray-600 text-sm mb-6">We&apos;d love to hear about your experience with Kislay Naturals.</p>
                <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
                  Write a Review
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-green-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Horizontal Scroll Carousel */}
        <div className="relative lg:hidden group">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div
            ref={scrollContainer}
            onScroll={handleScroll}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 border border-gray-100 flex-shrink-0 w-full snap-center"
              >
                <div className="relative h-[320px] sm:h-[400px] w-full bg-black">
                  <video
                    className="w-full h-full object-cover"
                    src={`${testimonial.videoSrc}#t=0.001`}
                    preload="metadata"
                    controls={playingVideos[testimonial.id]}
                    onPause={() => handleVideoPause(testimonial.id)}
                    onPlay={() => handleVideoPlay(testimonial.id)}
                    onEnded={() => handleVideoPause(testimonial.id)}
                    onClick={(e) => togglePlay(testimonial.id, e.currentTarget)}
                  />
                  {!playingVideos[testimonial.id] && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                      onClick={(e) => {
                        const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                        togglePlay(testimonial.id, video);
                      }}
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border border-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{testimonial.city}</span>
                    </div>
                  </div>

                  {renderStars()}

                  <p className="text-gray-600 italic text-xs sm:text-sm">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Mobile Dot Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainer.current) {
                    scrollContainer.current.scrollTo({
                      left: index * scrollContainer.current.offsetWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === mobileIndex
                  ? 'bg-green-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center text-green-700 hover:text-green-800 font-medium transition-colors group"
          >
            Loved it? Share your experience
            <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
