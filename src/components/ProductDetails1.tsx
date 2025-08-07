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
  Leaf
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, iconBg, iconColor }: { icon: React.ElementType, title: string, description: string, iconBg: string, iconColor: string }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-shadow">
    <div className={`p-2 rounded-full ${iconBg}`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />
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
                  alt={`${product.name} - View ${i + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>        {/* Product Info */}
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
          </div>          {/* Price */}
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
            </div>            {/* Stock Status */}
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              'In Stock'
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
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
            <h3 className="text-xl font-bold text-gray-900">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FeatureCard icon={Leaf} title="100% Natural" description="Monk Fruit Extract" iconBg="bg-green-100" iconColor="text-green-600" />
              <FeatureCard icon={XCircle} title="Zero Calories" description="Zero Glycemic Index" iconBg="bg-red-100" iconColor="text-red-600" />
              <FeatureCard icon={CheckCircle2} title="Diabetic Safe" description="Keto-Friendly & Diabetic-Safe" iconBg="bg-green-100" iconColor="text-green-600" />
              <FeatureCard icon={Droplet} title="Easy Use" description="Convenient Drop Format – Easy to Mix" iconBg="bg-blue-100" iconColor="text-blue-600" />
              <FeatureCard icon={Coffee} title="Versatile" description="Perfect for Tea, Coffee, Smoothies & More" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
              <FeatureCard icon={Ban} title="Pure & Clean" description="No Artificial Flavors, Colors or Preservatives" iconBg="bg-red-100" iconColor="text-red-600" />
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