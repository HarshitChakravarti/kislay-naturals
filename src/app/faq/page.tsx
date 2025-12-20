"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Yeseva_One, Open_Sans } from 'next/font/google'
import Link from "next/link"

const yeseva_One = Yeseva_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-yeseva-one",
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-sans",
  display: 'swap',
})

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Kislay Monk Fruit Sweetener?",
    answer: "Kislay Monk Fruit Sweetener is a plant-based, zero-calorie sugar alternative made using monk fruit extract. It provides natural sweetness without raising blood sugar levels, making it suitable for diabetics and health-conscious individuals."
  },
  {
    question: "Is monk fruit sweetener safe for daily use?",
    answer: "Yes. Monk fruit sweetener is considered safe for regular daily consumption. It contains no added sugar, no artificial sweeteners, and does not contribute to tooth decay or insulin spikes when used in recommended quantities."
  },
  {
    question: "Does Kislay Monk Fruit Sweetener contain sugar?",
    answer: "No. Kislay Monk Fruit Sweetener is 100% sugar-free. It contains zero sucrose, zero glucose, and zero fructose, making it ideal for people looking to reduce or eliminate refined sugar from their diet."
  },
  {
    question: "Is monk fruit sweetener suitable for diabetics?",
    answer: "Absolutely. Monk fruit sweetener has a glycemic index of zero, meaning it does not increase blood glucose levels. It is widely recommended as a diabetic-friendly sugar substitute."
  },
  {
    question: "Is Kislay Monk Fruit Sweetener natural or artificial?",
    answer: "Kislay Monk Fruit Sweetener is a natural sweetener derived from monk fruit, a plant traditionally used in natural medicine. It does not contain artificial sweeteners like aspartame or saccharin."
  },
  {
    question: "Does monk fruit sweetener have calories?",
    answer: "No. Kislay Monk Fruit Sweetener is a zero-calorie sweetener, making it suitable for weight loss diets, keto diets, and calorie-controlled meal plans."
  },
  {
    question: "Can I use monk fruit sweetener for cooking and baking?",
    answer: "Yes. Kislay Monk Fruit Sweetener is heat-stable, which means it can be used for: Tea and coffee, Baking cakes and cookies, Cooking Indian sweets, Desserts and beverages. It does not break down or become bitter when heated."
  },
  {
    question: "Does monk fruit sweetener have an aftertaste?",
    answer: "Unlike some other natural sweeteners, Kislay Monk Fruit Sweetener is formulated to have minimal to no bitter aftertaste, providing a clean, sugar-like sweetness."
  },
  {
    question: "Is monk fruit better than stevia?",
    answer: "Both are natural sweeteners, but many people prefer monk fruit because: It has less bitter aftertaste, It tastes closer to sugar, It is gentler on digestion for many users. Taste preference can vary from person to person."
  },
  {
    question: "Can monk fruit sweetener help with weight loss?",
    answer: "Yes. By replacing sugar with a zero-calorie sweetener, monk fruit can help reduce overall calorie intake, which may support weight management and fat loss goals when combined with a balanced diet."
  },
  {
    question: "Is Kislay Monk Fruit Sweetener keto-friendly?",
    answer: "Yes. Kislay Monk Fruit Sweetener is keto-friendly, low-carb, and does not spike insulin, making it suitable for ketogenic and low-carbohydrate diets."
  },
  {
    question: "Can children consume monk fruit sweetener?",
    answer: "In moderate amounts, monk fruit sweetener is considered safe for children. However, children should always consume sweeteners in limited quantities as part of a balanced diet."
  },
  {
    question: "Is monk fruit sweetener suitable for pregnant women?",
    answer: "Monk fruit sweetener is generally considered safe, but pregnant or breastfeeding women should consult their healthcare professional before regular use."
  },
  {
    question: "How much monk fruit sweetener should I use?",
    answer: "Monk fruit sweetener is much sweeter than sugar, so only a small quantity is required. Start with a lower amount and adjust according to taste."
  },
  {
    question: "Where is Kislay Monk Fruit Sweetener made?",
    answer: "Kislay Monk Fruit Sweetener is manufactured in compliance with Indian food safety standards, ensuring quality, purity, and safety for consumers."
  },
  {
    question: "Is Kislay Monk Fruit Sweetener FSSAI approved?",
    answer: "Yes. Kislay Monk Fruit Sweetener is FSSAI compliant, meeting Indian food safety and regulatory requirements."
  },
  {
    question: "Why should I choose Kislay Monk Fruit Sweetener over regular sugar?",
    answer: "Because it helps you: Reduce sugar intake, Control blood sugar levels, Cut empty calories, Maintain a healthier lifestyle, Enjoy sweetness without guilt."
  },
  {
    question: "Where can I buy Kislay Monk Fruit Sweetener?",
    answer: "You can purchase Kislay Monk Fruit Sweetener through official online platforms and authorised sellers."
  },
  {
    question: "Can I use monk fruit sweetener every day in tea or coffee?",
    answer: "Yes. Kislay Monk Fruit Sweetener is ideal for daily tea and coffee consumption and does not cause sugar crashes or energy dips."
  }
]

