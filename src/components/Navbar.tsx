"use client"

import { useState } from "react"
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo-transparent.png" alt="Kislay" className="h-16 md:h-20 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-1 cursor-pointer hover:text-green-600 transition-colors">
              <span className="font-medium text-gray-700">SHOP</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <a href="#" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
              ABOUT US
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
              PRODUCTS
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
              FIND IN STORE
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
              SUBSCRIBE
            </a>
            <a href="#" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
              GET A FREE SAMPLE
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden md:flex items-center space-x-1 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">English</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* User Account */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>

            {/* Shopping Cart */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </button>

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
            <nav className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">SHOP</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <a href="#" className="font-medium text-gray-700">
                ABOUT US
              </a>
              <a href="#" className="font-medium text-gray-700">
                PRODUCTS
              </a>
              <a href="#" className="font-medium text-gray-700">
                FIND IN STORE
              </a>
              <a href="#" className="font-medium text-gray-700">
                SUBSCRIBE
              </a>
              <a href="#" className="font-medium text-gray-700">
                GET A FREE SAMPLE
              </a>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">English</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
