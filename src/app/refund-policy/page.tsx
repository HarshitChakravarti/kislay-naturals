import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Clock, RotateCcw, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicyPage() {
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
          Refund & Cancellation Policy
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          KISLAY NATURALS believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. 
          We are committed to ensuring customer satisfaction and will work with you to resolve any issues you may encounter.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Protection</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        
        {/* Refund Policy Overview */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Refund Policy Overview</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              At KISLAY NATURALS, we want you to be completely satisfied with your purchase. If you're not satisfied, we're here to help with our customer-friendly refund and cancellation policy.
            </p>
          </div>
        </section>

        {/* Cancellation Policy Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">1. Cancellation Policy</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-base md:text-lg">7-Day Cancellation Window</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base">
                    Cancellations will be considered only if the request is made within 7 days of placing the order.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1 text-base md:text-lg">Important Notice</h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
                    Cancellation requests may not be entertained if orders have been communicated to vendors/merchants and they have initiated the shipping process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perishable Items Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">2. Perishable Items</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-red-100 dark:border-red-800/30">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1 text-base md:text-lg">Non-Refundable Items</h3>
                  <p className="text-red-800 dark:text-red-200 text-sm md:text-base">
                    KISLAY NATURALS does not accept cancellation requests for perishable items like flowers, eatables, etc. 
                    However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Damaged or Defective Items Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">3. Damaged or Defective Items</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-orange-100 dark:border-orange-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1 text-base md:text-lg">Report Within 7 Days</h3>
                  <p className="text-orange-800 dark:text-orange-200 text-sm md:text-base">
                    In case of receipt of damaged or defective items, please report the same to our Customer Service team within 7 days of receipt of the products.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              The request will be entertained once the merchant has checked and determined the same at their own end. 
              We will work with our vendors to ensure a fair resolution for you.
            </p>
          </div>
        </section>

        {/* Product Quality Issues Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">4. Product Quality Issues</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1 text-base md:text-lg">7-Day Reporting Period</h3>
                  <p className="text-green-800 dark:text-green-200 text-sm md:text-base">
                    If you feel that the product received is not as shown on the site or as per your expectations, 
                    you must bring it to the notice of our customer service within 7 days of receiving the product.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              Our Customer Service Team will thoroughly investigate your complaint and take an appropriate decision based on the findings.
            </p>
          </div>
        </section>

        {/* Warranty Items Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">5. Warranty Items</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 text-base md:text-lg">Manufacturer's Warranty</h3>
                  <p className="text-purple-800 dark:text-purple-200 text-sm md:text-base">
                    For products that come with a warranty from manufacturers, please refer warranty-related issues directly to the manufacturer. 
                    We can assist you in contacting the manufacturer if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Processing Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">6. Refund Processing</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <RotateCcw className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1 text-base md:text-lg">7-Day Processing Time</h3>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm md:text-base">
                    In case of any refunds approved by KISLAY NATURALS, it will take 7 days for the refund to be processed to the end customer.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-base md:text-lg">Return Shipping</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base">
                    Customers are responsible for return shipping costs unless the return is due to our error or defective products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Need Help With Returns or Refunds?</h2>
          <div className="space-y-4">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              If you have any questions about our refund and cancellation policy or need assistance with a return, please don't hesitate to contact our customer service team.
            </p>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-800/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">Customer Service:</p>
                  <p className="text-base md:text-lg font-medium text-foreground">+91 7043630938</p>
                  <p className="text-base md:text-lg font-medium text-foreground">naturalskislay@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">Business Hours:</p>
                  <p className="text-base md:text-lg font-medium text-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-base md:text-lg font-medium text-foreground">Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Note Section */}
        <section className="mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 sm:p-4 rounded-lg md:rounded-xl border border-yellow-100 dark:border-yellow-800/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1 text-base md:text-lg">Policy Updates</h3>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
                  This policy is subject to change without prior notice. For the most current version, please check this page regularly or contact our customer service team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Page Footer */}
      <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {["Refund Policy", "Cancellation", "Customer Service", "Returns", "Customer Protection"].map(
            (tag) => (
              <span key={tag} className="px-2 md:px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs md:text-sm">
                #{tag.replace(" ", "")}
              </span>
            ),
          )}
        </div>

        <div className="text-xs md:text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </article>
  );
}
