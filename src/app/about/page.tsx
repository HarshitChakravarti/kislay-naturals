import Image from "next/image"
import { Globe, Shield, Target, Users, Leaf, Clock, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-8">The Founder</h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                Back in 2020, as the world was thrown into a global pandemic and supply chain crisis, with everything
                becoming the norm, businesses faced production halts, delayed shipments, and broken links across every
                stage of the supply chain. In the midst of this chaos, we saw an opportunity to make a difference.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We decided to step up using our expertise to create a reliable, end-to-end service that businesses could
                depend on.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/founder3.jpg"
                alt="Global presence map"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="w-16 h-16 text-green-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-300 rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-green-600">Mission</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We launched with one clear mission: to support organizations of all sizes, from multinational
                corporations to fast-moving startups, by offering a seamless, transparent, and efficient sourcing
                experience. We positioned ourselves as a partner throughout the entire business lifecycle, handling
                everything from sourcing raw materials to delivering finished products to your doorstep.
              </p>
              <p className="text-gray-600 leading-relaxed">
                What started as a solution to a crisis has grown into a long-term vision. Today, we continue to serve as
                a dependable force in global trade, helping our clients scale faster, operate smarter, and never miss a
                beat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Source with Purpose</h3>
                <p className="text-gray-600 text-sm">
                  We connect you to the right products, at the right time, with zero compromise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Built on Transparency</h3>
                <p className="text-gray-600 text-sm">
                  We make every step visible process. Just clear, honest updates from us to you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Operate with Precision</h3>
                <p className="text-gray-600 text-sm">
                  From supplier vetting to final delivery, every step is executed with care and accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership Driven</h3>
                <p className="text-gray-600 text-sm">
                  We work as your ally, committed to your long-term success, not short-term wins.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Low-Impact Manufacturing</h3>
                <p className="text-gray-600 text-sm">
                  Prioritize facilities that use energy-efficient processes and waste-reducing processes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">On-Time, Every Time</h3>
                <p className="text-gray-600 text-sm">When we commit to a timeline, we stick to it.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                <span className="text-green-600">Sustainability</span> That Scales With You
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Grow your business without compromising your values for the planet.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Sustainability illustration"
                width={300}
                height={300}
                className="w-full max-w-sm h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-green-600">Commitment</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                At Kislay Naturals, sustainability isn't just a buzzword; it's a core principle. We believe that ethical
                sourcing and environmentally responsible practices should be a given, not an exception.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Fair, ethical production</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Zero waste to landfill</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Climate-responsible processes</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                <strong>We're In This For The Long Run</strong>
              </p>
              <p className="text-gray-600 leading-relaxed">
                Before sourcing starts with better values, but we're committed to creating the path and also being part
                of the way.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Sustainable building illustration"
                width={400}
                height={400}
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-300 mb-4">GET IN TOUCH</p>
          <h2 className="text-4xl font-bold mb-6">Meet The Team!</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Built by a full-remote, globally distributed team with a shared passion for helping from the global
            manufacturing network.
          </p>

        </div>
      </section>
    </div>
  )
}
