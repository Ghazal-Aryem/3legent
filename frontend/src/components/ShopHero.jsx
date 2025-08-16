'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import shophero from '../assets/shophero.jpg';

const ShopHero = () => {
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 relative">
        {/* Skeleton loader */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full h-96 bg-gray-100 relative">
        <div className="absolute inset-0">
          <Image
            src='/assets/shophero.jpg'
            alt="Shop background"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/0 via-gray-100/60 to-gray-100/20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
          <nav aria-label="Breadcrumb" className="flex justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Link href="/" className="text-zinc-600 text-sm font-medium hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <span className="text-zinc-600">/</span>
            </div>
            <div className="flex items-center">
              <span className="text-neutral-900 text-sm font-medium" aria-current="page">
                Shop
              </span>
            </div>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-medium text-black mb-4">Shop Page</h1>
          
          <p className="text-neutral-900 text-lg md:text-xl font-normal max-w-2xl">
            Let's design the place you always imagined.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;