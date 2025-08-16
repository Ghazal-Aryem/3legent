'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      try {
        // First fetch all categories from your Flask API
        const categoriesResponse = await axios.get('http://127.0.0.1:5000/api/category');
        
        // Extract the actual array from the response data
        const allCategories = categoriesResponse.data.data || categoriesResponse.data;
        
        // Then fetch all products to count products per category
        const productsResponse = await axios.get('http://127.0.0.1:5000/api/product');
        const allProducts = productsResponse.data.data || productsResponse.data;

        // Map categories with product counts and icons
        const categoriesWithCounts = allCategories.map(category => {
          const productCount = allProducts.filter(
            product => product.category_id === category.id
          ).length;
          
          return {
            id: category.id,
            name: category.name,
            productCount,
            icon: getCategoryIcon(category.name)
          };
        });

        setCategories(categoriesWithCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading categories:', error);
        setLoading(false);
      }
    };

    fetchCategoriesWithCounts();
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/shop?category=${category}`);
  };

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-black text-center">Shop by Categories</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-6 h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <h2 className="text-3xl font-bold mb-8 text-black text-center">Shop by Categories</h2>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* "All Categories" option */}
          <div 
            className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-all cursor-pointer group"
            onClick={() => router.push('/shop')}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛍️</div>
            <h3 className="font-medium text-gray-800 mb-8">All Categories</h3>
            <p className="text-sm text-gray-500  ">{categories.reduce((sum, cat) => sum + cat.productCount, 0)} products</p>
          </div>

          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-gray-50 rounded-lg p-6 text-center flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
                 
              </div>
             <h3 className="text-1xl font-medium text-gray-800 mb-2">{category.name}</h3>
              <div className='line-clamp-3 mt-1'>
                <p className="text-sm text-gray-500">{category.productCount} products</p>
                </div>
            </div>
            
          ))}
        </div>
      </div>
    </section>
  );
}

function getCategoryIcon(categoryName) {
  const iconMap = {
    "Golf Clubs": "⛳",
    "Golf Balls": "🏌️",
    "Golf Bags": "🎒",
    "Clothing": "🧥",
    "Footwear": "👟",
    "Accessories": "🧤"
  };
  
  // Check for exact or starts-with matching
  const matchedKey = Object.keys(iconMap).find(key => 
    categoryName.toLowerCase().startsWith(key.toLowerCase())
  );
  
  return matchedKey ? iconMap[matchedKey] : "🛍️";
}