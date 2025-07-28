"use client";
import React, { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded px-6 py-2 hover:from-green-700 hover:to-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Subscribe
        </button>
      </form>
      {submitted && (
        <p className="text-green-700 mt-2 text-sm text-center">Thank you for subscribing!</p>
      )}
    </div>
  );
};

export default NewsletterSignup; 