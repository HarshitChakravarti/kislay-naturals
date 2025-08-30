import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Building, Clock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">Last updated on Aug 25 2025</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              You may contact us using the information below. We're here to help and would love to hear from you.
            </p>

            {/* Company Details */}
            <div className="space-y-6">
              {/* Company Name */}
              <div className="flex items-start space-x-3">
                <Building className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Company Name</h3>
                  <p className="text-gray-700">KISLAY NATURALS</p>
                </div>
              </div>

              {/* Registered Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Registered Address</h3>
                  <p className="text-gray-700">
                    D904, Samanvay Residency,<br />
                    Opposite Auda Garden,<br />
                    South Bopal Ahmedabad<br />
                    GUJARAT 380058
                  </p>
                </div>
              </div>

              {/* Operational Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Operational Address</h3>
                  <p className="text-gray-700">
                    D904, Samanvay Residency,<br />
                    Opposite Auda Garden,<br />
                    South Bopal Ahmedabad<br />
                    GUJARAT 380058
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Number</h3>
                  <a 
                    href="tel:+917043630938" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    +91 7043630938
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email Address</h3>
                  <a 
                    href="mailto:naturalskislay@gmail.com" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    naturalskislay@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Additional Info */}
          <div className="space-y-6">
            
            {/* Quick Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Please describe your inquiry or concern..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Location</h3>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Interactive map coming soon</p>
              <p className="text-xs text-gray-400 mt-1">
                D904, Samanvay Residency, Opposite Auda Garden,<br />
                South Bopal Ahmedabad, GUJARAT 380058
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