// Function to add internal links to keywords
const addInternalLinks = (text: string): React.ReactNode => {
  const keywords = [
    { term: "monk fruit sweetener India", link: "/products" },
    { term: "sugar-free sweetener", link: "/products" },
    { term: "diabetic sweetener", link: "/products" },
    { term: "zero-calorie sweetener", link: "/products" },
    { term: "monk fruit sweetener", link: "/products" },
    { term: "natural sweetener", link: "/products" },
    { term: "diabetic-friendly", link: "/products" },
    { term: "keto-friendly", link: "/products" }
  ]

  // Sort keywords by length (longest first) to match longer phrases first
  const sortedKeywords = keywords.sort((a, b) => b.term.length - a.term.length)
  
  interface Match {
    index: number
    length: number
    term: string
    link: string
    original: string
  }

  const matches: Match[] = []
  
  // Find all matches without overlapping
  sortedKeywords.forEach(({ term, link }) => {
    const regex = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index
      const matchLength = match[0].length
      
      // Check if this match overlaps with any existing match
      const overlaps = matches.some(existing => {
        const existingEnd = existing.index + existing.length
        const matchEnd = matchIndex + matchLength
        return (matchIndex >= existing.index && matchIndex < existingEnd) ||
               (matchEnd > existing.index && matchEnd <= existingEnd) ||
               (matchIndex <= existing.index && matchEnd >= existingEnd)
      })
      
      if (!overlaps) {
        matches.push({
          index: matchIndex,
          length: matchLength,
          term,
          link,
          original: match[0]
        })
      }
    }
  })

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index)

  // Build the result
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  matches.forEach((match, idx) => {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Add the linked keyword
    parts.push(
      <Link 
        key={`link-${idx}-${match.index}`}
        href={match.link}
        className="text-green-600 hover:text-green-700 underline font-medium"
      >
        {match.original}
      </Link>
    )
    
    lastIndex = match.index + match.length
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? <>{parts}</> : text
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <div className={`min-h-screen bg-[#F9F9F9] ${openSans.variable} ${yeseva_One.variable}`}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page Header */}
      <section className="py-12 bg-green-700 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
              FREQUENTLY ASKED QUESTIONS 
            </span>
          </h1>
          <p className="text-lg font-medium text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about Kislay Monk Fruit Sweetener
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                    aria-expanded={openIndex === index}
                  >
                    <h3 className={`text-lg md:text-xl font-semibold text-gray-900 pr-4 ${yeseva_One.className}`}>
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 pt-0 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed mt-4 text-base md:text-lg">
                        {addInternalLinks(faq.answer)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Help Section */}
            <div className="mt-12 bg-green-50 rounded-lg p-8 border border-green-200">
              <h2 className={`text-2xl md:text-3xl font-bold text-[#2E7D32] mb-4 text-center ${yeseva_One.className}`}>
                Still Have Questions?
              </h2>
              <p className="text-gray-700 text-center mb-6 text-base md:text-lg">
                Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Contact Us
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

