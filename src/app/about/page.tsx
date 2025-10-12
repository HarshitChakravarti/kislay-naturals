import Image from "next/image"
import { Leaf, Users, Shield, Heart, Target, Globe } from "lucide-react"
import { Montserrat, Open_Sans, Yeseva_One as Yeseva_One_Font } from 'next/font/google'

// Load fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: 'swap',
});

const yeseva_One = Yeseva_One_Font({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-yeseva-one",
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-sans",
  display: 'swap',
});

export default function AboutPage() {
  return (
    <div className={`min-h-screen bg-[#F9F9F9] ${openSans.variable} ${montserrat.variable} ${yeseva_One.variable}`}>
      {/* Page Header */}
      <section className="py-12 bg-green-700 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
              ABOUT US
            </span>
          </h1>
          <p className="text-lg font-medium text-white/90 max-w-2xl mx-auto">
            Discover the story behind Kislay Naturals and our commitment to natural wellness
          </p>
          
                  </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-5xl font-bold text-[#2E7D32] mb-6 ${yeseva_One.className}`}>
                Our Mission
              </h2>
              <div className="w-20 h-1 bg-green-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 border border-green-100">
              <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="space-y-4 sm:space-y-6 text-gray-700">
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                      At Kislay Naturals, we believe that wellness should be simple, honest, and rooted in nature. Born from a passion for clean living and mindful nutrition, our brand is dedicated to delivering 100% natural, low-carb products that nourish your body and fuel your lifestyle - without compromise.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                      Each of our products is crafted with purpose, powered by nature&apos;s best ingredients, and backed by our promise of zero additives, zero shortcuts, and zero guilt. Whether you&apos;re striving for better energy, balanced nutrition, or overall vitality, Kislay Naturals is your trusted partner on the journey to holistic health.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                      With the guiding philosophy &quot;Naturally Trusted | Deeply Connected | Truly Healthy,&quot; we&apos;re not just offering products - we&apos;re building a community around conscious choices and lasting well-being.
                    </p>
                  </div>
                </div>
                
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative w-64 h-64 rounded-2xl p-8 flex items-center justify-center">
                    <Image
                      src="/logo-transparent.png"
                      alt="Kislay Naturals Logo"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-5xl font-bold text-[#2E7D32] mb-6 ${yeseva_One.className}`}>
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The core principles that guide everything we do at Kislay Naturals
              </p>
              <div className="w-20 h-1 bg-green-400 mx-auto rounded-full mt-6"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Naturally Trusted */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-10 h-10 text-[#2E7D32]" />
                </div>
                <h3 className={`text-2xl font-bold text-[#2E7D32] mb-4 text-center ${yeseva_One.className}`}>
                  Naturally Trusted
                </h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg">
                  We believe in the power of nature and use only the purest, most natural ingredients in our products. Every ingredient is carefully selected and ethically sourced.
                </p>
              </div>

              {/* Deeply Connected */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-[#2E7D32]" />
                </div>
                <h3 className={`text-2xl font-bold text-[#2E7D32] mb-4 text-center ${yeseva_One.className}`}>
                  Deeply Connected
                </h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg">
                  We&apos;re building a community of health-conscious individuals who share our passion for wellness. Together, we create a supportive network for better health.
                </p>
              </div>

              {/* Truly Healthy */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-[#2E7D32]" />
                </div>
                <h3 className={`text-2xl font-bold text-[#2E7D32] mb-4 text-center ${yeseva_One.className}`}>
                  Truly Healthy
                </h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base md:text-lg">
                  Our products are designed to support your overall well-being, with no artificial additives or preservatives. Pure nutrition for a healthier life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold text-[#2E7D32] mb-6 ${yeseva_One.className}`}>
              Meet Our Founder
            </h2>
            <div className="w-20 h-1 bg-green-400 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 border border-green-100">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Founder Image */}
              <div className="order-2 lg:order-1 flex flex-col items-center">
                <div className="relative w-80 sm:w-96 h-80 sm:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/founder3.jpg"
                    alt="Nishchoy Gupta, Founder of Kislay Naturals"
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Founder Name */}
                <div className="mt-4 sm:mt-6 text-center">
                  <h3 className={`text-xl sm:text-2xl font-bold text-[#2E7D32] ${yeseva_One.className}`}>
                    Nishchoy Gupta
                  </h3>
                </div>
              </div>

              {/* Founder Info */}
              <div className="order-1 lg:order-2">
                <div className="space-y-4 sm:space-y-6 text-gray-700">
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Nishchoy Gupta, the visionary behind Kislay Naturals, is a dynamic entrepreneur with a profound passion for health, wellness, and sustainable living. His journey began with a simple yet powerful realization: that modern lifestyles often compromise on nutrition, leading to a host of health challenges. This insight fueled his mission to create a brand that offers clean, natural, and effective solutions for everyday wellness.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Beyond business, Nishchoy is a sportsman at heart. A dedicated cricketer and fitness enthusiast, he lives by the same values he brings to his brand - discipline, resilience, and performance with integrity. His sporting spirit reflects in the way he builds his company: with teamwork, commitment, and a relentless pursuit of excellence.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Under his dynamic leadership, Kislay Naturals is evolving into a trusted name in the natural wellness space, known for its transparency, ethical sourcing, and quality-driven formulations. Nishchoy&apos;s mission is to empower individuals to live better, more balanced lives through nature-backed solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}