import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Building, Clock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Kislay Naturals",
  description: "Get in touch with Kislay Naturals. We're here to answer your questions about our natural monk fruit sweeteners.",
};

export default function ContactUsPage() {
  return (
    <article className="max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12">
      {/* Page Header */}
      <header className="mb-8 md:mb-12">
        <Link 
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4 md:mb-6"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base">Back to Home</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold font-heading leading-tight mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Contact Us
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          You may contact us using the information below. We&apos;re here to help and would love to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated on Aug 25 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Get in Touch</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Company Information</h2>
            
            {/* Company Details */}
            <div className="space-y-6">
              {/* Company Name */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800/30">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Building className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">Company Name</h3>
                    <p className="text-sm md:text-base text-foreground">KISLAY NATURALS</p>
                  </div>
                </div>
              </div>

              {/* Registered Address */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">Registered Address</h3>
                    <p className="text-sm md:text-base text-foreground">
                      D904, Samanvay Residency,<br />
                      Opposite Auda Garden,<br />
                      South Bopal Ahmedabad<br />
                      GUJARAT 380058
                    </p>
                  </div>
                </div>
              </div>

              {/* Operational Address */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">Operational Address</h3>
                    <p className="text-sm md:text-base text-foreground">
                      D904, Samanvay Residency,<br />
                      Opposite Auda Garden,<br />
                      South Bopal Ahmedabad<br />
                      GUJARAT 380058
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-orange-100 dark:border-orange-800/30">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">Phone Number</h3>
                    <a 
                      href="tel:+917043630938" 
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm md:text-base"
                    >
                      +91 7043630938
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">Email Address</h3>
                    <a 
                      href="mailto:naturalskislay@gmail.com" 
                      className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors text-sm md:text-base"
                    >
                      naturalskislay@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Additional Info */}
          <div className="space-y-6">
            
            {/* Quick Contact Form */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Send us a Message</h3>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-800/30">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm md:text-base font-medium text-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm md:text-base font-medium text-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm md:text-base font-medium text-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm md:text-base font-medium text-foreground mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm md:text-base font-medium text-foreground mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm md:text-base"
                      placeholder="Please describe your inquiry or concern..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm md:text-base"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Business Hours</h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mr-2" />
                  <h4 className="text-base md:text-lg font-semibold text-yellow-900 dark:text-yellow-100">Operating Schedule</h4>
                </div>
                <div className="space-y-1.5 text-sm md:text-base text-yellow-800 dark:text-yellow-200">
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
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
              <p className="text-sm md:text-base text-green-800 dark:text-green-200">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Our Location</h3>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-800/30">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MapPin className="w-16 h-16 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                <p className="text-sm md:text-base">Interactive map coming soon</p>
                <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1">
                  D904, Samanvay Residency, Opposite Auda Garden,<br />
                  South Bopal Ahmedabad, GUJARAT 380058
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Page Footer */}
      <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {["Contact Us", "Get in Touch", "Customer Service", "Business Hours", "Location"].map(
            (tag) => (
              <span key={tag} className="px-2 md:px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs md:text-sm">
                #{tag.replace(" ", "")}
              </span>
            ),
          )}
        </div>

        <div className="text-xs md:text-sm text-muted-foreground">
          <p>Last updated: Aug 25 2025</p>
        </div>
      </footer>
    </article>
  );
}