import { Heart, Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info Column */}
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <img src="/logo-transparent.png" alt="Kislay" className="h-12 w-auto" />
            </div>

            <div className="space-y-2">
              <p>Orem, UT 84057</p>
              <a href="mailto:info@lakanto.com" className="underline hover:no-underline">
                info@lakanto.com
              </a>
              <a href="#" className="block underline hover:no-underline">
                Contact Us
              </a>
              <a href="tel:8005137936" className="underline hover:no-underline">
                (800) 513-7936
              </a>
            </div>

            <div className="pt-4">
              <p className="font-semibold mb-2">Wholesale Account Support</p>
              <a href="mailto:wholesale@lakanto.com" className="block underline hover:no-underline mb-1">
                wholesale@lakanto.com
              </a>
              <a href="#" className="block underline hover:no-underline mb-1">
                Contact Us
              </a>
              <a href="tel:8005137936" className="underline hover:no-underline">
                (800) 513-7936 ext.2
              </a>
            </div>
          </div>

          {/* Contact Us Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wider">CONTACT US</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Refund and Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  HTML Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wider">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  What's Monk Fruit?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  What's Allulose?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  What's Erythritol?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Int'l iHerb Store
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Wholesale Inquiries
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Co-Packing Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wider">ACCOUNT</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Log in
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Register
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline font-bold">
                  SWEET REWARDS
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Subscribe & Save
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Get a Free Sample
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Also of Interest Section */}
        <div className="border-t border-green-500 pt-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-bold tracking-wider">ALSO OF INTEREST</span>
            <a href="#" className="hover:underline">
              What is Monk Fruit
            </a>
            <a href="#" className="hover:underline">
              Classic Monkfruit Sweetener with Allulose
            </a>
            <a href="#" className="hover:underline">
              Partnership with the Diabetes Association
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Follow Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center space-x-2 mb-4 md:mb-0 transition-colors">
            <Heart className="w-4 h-4" />
            <span>Follow on shop</span>
          </button>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:opacity-75 transition-opacity">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <Youtube className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
