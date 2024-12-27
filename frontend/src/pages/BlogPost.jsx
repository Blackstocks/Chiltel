import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(post => post.id === parseInt(postId));
  
  if (!post) {
    return (
      <div className="px-4 py-16 text-center md:px-8 lg:px-16">
        <h1 className="mb-4 text-2xl font-bold">Post Not Found</h1>
        <button 
          onClick={() => navigate('/blog')}
          className="text-blue-600 hover:text-blue-700"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <button 
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-700"
      >
        ← Back to Blog
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
        <div className="flex gap-4 mb-6 text-gray-600">
          <span>{post.date}</span>
          <span>{post.category}</span>
          <span>{post.readTime}</span>
        </div>
        
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
        
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {post.fullContent}
          </p>
        </div>
      </div>
      
      <div className="mt-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default BlogPost;
