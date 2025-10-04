import React, { useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const navigate=useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tips', 'Care Guide', 'News'];

  const blogPosts = [
    {
      id: 1,
      title: "5 Essential Laundry Tips for Busy Families",
      excerpt: "Save time and get better results with these simple laundry hacks that every family should know.",
      author: "Sarah Johnson",
      date: "June 25, 2025",
      category: "Tips",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "How to Care for Your Delicate Clothes",
      excerpt: "Keep your silk, wool, and other delicate fabrics looking new with proper care techniques.",
      author: "Mike Chen",
      date: "June 22, 2025",
      category: "Care Guide",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Why Choose Professional Laundry Service?",
      excerpt: "Discover the benefits of professional cleaning and how it can save you time and money.",
      author: "Emma Thompson",
      date: "June 20, 2025",
      category: "News",
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Common Stain Removal Methods",
      excerpt: "Learn how to remove the most common stains from your clothes using household items.",
      author: "Lisa Rodriguez",
      date: "June 18, 2025",
      category: "Tips",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Eco-Friendly Laundry Solutions",
      excerpt: "Simple ways to make your laundry routine more environmentally friendly without compromising quality.",
      author: "Green Team",
      date: "June 15, 2025",
      category: "Care Guide",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "New Services Now Available",
      excerpt: "We're excited to announce our expanded services including same-day delivery and premium care options.",
      author: "UClean Team",
      date: "June 12, 2025",
      category: "News",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600">Tips, guides, and news about laundry care</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                {/* <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button> */}
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Try Our Services?
            </h2>
            <p className="text-gray-600 mb-6">
              Experience professional laundry care with convenient pickup and delivery.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
             onClick={()=>navigate("/list")}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;