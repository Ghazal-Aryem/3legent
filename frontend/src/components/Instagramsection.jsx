'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";

export default function InstagramSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="max-w-full mx-auto bg-white rounded-lg overflow-hidden shadow-md px-2">
        <div className="py-12 px-4 justify-center items-center text-center">
          <div className="h-4 bg-gray-200 w-24 mx-auto mb-2"></div>
          <div className="h-8 bg-gray-200 w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 w-32 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-100 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg overflow-hidden shadow-md px-2">
      {/* Header Section */}
      <div className="py-12 px-4 justify-center items-center text-center">
        <h3 className="text-gray-500 text-sm mb-2 tracking-widest">NEWSFEED</h3>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Instagram</h1>
        <p className="text-gray-500 mb-4 md:whitespace-pre-line">
          Follow us on social media for more discount &{'\n'}promotions
        </p>
        <p className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
          @3legant_official
        </p>
      </div>

      {/* Image Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-100 gap-0.5">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="relative aspect-square">
            <Image
              src={`/assets/insta${num}.jpg`}
              alt={`Instagram post ${num}`}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
              sizes="(max-width: 640px) 50vw, 25vw"
              priority={num <= 2} // Prioritize loading first two images
            />
          </div>
        ))}
      </div>
    </div>
  );
}