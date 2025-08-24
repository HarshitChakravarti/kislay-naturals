import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogDetailPage() {
  return (
    <article className="max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12">
      {/* Blog Header */}
      <header className="mb-8 md:mb-12">

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories,
          diabetic-friendly, and perfect for weight management.
        </p>
        <br></br>
         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 24, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Health & Nutrition</span>
          </div>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="mb-8 md:mb-12">
        <img
          src="/cover333.jpg"
          alt="Monk fruit sweetener in a bowl with fresh monk fruits"
          className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
        />
      </div>

      {/* Blog Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        <div className="mb-6 md:mb-8">
          <p className="text-base sm:text-lg leading-relaxed text-foreground">
            If you're looking for a healthy alternative to sugar, monk fruit sweetener is becoming the top choice for
            health-conscious individuals in India. Unlike artificial sweeteners or refined sugar, monk fruit extract is
            100% natural, zero-calorie, and diabetic-friendly.
          </p>
        </div>

        {/* What is Monk Fruit Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">What is Monk Fruit Sweetener?</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Monk fruit, also known as <em>luo han guo</em>, is a small fruit native to Southeast Asia. The extract
              from monk fruit is <strong>150–200 times sweeter than sugar</strong>, but without the calories.
            </p>
          </div>
        </section>

        {/* Health Benefits Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Health Benefits of Monk Fruit Sweetener</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: "Zero calories",
                description: "ideal for weight management",
                icon: "🎯",
              },
              {
                title: "Safe for diabetics",
                description: "no effect on blood sugar levels",
                icon: "💚",
              },
              {
                title: "Anti-inflammatory properties",
                description: "supports immunity",
                icon: "🛡️",
              },
              {
                title: "No artificial chemicals",
                description: "unlike aspartame or sucralose",
                icon: "🌿",
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

        {/* Comparison Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            Why Choose Monk Fruit Sweetener Over Other Sugar Substitutes?
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Compared to stevia or artificial sweeteners, monk fruit has a{" "}
              <strong>clean, natural taste with no bitter aftertaste</strong>. It's perfect for tea, coffee, desserts,
              and everyday cooking.
            </p>
          </div>
        </section>

        {/* India Trend Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">Monk Fruit Sweetener in India – A Growing Trend</h2>
          <div className="relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <div className="pl-6 md:pl-8">
              <p className="text-base sm:text-lg leading-relaxed">
                As more Indians shift towards healthy eating, monk fruit sweetener is becoming a popular choice for
                fitness enthusiasts, diabetics, and weight-watchers.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl text-white text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Make the Switch?</h3>
            <p className="text-base sm:text-lg mb-6 md:mb-8 opacity-90">
              👉 Switch to Kislay Monk Fruit Sweetener today for a healthier lifestyle!
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
          {["Natural Sweeteners", "Monk Fruit", "Healthy Living", "Sugar Substitute", "Diabetic Friendly"].map(
            (tag) => (
              <span key={tag} className="px-2 md:px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs md:text-sm">
                #{tag.replace(" ", "")}
              </span>
            ),
          )}
        </div>

        <div className="text-xs md:text-sm text-muted-foreground">
          <p>Last updated: August 24, 2025</p>
        </div>
      </footer>
    </article>
  )
}
