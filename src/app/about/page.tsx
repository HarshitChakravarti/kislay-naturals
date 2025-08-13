import Image from "next/image"
import { Globe, Shield, Target, Users, Leaf, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Yeseva_One } from 'next/font/google'

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 ${yeseva_One.className}`}>
            ABOUT US
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-green-600 mx-auto"></div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row items-start">
              <div className="lg:w-5/12 xl:w-1/2 pr-0 lg:pr-16 xl:pr-24">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight ${yeseva_One.className}`}>The <span className="text-green-600">Founder</span></h2>
                
                <div className="space-y-7 text-gray-700">
                  <p className="leading-relaxed text-gray-600">
                    <span className="font-bold">Nishchoy Gupta</span>, the passionate force behind Kislay Naturals - a brand rooted in authenticity, sustainability, and the power of nature. A student of LJ University with a strong foundation in sports management, Nishchoy blends scientific understanding with a deep respect for traditional wellness practices. His entrepreneurial journey was fueled by a simple yet powerful idea: to offer clean, natural, and guilt-free alternatives that promote a healthier lifestyle.
                  </p>
                  <p className="leading-relaxed text-gray-600">
                    Beyond business, Nishchoy is a sportsman at heart. A dedicated cricketer and fitness enthusiast, he lives by the same values he brings to his brand - discipline, resilience, and performance with integrity. His sporting spirit reflects in the way he builds his company: with teamwork, commitment, and a relentless pursuit of excellence.
                  </p>
                  <p className="leading-relaxed text-gray-600">
                    Under his dynamic leadership, Kislay Naturals is evolving into a trusted name in the natural wellness space, known for its transparency, ethical sourcing, and quality-driven formulations. Nishchoy's mission is to empower individuals to live better, more balanced lives through nature-backed solutions—while also fostering community and environmental responsibility.
                  </p>
                  <p className="leading-relaxed text-gray-600">
                    With his unique blend of scientific insight, entrepreneurial energy, and sportsmanship, Nishchoy leads Kislay Naturals as not just a brand, but a lifestyle movement for those who seek wellness without compromise.
                  </p>
                </div>
              </div>
              
              <div className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 mt-12 lg:mt-0 w-full lg:w-5/12 xl:w-[42%] relative h-[450px] sm:h-[500px] lg:h-[550px] xl:h-[600px] rounded-l-2xl lg:rounded-l-3xl overflow-hidden">
                <Image
                  src="/founder3.jpg"
                  alt="Nishchoy Gupta, Founder of Kislay Naturals"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Mobile: Text first, then logo */}
          <div className="md:hidden flex flex-col">
            <div className="mb-8">
              <h2 className={`text-3xl font-bold text-gray-900 mb-6 leading-tight ${yeseva_One.className}`}>
                Our <span className="text-green-600">Mission</span>
              </h2>
              <p className="text-black leading-relaxed mb-4">
                At Kislay Naturals, we believe that wellness should be simple, honest, and rooted in nature. Born from a passion for clean living and mindful nutrition, our brand is dedicated to delivering 100% natural, low-carb products that nourish your body and fuel your lifestyle - without compromise.
              </p>
              <p className="text-black leading-relaxed mb-4">
                Each of our products is crafted with purpose, powered by nature's best ingredients, and backed by our promise of zero additives, zero shortcuts, and zero guilt. Whether you're striving for better energy, balanced nutrition, or overall vitality, Kislay Naturals is your trusted partner on the journey to holistic health.
              </p>
              <p className="text-black leading-relaxed">
                With the guiding philosophy "Naturally Trusted | Deeply Connected | Truly Healthy," we're not just offering products - we're building a community around conscious choices and lasting well-being.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <Image
                  src="/logo-transparent.png"
                  alt="Kislay Naturals Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Desktop: Original side-by-side layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/logo-transparent.png"
                  alt="Kislay Naturals Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight ${yeseva_One.className}`}>
                Our <span className="text-green-600">Mission</span>
              </h2>
              <p className="text-black leading-relaxed mb-6">
                At Kislay Naturals, we believe that wellness should be simple, honest, and rooted in nature. Born from a passion for clean living and mindful nutrition, our brand is dedicated to delivering 100% natural, low-carb products that nourish your body and fuel your lifestyle - without compromise.
              </p>
              <p className="text-black leading-relaxed mb-6">
                Each of our products is crafted with purpose, powered by nature's best ingredients, and backed by our promise of zero additives, zero shortcuts, and zero guilt. Whether you're striving for better energy, balanced nutrition, or overall vitality, Kislay Naturals is your trusted partner on the journey to holistic health.
              </p>
              <p className="text-black leading-relaxed">
                With the guiding philosophy "Naturally Trusted | Deeply Connected | Truly Healthy," we're not just offering products - we're building a community around conscious choices and lasting well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight ${yeseva_One.className}`}>Our<span className="text-green-600"> Values</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${yeseva_One.className}`}>Naturally Trusted</h3>
                <p className="text-gray-600 text-sm">
                  We believe in the power of nature and use only the purest, most natural ingredients in our products.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${yeseva_One.className}`}>Deeply Connected</h3>
                <p className="text-gray-600 text-sm">
                  We're building a community of health-conscious individuals who share our passion for wellness.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${yeseva_One.className}`}>Truly Healthy</h3>
                <p className="text-gray-600 text-sm">
                  Our products are designed to support your overall well-being, with no artificial additives or preservatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">


        </div>
      </section>
    </div>
  )
}
