"use client"

import { useState, useEffect } from "react"
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-gray-50 border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/logo-transparent.png" 
                alt="Kislay" 
                width={200} 
                height={72} 
                className="h-16 md:h-18 w-auto" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-20">
            <Link href="/" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[15px]">
              HOME
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[15px]">
              ABOUT US
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[15px]">
              PRODUCTS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/subscribe" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[15px]">
              SUBSCRIBE
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className={`fixed left-0 right-0 top-16 bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${isSearchOpen ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="relative w-full max-w-2xl mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-12 py-2 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
            </button>

            {/* User Account */}
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative">
              <User className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-6 px-4">
              <Link href="/" className="group relative font-medium text-gray-700 block py-2">
                HOME
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="#" className="group relative font-medium text-gray-700 block py-2">
                ABOUT US
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="#" className="group relative font-medium text-gray-700 block py-2">
                PRODUCTS
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="#" className="group relative font-medium text-gray-700 block py-2">
                FIND IN STORE
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="#" className="group relative font-medium text-gray-700 block py-2">
                SUBSCRIBE
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="#" className="group relative font-medium text-gray-700 block py-2">
                GET A FREE SAMPLE
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
