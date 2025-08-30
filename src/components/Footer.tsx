import { Phone, MapPin, Mail, Youtube, Facebook, Linkedin, Instagram, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image src="/logo-transparent.png" alt="Kislay Logo" width={150} height={80} className="h-16 w-auto" />
            </div>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed">
              Naturally Trusted | Deeply Connected | <br></br> Truly Healthy
            </p>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">+91 7043630938</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-gray-700 text-sm">
                  <p>Samanvay Residency</p>
                  <p>South Bopal,</p>
                  <p>Ahmedabad, Gujarat 380058</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">naturalskislay@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Our Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Our Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-green-600 text-sm transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-700 hover:text-green-600 text-sm transition-colors">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-700 hover:text-green-600 text-sm transition-colors">
                  T&C
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-700 hover:text-green-600 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-700 hover:text-green-600 text-sm transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter and Social Section */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Our Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Networks */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Follow Us On:</h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/179ALHJvH6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nishchoy-gupta-b1421b366?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/kislay.naturals?igsh=azZ1azQ3ajV1M2Q="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 hover:from-purple-700 hover:via-pink-700 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2024 Kislay. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
