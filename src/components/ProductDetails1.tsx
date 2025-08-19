'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import CheckoutModal from './CheckoutModal';
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
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-full ${iconBg} flex items-center justify-center`}>
      <span className="text-3xl">{emoji}</span>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnquireFormVisible, setIsEnquireFormVisible] = useState(false);
  const [enquireFormData, setEnquireFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const productImages = [
    product.image,
    '/p2.png',
    '/p33.png'
  ];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors font-medium group"
        >
          <ChevronLeft className="h-5 w-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
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
                className="object-contain p-8 transition-transform duration-500 hover:scale-105"
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

          {/* Enquire Now Section - Below Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Have Questions?</h3>
                </div>
                <p className="text-gray-600">
                  Get personalized assistance about this product.<br/> We are here to help!
                </p>
                <motion.button
                  onClick={() => setIsEnquireFormVisible(!isEnquireFormVisible)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="h-5 w-5" />
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
                  className="mt-6 pt-6 border-t border-green-200"
                >
                  <form onSubmit={handleEnquireSubmit} className="space-y-4">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Any specific questions or requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!isEnquireFormValid || isSubmitting}
                      whileHover={{ scale: isEnquireFormValid ? 1.02 : 1 }}
                      whileTap={{ scale: isEnquireFormValid ? 0.98 : 1 }}
                      className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isEnquireFormValid
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-700 text-center">
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
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {/* Ratings */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price?.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-white bg-green-600 px-2 py-0.5 rounded-full">
                      Save {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              In Stock
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">What's in the box?</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="prose prose-green max-w-none text-gray-600 space-y-4">
                {product.description?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "text-lg font-semibold text-gray-900" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Why it's different?</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <FeatureCard emoji="🌿" title="100% Natural" description="Monk Fruit Extract" iconBg="bg-white" iconColor="text-green-600" />
              <FeatureCard emoji="🔥" title="Zero Calories" description="Zero Glycemic Index" iconBg="bg-white" iconColor="text-red-600" />
              <FeatureCard emoji="💚" title="Diabetic Friendly" description="Keto-Friendly & Diabetic-Safe" iconBg="bg-white" iconColor="text-green-600" />
              <FeatureCard emoji="💧" title="Easy Use" description="Convenient Drop Format – Easy to Mix" iconBg="bg-white" iconColor="text-blue-600" />
              <FeatureCard emoji="☕" title="Versatile" description="Perfect for Tea, Coffee, Smoothies & More" iconBg="bg-white" iconColor="text-yellow-600" />
              <FeatureCard emoji="✨" title="Pure & Clean" description="No Artificial Flavors, Colors or Preservatives" iconBg="bg-white" iconColor="text-red-600" />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-lg">Quantity</span>
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <Minus className="h-5 w-5" />
              </motion.button>
              <span className="font-bold text-xl w-8 text-center">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Buy Now Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Buy Now</span>
          </motion.button>
        </motion.div>
      </div>
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        quantity={quantity} 
      />

    </div>
  );
}