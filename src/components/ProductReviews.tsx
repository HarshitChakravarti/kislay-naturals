'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  helpful?: number;
  verified?: boolean;
  created_at: string;
  photos?: string[] | string;
}

interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  onReviewSubmit?: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'KN';

const parseReviewPhotos = (photos?: string[] | string) => {
  if (!photos) {
    return [];
  }

  if (Array.isArray(photos)) {
    return photos.filter((photo): photo is string => typeof photo === 'string' && photo.length > 0);
  }

  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed)
      ? parsed.filter((photo): photo is string => typeof photo === 'string' && photo.length > 0)
      : [];
  } catch {
    return typeof photos === 'string' && photos.length > 0 ? [photos] : [];
  }
};

export default function ProductReviews({
  productId,
  productName,
  onReviewSubmit,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  });
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);

  const calculateReviewStats = (reviewsData: Review[], totalCount?: number) => {
    const totalReviews = totalCount ?? reviewsData.length;
    const reviewsWithRatings = reviewsData.filter(
      (review) =>
        review.rating !== null &&
        review.rating !== undefined &&
        !Number.isNaN(Number(review.rating))
    );

    const sumRatings = reviewsWithRatings.reduce((sum, review) => {
      const rating =
        typeof review.rating === 'number' ? review.rating : Number.parseFloat(String(review.rating));
      return sum + (Number.isNaN(rating) ? 0 : rating);
    }, 0);

    const averageRating = reviewsWithRatings.length > 0 ? sumRatings / reviewsWithRatings.length : 0;
    const distribution = [0, 0, 0, 0, 0];

    reviewsWithRatings.forEach((review) => {
      const rating =
        typeof review.rating === 'number'
          ? review.rating
          : Math.floor(Number.parseFloat(String(review.rating)));

      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });

    setReviewStats({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution: distribution.reverse(),
    });
  };

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=1000`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
        calculateReviewStats(data.data, data.pagination?.totalReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const remainingSlots = 5 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      alert('You can upload a maximum of 5 photos');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploadingPhotos(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formPayload = new FormData();
        formPayload.append('file', file);

        const response = await fetch('/api/reviews/upload-photo', {
          method: 'POST',
          body: formPayload,
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to upload photo');
        }

        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedPhotos((prev) => [...prev, ...urls]);
    } catch (error: unknown) {
      console.error('Error uploading photos:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload photos. Please try again.');
    } finally {
      setUploadingPhotos(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...formData,
          photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', rating: 5, comment: '' });
        setUploadedPhotos([]);
        setShowReviewForm(false);
        await fetchReviews();
        onReviewSubmit?.();
        window.setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-green-100'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (starCount: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex w-12 items-center gap-1 text-slate-700">
          <span className="font-medium">{starCount}</span>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        </div>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-green-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm font-medium text-slate-500">{count}</span>
      </div>
    );
  };

  const totalReviewCount = reviewStats.totalReviews || reviews.length;

  if (isLoading) {
    return (
      <div className="rounded-[32px] border border-green-100 bg-[#F0FAF3] p-6 shadow-[0_24px_60px_rgba(17,24,39,0.05)] sm:p-8">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-32 rounded-full bg-green-100" />
          <div className="h-10 w-56 rounded-2xl bg-green-100" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-44 rounded-[28px] bg-white" />
            <div className="h-44 rounded-[28px] bg-white" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 rounded-[28px] bg-white" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-green-100 bg-[#F0FAF3] p-6 shadow-[0_24px_60px_rgba(17,24,39,0.05)] sm:p-8">
      <div className="space-y-5 sm:space-y-6">
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm font-medium text-green-800 shadow-sm"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Thank you! Your review has been submitted successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-800">
              Customer Voices
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-green-900 sm:text-3xl">
                Customer Reviews
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Honest feedback from people using {productName} in their everyday routines.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowReviewForm((current) => !current)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-800 transition hover:border-green-500 hover:bg-green-50 sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Write a Review</span>
          </motion.button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Overall Rating
            </p>
            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-4xl font-bold tracking-tight text-green-900 sm:text-5xl">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="mt-3">{renderStars(Math.round(reviewStats.averageRating), 'lg')}</div>
              </div>
              <p className="text-sm font-medium text-slate-600">
                Based on {totalReviewCount} review{totalReviewCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Rating Breakdown
            </p>
            <div className="mt-4 space-y-3">
              {[5, 4, 3, 2, 1].map((starCount, index) =>
                renderRatingBar(
                  starCount,
                  reviewStats.ratingDistribution[index],
                  totalReviewCount
                )
              )}
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-[28px] border border-green-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  Write a Review for {productName}
                </h3>

                <form onSubmit={handleSubmitReview} className="mt-5 space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="rounded-full p-1 transition hover:bg-green-50"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= formData.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-green-100 hover:text-amber-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Your Review *
                    </label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      placeholder="Share your experience with this product..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Add Photos (Optional)
                    </label>
                    <p className="mb-3 text-xs text-slate-500">
                      Max 5 photos, 5MB each. JPEG, JPG, PNG and WebP supported.
                    </p>

                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhotos || uploadedPhotos.length >= 5}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className={`flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-4 py-4 text-sm transition ${
                            uploadingPhotos || uploadedPhotos.length >= 5
                              ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                              : 'border-green-200 bg-green-50/40 text-slate-600 hover:border-green-400 hover:bg-green-50'
                          }`}
                        >
                          {uploadingPhotos ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-300 border-b-green-600" />
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-5 w-5" />
                              <span>
                                {uploadedPhotos.length >= 5
                                  ? 'Maximum 5 photos reached'
                                  : 'Click to upload photos'}
                              </span>
                            </div>
                          )}
                        </label>
                      </div>

                      {uploadedPhotos.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                          {uploadedPhotos.map((url, index) => (
                            <div key={`${url}-${index}`} className="relative group">
                              <Image
                                src={url}
                                alt={`Review photo ${index + 1}`}
                                width={120}
                                height={120}
                                className="h-24 w-full rounded-2xl border border-green-100 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-100 shadow-lg transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                                aria-label="Remove photo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-b-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setUploadedPhotos([]);
                        setFormData({ name: '', email: '', rating: 5, comment: '' });
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-[28px] border border-green-100 bg-white px-6 py-12 text-center shadow-sm">
              <MessageSquare className="mx-auto h-14 w-14 text-green-200" />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">No reviews yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Be the first to share your experience with this product.
              </p>
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-green-800"
              >
                Write First Review
              </button>
            </div>
          ) : (
            <>
              {reviews.slice(0, visibleReviewsCount).map((review) => {
                const photos = parseReviewPhotos(review.photos);

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[28px] border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-[0_18px_44px_rgba(17,24,39,0.06)] sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
                          {getInitials(review.name)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-semibold text-slate-900">{review.name}</h4>
                            {review.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-green-700">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{formatDate(review.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">{renderStars(review.rating, 'sm')}</div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                      {review.comment}
                    </p>

                    {photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                        {photos.map((photo, index) => (
                          <button
                            key={`${review.id}-photo-${index}`}
                            type="button"
                            onClick={() => window.open(photo, '_blank')}
                            className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white"
                          >
                            <Image
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              width={160}
                              height={160}
                              className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {reviews.length > 5 && (
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      setVisibleReviewsCount(
                        visibleReviewsCount === 5 ? reviews.length : 5
                      )
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-800 transition hover:border-green-500 hover:bg-green-50 sm:w-auto"
                  >
                    <span>
                      {visibleReviewsCount === 5
                        ? `Show All ${totalReviewCount} Reviews`
                        : 'Show Less'}
                    </span>
                    <motion.svg
                      animate={{ rotate: visibleReviewsCount === 5 ? 0 : 180 }}
                      transition={{ duration: 0.2 }}
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
