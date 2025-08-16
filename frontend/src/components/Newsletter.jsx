'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";

export default function Newsletter() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a skeleton loader or null during SSR
    return (
      <div className="flex flex-col items-center justify-center text-center h-[400px] bg-gray-100 animate-pulse">
        {/* Skeleton loader placeholder */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row w-full bg-black text-white">
        {/* Left Image - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center p-6 relative h-64">
          <Image
            src='/assets/newsletter1.jpg'
            alt="Golf Glove"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Center Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h1>
          <p className="text-gray-400 mb-6 md:whitespace-pre-line">
            Sign up for deals, new products and{'\n'}promotions
          </p>
          
          {/* Email Input */}
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Email address"
              className="flex-grow p-3 rounded-l-md focus:outline-none text-black bg-white"
              // Remove any dynamic attributes added by extensions
              data-no-hydration="true"
            />
            <button 
              className="bg-white text-black px-5 rounded-r-md font-semibold"
              type="button" // Explicit button type
            >
              Signup
            </button>
          </div>
        </div>

        {/* Right Image - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center p-6 relative h-64">
          <Image
            src='/assets/newsletter2.jpg'
            alt="Golf Club"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}