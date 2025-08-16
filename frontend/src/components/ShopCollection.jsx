'use client';
import React from "react";
// import mensSetImage from '/assets/men_col.png'
// import juniorsSetImage from '/assets/junior_col.png';
// import womensSetImage from '/assets/women_col.png';
import Image from "next/image";
export default function ShopCollection() {
  const collections = [
    { 
      name: "Men's Set", 
      count: 2,
      image: '/assets/men_col.png'
    },
    { 
      name: "Juniors Set", 
      count: 3,
      image: '/assets/junior_col.png'
    },
    { 
      name: "Women's Set", 
      count: 4,
      image: '/assets/women_col.png'
    }
  ];

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-black">Shop Collection</h2>
          <button className="text-black hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow h-96">
              {/* Collection Image */}
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="w-full h-full object-cover"
              />
              
              {/* Collection Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                <p className="text-gray-300">Collection: {collection.count}</p>
              </div>
              
              {/* Hover Button */}
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20"
                onClick={() => window.location.href = `/shop`}>
                <span className="bg-white text-black py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  View Collection
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}