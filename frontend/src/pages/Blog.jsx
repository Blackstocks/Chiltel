import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { blogPosts } from '../data/blogPosts';

const categories = [
  "All",
  "Air Conditioner",
  "Air Cooler",
  "Air Purifier",
  "Cassette AC",
  "Deep Freezer",
  "Display Counter",
  "Geyser",
  "Microwave",
  "Refrigerator",
  "Visi Cooler",
  "Washing Machine",
  "Water Purifier"
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={"OUR"} text2={"BLOG"} />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 my-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div key={post.id} className="overflow-hidden transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            <div className="relative h-48">
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{post.category}</span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="mb-4 text-gray-600 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Read More
                </button>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Blog;