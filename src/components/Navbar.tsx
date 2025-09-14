"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { User, ShoppingCart, Menu, X, LogIn, UserPlus, LogOut, User as UserIcon, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// interface UserData {
//   _id: string;
//   username: string;
//   email: string;
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
// }

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Callback to close dropdown
  const closeDropdown = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, []);

  // Callback to handle logout
  const handleLogout = useCallback(async () => {
    try {
      closeDropdown();
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, router, closeDropdown]);

  // Debounced dropdown toggle to prevent rapid state changes
  const toggleDropdown = useCallback(() => {
    setIsUserDropdownOpen(prev => !prev);
  }, []);

  // Memoize the dropdown content to prevent unnecessary re-renders
  const dropdownContent = useMemo(() => {
    if (user) {
      return (
        <>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-900 font-medium">{user.username || 'Welcome'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link 
            href="/account" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeDropdown}
            role="menuitem"
          >
            <UserIcon className="w-4 h-4 mr-3" />
            My Account
          </Link>
          <Link 
            href="/account/orders" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeDropdown}
            role="menuitem"
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Orders
          </Link>
          <Link 
            href="/account/settings" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeDropdown}
            role="menuitem"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <button 
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </>
      );
    }

    return (
      <div className="py-2 w-48">
        <Link 
          href="/login" 
          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={closeDropdown}
          role="menuitem"
        >
          <LogIn className="w-4 h-4 mr-3 text-green-600" />
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={closeDropdown}
          role="menuitem"
        >
          <UserPlus className="w-4 h-4 mr-3 text-green-600" />
          Sign Up
        </Link>
      </div>
    );
  }, [user, closeDropdown, handleLogout]);

  // Memoize the user icon to prevent flickering
  const userIcon = useMemo(() => {
    if (user) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
          {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
      );
    }

    return <User className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />;
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    // Handle scroll
    const handleScroll = () => setScrolled(window.scrollY > 10);
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
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
          <nav className="hidden lg:flex items-center space-x-16">
            <Link href="/" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              HOME
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              ABOUT US
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              PRODUCTS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/subscribe" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              SUBSCRIBE
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* User Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative"
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
                aria-label={user ? 'User menu' : 'Account menu'}
                title={user ? 'Logged In' : 'Not Logged In'}
              >
                <div className="relative">
                  {userIcon}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  {dropdownContent}
                </div>
              )}
            </div>



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
              <Link href="/" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                HOME
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                ABOUT US
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/products" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                PRODUCTS
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>

            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
