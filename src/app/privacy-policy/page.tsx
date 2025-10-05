import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Cookie, Mail, Phone, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          This privacy policy sets out how KISLAY NATURALS uses and protects any information that you give KISLAY NATURALS when you visit their website and/or agree to purchase from them.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Last updated on Aug 25 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Data Protection</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        
        {/* Privacy Commitment */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Privacy Commitment</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              KISLAY NATURALS is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
            </p>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Policy Updates</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              KISLAY NATURALS may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
            </p>
          </div>
        </section>

        {/* Information Collection */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Information We Collect</h2>
          <p className="text-base sm:text-lg text-foreground mb-4 md:mb-6">
            We may collect the following information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-base md:text-lg">Personal Information</h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm md:text-base">
                <li>• Name</li>
                <li>• Contact information including email address</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-purple-100 dark:border-purple-800/30">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-base md:text-lg">Additional Data</h3>
              <ul className="text-purple-800 dark:text-purple-200 space-y-1 text-sm md:text-base">
                <li>• Demographic information (postcode, preferences, interests)</li>
                <li>• Customer survey responses</li>
                <li>• Marketing preferences</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Usage */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">How We Use Your Information</h2>
          <p className="text-base sm:text-lg text-foreground mb-4 md:mb-6">
            We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
          </p>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
              <p className="text-base md:text-lg text-foreground">Internal record keeping.</p>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
              <p className="text-base md:text-lg text-foreground">We may use the information to improve our products and services.</p>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
              <p className="text-base md:text-lg text-foreground">We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</p>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
              <p className="text-base md:text-lg text-foreground">From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail.</p>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
              <p className="text-base md:text-lg text-foreground">We may use the information to customise the website according to your interests.</p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Data Security</h2>
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
            </p>
          </div>
        </section>

        {/* Cookies Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">How We Use Cookies</h2>
          
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-orange-100 dark:border-orange-800/30">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 text-base md:text-lg">What are Cookies?</h3>
              <p className="text-orange-800 dark:text-orange-200 text-sm md:text-base">
                A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
              </p>
            </div>
            
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-blue-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-base md:text-lg">Traffic Analysis</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base">
                We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
              </p>
            </div>
            
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 text-base md:text-lg">Cookie Control</h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information Control */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Controlling Your Personal Information</h2>
          
          <div className="space-y-4 md:space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              You may choose to restrict the collection or use of your personal information in the following ways:
            </p>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                <p className="text-base md:text-lg text-foreground">
                  Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes.
                </p>
              </div>
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                <p className="text-base md:text-lg text-foreground">
                  If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:naturalskislay@gmail.com" className="text-green-600 hover:text-green-700 underline">naturalskislay@gmail.com</a>.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-green-800 dark:text-green-200">
                <strong>Third-Party Sharing:</strong> We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Contact Us About Your Data</h2>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground mb-4 md:mb-6">
              If you believe that any information we are holding on you is incorrect or incomplete, please contact us as soon as possible. We will promptly correct any information found to be incorrect.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">Address:</p>
                  <p className="text-base md:text-lg font-medium text-foreground">
                    D904, Samanvay Residency,<br />
                    Opposite Auda Garden,<br />
                    South Bopal Ahmedabad,<br />
                    GUJARAT 380058
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">Phone:</p>
                  <a href="tel:+917043630938" className="text-green-600 hover:text-green-700 font-medium text-base md:text-lg">
                    +91 7043630938
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">Email:</p>
                  <a href="mailto:naturalskislay@gmail.com" className="text-green-600 hover:text-green-700 font-medium text-base md:text-lg">
                    naturalskislay@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> By using our website or making a purchase, you consent to the collection and use of your information as described in this Privacy Policy. 
                  This policy is designed to protect your privacy and ensure transparency in how we handle your personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Page Footer */}
      <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {["Privacy Policy", "Data Protection", "Cookies", "Personal Information", "Data Security"].map(
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