"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { User, ShoppingCart, Menu, X, LogIn, UserPlus, LogOut, User as UserIcon, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import ClientOnly from '@/components/ClientOnly';

// interface UserData {
//   _id: string;
//   username: string;
//   email: string;
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
// }

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
      setIsLoggingOut(true);
      closeDropdown();
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await logout();
      
      // Add another small delay before redirecting
      await new Promise(resolve => setTimeout(resolve, 300));
      
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, router, closeDropdown]);

  // Debounced dropdown toggle to prevent rapid state changes
  const toggleDropdown = useCallback(() => {
    if (isLoggingOut) return; // Don't open dropdown when logging out
    setIsUserDropdownOpen(prev => !prev);
  }, [isLoggingOut]);

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
          {/* Admin Dashboard - Only show for admin users */}
          {user.role === 'admin' && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <div className="bg-green-50/30 px-2 py-1">
                <div className="text-xs text-green-600 font-medium px-2 py-1 mb-1">Admin Tools</div>
                <Link 
                  href="/admin" 
                  className="flex items-center justify-between px-2 py-2 text-sm text-green-700 hover:bg-green-100 rounded-md font-medium group transition-colors"
                  onClick={closeDropdown}
                  role="menuitem"
                >
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-3" />
                    Admin Dashboard
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                    ADMIN
                  </span>
                </Link>
              </div>
            </>
          )}
          <div className="border-t border-gray-100 my-1"></div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            role="menuitem"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 mr-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                <span className="font-medium">Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-medium">Sign out</span>
              </>
            )}
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
  }, [user, closeDropdown, handleLogout, isLoggingOut]);

  // Memoize the user icon to prevent flickering
  const userIcon = useMemo(() => {
    if (isLoggingOut) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        </div>
      );
    }
    
    if (user) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
          {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
      );
    }

    return <User className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />;
  }, [user, isLoggingOut]);

  // Close dropdown when clicking outside and handle navbar auto-hide
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    // Handle scroll for navbar auto-hide
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't hide navbar if mobile menu is open
      if (isMenuOpen) {
        setIsNavbarVisible(true);
        return;
      }
      
      // Show navbar when at the top
      if (currentScrollY < 10) {
        setIsNavbarVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);
        
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsNavbarVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsNavbarVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isMenuOpen]);

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center h-full pt-1 md:pt-2">
              <Image 
                src="/logonew.png" 
                alt="Kislay" 
                width={200} 
                height={72} 
                className="h-16 md:h-20 w-auto object-contain" 
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
            <Link href="/recipes" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              RECIPES
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              BLOGS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/faq" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/lab-report" target="_blank" rel="noopener noreferrer" className="group relative font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 py-2 text-[16px]">
              LAB REPORT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* User Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                disabled={isLoggingOut}
                className={`p-2 hover:bg-gray-100 rounded-full transition-colors group relative ${isLoggingOut ? 'cursor-not-allowed opacity-70' : ''}`}
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
                aria-label={isLoggingOut ? 'Signing out...' : (user ? 'User menu' : 'Account menu')}
                title={isLoggingOut ? 'Signing out...' : (user ? 'Logged In' : 'Not Logged In')}
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
              <Link href="/recipes" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                RECIPES
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/blog" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                BLOGS
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/faq" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/lab-report" target="_blank" rel="noopener noreferrer" className="group relative font-bold text-gray-700 block py-3 text-base" onClick={() => setIsMenuOpen(false)}>
                LAB REPORT
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {/* Admin Dashboard in Mobile Menu - Only show for admin users */}
              {user && user.role === 'admin' && (
                <Link href="/admin" className="group relative font-bold text-green-700 block py-3 text-base bg-green-50 rounded-lg px-3" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      ADMIN DASHBOARD
                    </div>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                      ADMIN
                    </span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default function Navbar() {
  return (
    <ClientOnly>
      <Header />
    </ClientOnly>
  );
}