import Image from "next/image"
import { ShoppingCart, Star, Heart } from "lucide-react"

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Monk Fruit Sweetener Classic",
      price: 129,
      originalPrice: 159,
      rating: 4.5,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=300",
      badge: "Best Seller",
      description: "Natural zero-calorie sweetener perfect for daily use",
    },
    {
      id: 2,
      name: "Monk Fruit Golden Blend",
      price: 149,
      originalPrice: 179,
      rating: 4.7,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      badge: "Premium",
      description: "Rich golden blend with enhanced flavor profile",
    },
    {
      id: 3,
      name: "Monk Fruit Liquid Drops",
      price: 99,
      originalPrice: 119,
      rating: 4.3,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=300",
      badge: "Convenient",
      description: "Easy-to-use liquid drops for instant sweetening",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black-700 mb-4"> CHECK OUT OUR SWEET FAVORITES! {'\u{1F970}'} </h2>
          <p className="text-lg font-semibold text-black-900 max-w-2xl mx-auto">
            Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
            individuals
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {product.badge}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                <Heart className="h-4 w-4 text-gray-600" />
              </button>

              <div className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 h-64 rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 inline-flex items-center justify-center rounded-none bg-green-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 rounded-none border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 bg-transparent">
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-none hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 bg-transparent">
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}