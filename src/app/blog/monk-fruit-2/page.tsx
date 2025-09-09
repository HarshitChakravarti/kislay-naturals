import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogDetailPage() {
  return (
    <article className="max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12">
      {/* Blog Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Is Monk Fruit Sweetener Good for Diabetics?
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.
        </p>
        <br />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>September 9, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>4 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Health & Diabetes</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8 md:mb-12">
        <img
          src="/cover.jpg"
          alt="Monk fruit sweetener for diabetics"
          className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
        />
      </div>

      {/* Blog Content */}
      <div className="prose prose-base sm:prose-lg max-w-none">
        <div className="mb-6 md:mb-8">
          <p className="text-base sm:text-lg leading-relaxed text-foreground">
            Diabetes is on the rise in India, and managing sugar intake is a daily challenge. But does that mean you have to give up sweetness altogether? Not at all! Monk fruit sweetener is a natural sugar alternative that is completely safe for diabetics.
          </p>
        </div>

        {/* Why Monk Fruit is Safe Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">
            Why Monk Fruit is Safe for Diabetics
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30">
            <p className="text-base sm:text-lg leading-relaxed">
              Unlike sugar, monk fruit sweetener does not spike blood glucose levels. It is a <strong>low-glycemic sweetener</strong>, making it safe for daily use by diabetics. The natural compounds in monk fruit, called mogrosides, provide sweetness without affecting blood sugar or insulin levels.
            </p>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">
            How to Use Monk Fruit Sweetener in a Diabetic Diet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: "Beverages",
                description: "Add to tea, coffee, or lemonade",
                icon: "☕",
              },
              {
                title: "Desserts",
                description: "Use in homemade sweets & desserts",
                icon: "🍰",
              },
              {
                title: "Breakfast",
                description: "Sprinkle on fruits, oats, or yogurt",
                icon: "🥣",
              },
              {
                title: "Baking",
                description: "Substitute for sugar in recipes",
                icon: "🍪",
              },
            ].map((use, index) => (
              <div
                key={index}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-card rounded-lg md:rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xl md:text-2xl flex-shrink-0">{use.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-foreground">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 inline mr-2" />
                    {use.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{use.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-800/30 text-center my-8 md:my-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-foreground">
            Sweetness Without the Guilt
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            With Kislay Monk Fruit Sweetener, diabetics can finally enjoy sweet foods without worrying about sugar spikes.
            Make the switch today and experience the natural sweetness your body deserves.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
