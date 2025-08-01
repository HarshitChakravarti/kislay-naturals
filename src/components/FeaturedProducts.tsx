import Image from "next/image"
import { ShoppingCart, Star, ArrowRight } from "lucide-react"

export default function FeaturedProducts() {
  const product = {
    id: 1,
    name: "Monk Fruit Sweetener Drop",
    price: 229,
    originalPrice: 349,
    rating: 4.5,
    reviews: 124,
    image: "/productimage-removebg-preview.png",
    badge: "Best Seller",
    description: "Kislay Monk Fruit Sweetener Drops - 100% Natural & Zero Calorie Sugar Substitute Fuel your lifestyle with natural, low-carb goodness - packed with clean energy, rich nutrients, and zero guilt. Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that's perfect for your healthy lifestyle.",
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black-700 mb-4"> CHECK OUT OUR SWEET FAVOURITE! {'\u{1F970}'} </h2>
          <p className="text-lg font-semibold text-black-900 max-w-2xl mx-auto">
            Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
            individuals
          </p>
        </div>

        {/* Single Product Card - Horizontal Layout */}
        <div className="flex justify-center">
          <div className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white w-full max-w-5xl flex">
            {/* Left Section - Product Image */}
            <div className="w-[55%] relative bg-white flex items-center justify-center p-4">
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {product.badge}
                </span>
              </div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-contain h-[90%] w-auto max-w-[95%] group-hover:scale-105 transition-transform duration-500"
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Right Section - Product Details */}
            <div className="w-1/2 p-8 flex flex-col">

              {/* Product Info */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Product Name */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 text-justify">{product.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-green-700">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg font-medium transition-colors duration-300">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>100% Natural</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Zero Calories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Keto Friendly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Diabetic Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}