'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  helpful?: number;
  verified?: boolean;
  created_at: string;
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

export default function ProductReviews({ productId, productName, onReviewSubmit }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0] // 1-star to 5-star counts
  });
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);

  const calculateReviewStats = (reviewsData: Review[]) => {
    const totalReviews = reviewsData.length;
    const sumRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
    
    const distribution = [0, 0, 0, 0, 0];
    reviewsData.forEach(review => {
      distribution[review.rating - 1]++;
    });

    setReviewStats({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution: distribution.reverse() // Show 5-star to 1-star
    });
  };

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        calculateReviewStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
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
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
        onReviewSubmit?.(); // Notify parent component to refresh stats
        
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (starCount: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1 w-12">
          <span className="text-gray-600 font-medium">{starCount}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-10 text-gray-600 text-right font-medium">{count}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center space-x-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Thank you! Your review has been submitted successfully.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-7">
          <h2 className="text-xl font-bold text-gray-900 mb-3.5">Customer Reviews</h2>
          
          {/* Review Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
            {/* Overall Rating */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2.5">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2.5">
                  {renderStars(Math.round(reviewStats.averageRating), 'md')}
                </div>
                <p className="text-gray-600 text-sm">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3.5 text-base">Rating Breakdown</h3>
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((starCount, index) => 
                  renderRatingBar(
                    starCount, 
                    reviewStats.ratingDistribution[index], 
                    reviewStats.totalReviews
                  )
                )}
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Write a Review</span>
            </motion.button>
          </div>
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                  Write a Review for {productName}
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              star <= formData.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Share your experience with this product..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-3.5">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-xl shadow-sm border border-gray-100">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-5" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2.5">No reviews yet</h3>
              <p className="text-gray-600 mb-5 text-sm">Be the first to review this product!</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Write First Review
              </button>
            </div>
          ) : (
            <>
              {reviews.slice(0, visibleReviewsCount).map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span className="truncate">{review.name}</span>
                          {review.verified && (
                            <div title="Verified Purchase">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            </div>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {renderStars(review.rating, 'sm')}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-2.5 text-sm">
                    {review.comment}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Show More/Less Button */}
              {reviews.length > 5 && (
                <div className="flex justify-center pt-5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVisibleReviewsCount(visibleReviewsCount === 5 ? reviews.length : 5)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                  >
                    <span>
                      {visibleReviewsCount === 5 
                        ? `Show All ${reviews.length} Reviews` 
                        : 'Show Less'
                      }
                    </span>
                    <motion.div
                      animate={{ rotate: visibleReviewsCount === 5 ? 0 : 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
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