import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, Copyright, ExternalLink, Gavel, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
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
          Terms and Conditions
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          Your use of the website and/or purchase from us are governed by these Terms and Conditions. 
          Please read them carefully before using our services.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Last updated on Aug 25 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            <span>Legal Agreement</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        
        {/* Definitions Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Definitions</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              For the purpose of these Terms and Conditions, the term <strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong> used anywhere on this page shall mean <strong>KISLAY NATURALS</strong>, whose registered/operational office is D904, Samanvay Residency, Opposite Auda Garden, South Bopal Ahmedabad GUJARAT 380058. <strong>"you"</strong>, <strong>"your"</strong>, <strong>"user"</strong>, <strong>"visitor"</strong> shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
            </p>
          </div>
        </section>

        {/* Scope */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Scope of Terms</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              Your use of the website and/or purchase from us are governed by following Terms and Conditions:
            </p>
          </div>
        </section>

        {/* Terms List */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Content Changes */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">1. Content Changes</h2>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                The content of the pages of this website is subject to change without notice.
              </p>
            </div>
          </section>

          {/* No Warranty */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">2. No Warranty or Guarantee</h2>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-red-100 dark:border-red-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </p>
            </div>
          </section>

          {/* Use at Own Risk */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">3. Use at Your Own Risk</h2>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-orange-100 dark:border-orange-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
              </p>
            </div>
          </section>

          {/* Copyright and Intellectual Property */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">4. Copyright and Intellectual Property</h2>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-start gap-3 md:gap-4">
                <Copyright className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mt-1 flex-shrink-0" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground">
                  Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Trademarks */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">5. Trademarks</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
              </p>
            </div>
          </section>

          {/* Unauthorized Use */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">6. Unauthorized Use</h2>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-red-100 dark:border-red-800/30">
              <div className="flex items-start gap-3 md:gap-4">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground">
                  Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                </p>
              </div>
            </div>
          </section>

          {/* External Links */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">7. External Links</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3 md:gap-4">
                <ExternalLink className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground">
                  From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                </p>
              </div>
            </div>
          </section>

          {/* Linking to Our Website */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">8. Linking to Our Website</h2>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                You may not create a link to our website from another website or document without KISLAY NATURALS's prior written consent.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">9. Governing Law</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
              <div className="flex items-start gap-3 md:gap-4">
                <Gavel className="w-6 h-6 md:w-8 md:h-8 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground">
                  Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                </p>
              </div>
            </div>
          </section>

          {/* Transaction Liability */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">10. Transaction Liability</h2>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-red-100 dark:border-red-800/30">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
              </p>
            </div>
          </section>
        </div>

        {/* Contact Information */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Questions About These Terms?</h2>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-800/30">
            <p className="text-base sm:text-lg leading-relaxed text-foreground mb-4 md:mb-6">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-sm md:text-base text-muted-foreground mb-2">Company:</p>
                <p className="text-base md:text-lg font-medium text-foreground">KISLAY NATURALS</p>
              </div>
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
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> These Terms and Conditions constitute a legally binding agreement between you and KISLAY NATURALS. 
                  By using our website or making a purchase, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Page Footer */}
      <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {["Terms and Conditions", "Legal Agreement", "Website Usage", "Purchase Terms", "User Agreement"].map(
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
