'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import ProductReviews from './ProductReviews';
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  Droplet,
  Coffee,
  Ban,
  Leaf,
  MessageSquare
} from 'lucide-react';

const FeatureCard = ({ emoji, title, description, iconBg, iconColor }: { emoji: string, title: string, description: string, iconBg: string, iconColor: string }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
    <div className={`p-2 rounded-full ${iconBg} flex items-center justify-center`}>
      <span className="text-2xl md:text-3xl">{emoji}</span>
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-sm md:text-base text-gray-900 leading-tight">{title}</h4>
      <p className="text-xs md:text-sm text-gray-600 leading-relaxed text-center hyphens-auto">{description}</p>
    </div>
  </div>
);

interface ProductDetailsProps {
  product: Product;
  onOpenCheckout?: (quantity: number) => void;
}

export default function ProductDetails({ product, onOpenCheckout }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [isEnquireFormVisible, setIsEnquireFormVisible] = useState(false);
  const [enquireFormData, setEnquireFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  
  const productImages = [
    product.image,
    '/p2.png',
    '/p33.png'
  ];

  // Fetch reviews for the product
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${product.id}&limit=100`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const reviews = data.data;
        const totalReviews = reviews.length;
        const sumRatings = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
        
        setReviewStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [product.id]);

  useEffect(() => {
    if (product.id) {
      fetchReviews();
    }
  }, [product.id, fetchReviews]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleEnquireInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquireFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construct WhatsApp message
      const whatsappMessage = `*New Product Enquiry*\n\n` +
        `*Product:* ${product.name}\n` +
        `*Name:* ${enquireFormData.name}\n` +
        `*Email:* ${enquireFormData.email}\n` +
        `*Mobile:* ${enquireFormData.mobile}\n` +
        `*Address:* ${enquireFormData.address}\n` +
        `*Message:* ${enquireFormData.message}\n\n` +
        `*Enquiry Date:* ${new Date().toLocaleDateString('en-IN')}`;

      // WhatsApp number (replace with your actual WhatsApp number)
      const phoneNumber = '917043630938'; // Replace with your business WhatsApp number
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      setEnquireFormData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        message: ''
      });
      
      // Hide form
      setIsEnquireFormVisible(false);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      alert('There was an error sending your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnquireFormValid = enquireFormData.name && enquireFormData.email && enquireFormData.mobile && enquireFormData.address;

  return (
    <div className="w-full">
      {/* Green Sub Header */}
      <div className="w-full bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 py-3 hover:text-white/90 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm md:text-base">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Images and Enquiry Section */}
        <div className="space-y-8">
          {/* Product Images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-lg group">
              <Image
                src={productImages[selectedImage]}
                alt={`${product.name} - View ${selectedImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6 transition-transform duration-500 hover:scale-105"
                priority
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer
                    ${selectedImage === i ? 'border-green-500' : 'border-transparent'}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enquire Now Section - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:block"
          >
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
              <div className="text-center space-y-3.5">
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Have Questions?</h3>
                </div>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  Get personalized assistance about this product. We are here to help!
                </p>
                <motion.button
                  onClick={() => setIsEnquireFormVisible(!isEnquireFormVisible)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{isEnquireFormVisible ? 'Hide Form' : 'Enquire Now'}</span>
                </motion.button>
              </div>

              {/* Inline Enquiry Form */}
              {isEnquireFormVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 pt-5 border-t border-green-200"
                >
                  <form onSubmit={handleEnquireSubmit} className="space-y-3.5">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="enquire-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="enquire-name"
                        name="name"
                        value={enquireFormData.name}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="enquire-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="enquire-email"
                        name="email"
                        value={enquireFormData.email}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {/* Mobile Field */}
                    <div>
                      <label htmlFor="enquire-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        id="enquire-mobile"
                        name="mobile"
                        value={enquireFormData.mobile}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your mobile number"
                        pattern="[0-9]{10}"
                      />
                    </div>

                    {/* Address Field */}
                    <div>
                      <label htmlFor="enquire-address" className="block text-sm font-medium text-gray-700 mb-2">
                        Short Address *
                      </label>
                      <input
                        type="text"
                        id="enquire-address"
                        name="address"
                        value={enquireFormData.address}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="City, State"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="enquire-message" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Message
                      </label>
                      <textarea
                        id="enquire-message"
                        name="message"
                        value={enquireFormData.message}
                        onChange={handleEnquireInputChange}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Any specific questions or requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!isEnquireFormValid || isSubmitting}
                      whileHover={{ scale: isEnquireFormValid ? 1.02 : 1 }}
                      whileTap={{ scale: isEnquireFormValid ? 0.98 : 1 }}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isEnquireFormValid
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Enquiry via WhatsApp</span>
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Info Text */}
                  <div className="mt-3.5 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs text-green-700 text-center text-justify">
                      Your enquiry will be sent directly to our WhatsApp for quick response
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-5"
        >
          <div>
            <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {/* Ratings */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.floor(reviewStats.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({reviewStats.totalReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-3 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price?.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-white bg-green-600 px-1.5 py-0.5 rounded-full">
                      Save {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes • Free shipping across India</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              In Stock
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">What&apos;s in the box?</h3>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="prose prose-green max-w-none text-gray-600 space-y-3">
                {product.description?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`${index === 0 ? "text-base font-semibold text-gray-900" : ""} text-justify`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Why it&apos;s different?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5">
              <FeatureCard emoji="🌿" title="100% Natural" description="Monk Fruit Extract" iconBg="bg-white" iconColor="text-green-600" />
              <FeatureCard emoji="🔥" title="Zero Calories" description="Zero Glycemic Index" iconBg="bg-white" iconColor="text-red-600" />
              <FeatureCard emoji="💚" title="Diabetic Friendly" description="Keto-Friendly & Diabetic-Safe" iconBg="bg-white" iconColor="text-green-600" />
              <FeatureCard emoji="💧" title="Easy Use" description="Convenient Drop Format - Easy to Mix" iconBg="bg-white" iconColor="text-blue-600" />
              <FeatureCard emoji="☕" title="Versatile" description="Perfect for Tea, Coffee, Smoothies & More" iconBg="bg-white" iconColor="text-yellow-600" />
              <FeatureCard emoji="✨" title="Pure & Clean" description="No Artificial Flavors, Colors or Preservatives" iconBg="bg-white" iconColor="text-red-600" />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-5">
            <span className="font-semibold text-base">Quantity</span>
            <div className="flex items-center space-x-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Buy Now Button */}
          <motion.button
            onClick={() => onOpenCheckout?.(quantity)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Buy Now</span>
          </motion.button>

          {/* Enquire Now Section - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:hidden"
          >
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
              <div className="text-center space-y-3.5">
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Have Questions?</h3>
                </div>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  Get personalized assistance about this product. We are here to help!
                </p>
                <motion.button
                  onClick={() => setIsEnquireFormVisible(!isEnquireFormVisible)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{isEnquireFormVisible ? 'Hide Form' : 'Enquire Now'}</span>
                </motion.button>
              </div>

              {/* Inline Enquiry Form - Mobile */}
              {isEnquireFormVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 pt-5 border-t border-green-200"
                >
                  <form onSubmit={handleEnquireSubmit} className="space-y-3.5">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="enquire-name-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="enquire-name-mobile"
                        name="name"
                        value={enquireFormData.name}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="enquire-email-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="enquire-email-mobile"
                        name="email"
                        value={enquireFormData.email}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {/* Mobile Field */}
                    <div>
                      <label htmlFor="enquire-mobile-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        id="enquire-mobile-mobile"
                        name="mobile"
                        value={enquireFormData.mobile}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your mobile number"
                        pattern="[0-9]{10}"
                      />
                    </div>

                    {/* Address Field */}
                    <div>
                      <label htmlFor="enquire-address-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Short Address *
                      </label>
                      <input
                        type="text"
                        id="enquire-address-mobile"
                        name="address"
                        value={enquireFormData.address}
                        onChange={handleEnquireInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="City, State"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="enquire-message-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Message
                      </label>
                      <textarea
                        id="enquire-message-mobile"
                        name="message"
                        value={enquireFormData.message}
                        onChange={handleEnquireInputChange}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Any specific questions or requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!isEnquireFormValid || isSubmitting}
                      whileHover={{ scale: isEnquireFormValid ? 1.02 : 1 }}
                      whileTap={{ scale: isEnquireFormValid ? 0.98 : 1 }}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isEnquireFormValid
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Enquiry via WhatsApp</span>
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Info Text */}
                  <div className="mt-3.5 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs text-green-700 text-center text-justify">
                      Your enquiry will be sent directly to our WhatsApp for quick response
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Product Reviews Section */}
      <ProductReviews 
        productId={product.id.toString()} 
        productName={product.name}
        onReviewSubmit={fetchReviews}
      />
      

      </div>
    </div>
  );
}
