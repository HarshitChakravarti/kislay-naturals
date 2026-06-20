import { Phone, MapPin, Mail, Youtube, Facebook, Linkedin, Instagram, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Logo and Brand Section */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center">
              <Image src="/logo/logonew.png" alt="Kislay Logo" width={150} height={80} className="h-16 sm:h-20 md:h-24 w-auto" />
            </div>
            <p className="text-gray-600 font-semibold text-xs sm:text-sm leading-relaxed">
              Naturally Trusted | Deeply Connected | <br className="hidden sm:block"></br> Truly Healthy
            </p>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide">Contact Details</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A35A] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-xs sm:text-sm">+91 7043630938</span>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A35A] mt-0.5 flex-shrink-0" />
                <div className="text-gray-700 text-xs sm:text-sm">
                  <p>Samanvay Residency</p>
                  <p>South Bopal,</p>
                  <p>Ahmedabad, Gujarat 380058</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A35A] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-xs sm:text-sm">support@kislaynaturals.com</span>
              </div>
            </div>
          </div>

          {/* Our Company Section */}
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide">Our Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-green-600 text-xs sm:text-sm transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-700 hover:text-green-600 text-xs sm:text-sm transition-colors">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-700 hover:text-green-600 text-xs sm:text-sm transition-colors">
                  T&C
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-700 hover:text-green-600 text-xs sm:text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-700 hover:text-green-600 text-xs sm:text-sm transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter and Social Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Newsletter */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide">Our Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-r-md transition-colors">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Social Networks */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide">Follow Us On:</h3>
              <div className="flex space-x-2 sm:space-x-3">
                <a
                  href="https://www.facebook.com/share/179ALHJvH6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/kislay-natural/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://www.instagram.com/kislay.naturals?igsh=azZ1azQ3ajV1M2Q="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 hover:from-purple-700 hover:via-pink-700 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600 text-xs sm:text-sm">
            <p>&copy; 2026 Kislay Naturals Private Limited (GSTNO:-24AAMCK8534G1ZB). All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
