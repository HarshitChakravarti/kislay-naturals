import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review: "Kislay Naturals' monk fruit sweetener is a game changer! No aftertaste and so healthy.",
  },
  {
    id: 2,
    name: "Rahul M.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    review: "I love using it in my tea and baking. The best natural sweetener I've tried!",
  },
  {
    id: 3,
    name: "Anjali T.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    review: "Great taste, great price, and I feel good about what I'm eating.",
  },
];

const Testimonials = () => (
  <section className="w-full py-12 bg-green-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-8 text-center font-serif">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full mb-4 border-2 border-green-200 object-cover"
            />
            <p className="text-green-900 mb-3">"{t.review}"</p>
            <span className="font-semibold text-green-700">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 