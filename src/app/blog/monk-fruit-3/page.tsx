import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function BlogDetailPage() {
  return (
    <article className="max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12">
      {/* Blog Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.
        </p>
        <br />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>September 14, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>6 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Health & Wellness</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8 md:mb-12">
        <Image
          src="/cover333.jpg"
          alt="Monk fruit sweetener in a bowl with fresh monk fruits"
          width={1200}
          height={600}
          className="w-full h-auto object-cover rounded-xl md:rounded-2xl shadow-lg"
        />
      </div>

      {/* Blog Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        <div className="mb-6 md:mb-8">
          <p className="text-base sm:text-lg leading-relaxed text-foreground">
            Sugar is one of the biggest contributors to obesity, diabetes, and heart disease. If you&apos;re planning to quit sugar, monk fruit sweetener is your best option. Here&apos;s why:
          </p>
        </div>

        {/* Reason 1: Zero Calories */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            1. Zero Calories, Zero Guilt
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Enjoy sweetness without adding extra calories. Unlike sugar which contains 16 calories per teaspoon, monk fruit sweetener has <strong>zero calories</strong>, making it perfect for weight management and calorie-conscious individuals.
            </p>
          </div>
        </section>

        {/* Reason 2: Perfect for Weight Loss */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            2. Perfect for Weight Loss
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Supports fat loss and reduces cravings. Monk fruit sweetener helps you maintain a calorie deficit while still satisfying your sweet tooth, making it easier to stick to your weight loss goals.
            </p>
          </div>
        </section>

        {/* Reason 3: Diabetic-Friendly */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            3. Diabetic-Friendly
          </h2>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-purple-100 dark:border-purple-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Safe for people with Type 1 and Type 2 diabetes. Monk fruit sweetener has a <strong>zero glycemic index</strong>, meaning it doesn&apos;t raise blood sugar levels, making it the perfect choice for diabetics.
            </p>
          </div>
        </section>

        {/* Reason 4: 100% Natural */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            4. 100% Natural
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
            <p className="text-base sm:text-lg leading-relaxed">
              No chemicals, no artificial additives. Monk fruit sweetener is extracted from the natural fruit, making it a clean, pure alternative to artificial sweeteners like aspartame or sucralose.
            </p>
          </div>
        </section>

        {/* Reason 5: Great Taste */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            5. Great Taste
          </h2>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-teal-100 dark:border-teal-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Sweet, clean taste with no bitter aftertaste. Unlike stevia which can have a bitter aftertaste, monk fruit sweetener provides a clean, natural sweetness that&apos;s closest to sugar.
            </p>
          </div>
        </section>

        {/* Benefits Summary */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">
            Why Choose Monk Fruit Over Other Sweeteners?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: "Zero calories",
                description: "Perfect for weight management",
                icon: "🎯",
              },
              {
                title: "Diabetic safe",
                description: "No blood sugar spikes",
                icon: "💚",
              },
              {
                title: "Natural source",
                description: "No artificial chemicals",
                icon: "🌿",
              },
              {
                title: "Great taste",
                description: "Clean, sweet flavor",
                icon: "😋",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-card rounded-lg md:rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xl md:text-2xl flex-shrink-0">{benefit.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-foreground">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 inline mr-2" />
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl text-white text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Make the Switch?</h3>
            <p className="text-base sm:text-lg mb-6 md:mb-8 opacity-90">
              👉 Whether you&apos;re on a weight-loss journey, diabetic, or simply health-conscious, Kislay Monk Fruit Sweetener is your perfect sugar replacement.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 md:px-8 py-2 md:py-3 text-base md:text-lg w-full sm:w-auto"
              >
                Buy Now - Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {["Sugar Free", "Monk Fruit", "Weight Loss", "Diabetic Friendly", "Natural Sweetener"].map(
            (tag) => (
              <span key={tag} className="px-2 md:px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs md:text-sm">
                #{tag.replace(" ", "")}
              </span>
            ),
          )}
        </div>

        <div className="text-xs md:text-sm text-muted-foreground">
          <p>Last updated: September 14, 2025</p>
        </div>
      </footer>
    </article>
  )
}