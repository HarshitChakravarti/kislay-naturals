import React from "react";

const posts = [
  {
    id: 1,
    title: "5 Surprising Benefits of Monk Fruit Sweetener",
    excerpt: "Discover why monk fruit is the healthiest sugar alternative for your daily routine.",
    image: "/next.svg", // Replace with real blog image
    link: "#",
  },
  {
    id: 2,
    title: "How to Use Monk Fruit in Baking",
    excerpt: "Tips and tricks for substituting monk fruit in your favorite recipes.",
    image: "/next.svg", // Replace with real blog image
    link: "#",
  },
];

const BlogPreview = () => (
  <section className="w-full py-12 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-8 text-center font-serif">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-green-50 rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-24 h-24 object-contain rounded mb-4 md:mb-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2 text-lg">{post.title}</h3>
              <p className="text-green-800 mb-4 text-sm">{post.excerpt}</p>
              <a
                href={post.link}
                className="inline-block bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded shadow px-5 py-2 text-sm hover:from-green-700 hover:to-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BlogPreview; 