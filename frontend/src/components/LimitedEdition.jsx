'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LimitedEdition() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 5
  });

  useEffect(() => {
    setIsMounted(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) return { ...prevTime, seconds: seconds - 1 };
        if (minutes > 0) return { ...prevTime, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prevTime, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prevTime, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-black text-white py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-800 rounded"></div>
            <div className="h-12 w-64 bg-gray-800 rounded"></div>
            <div className="h-6 w-80 bg-gray-800 rounded"></div>
            <div className="h-4 w-40 bg-gray-800 rounded"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-16 bg-gray-800 rounded-sm"></div>
              ))}
            </div>
            <div className="h-12 w-40 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image Column */}
        <div className="relative h-96 lg:h-full rounded-lg overflow-hidden">
          <Image
            src='/assets/LimitedEdition.jpg'
            alt="Limited edition golf clubs"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        
        {/* Content Column */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl font-light tracking-widest mb-4">
            LIMITED EDITION
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold mb-6">
            Hurry up! <span className="text-green-500">30% OFF</span>
          </h3>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
            Find clubs that are right for your game
          </p>
          <p className="text-lg text-gray-400 mb-5">
            Offer expires in:
          </p>
          
          {/* Countdown Timer */}
          <div className="flex justify-center lg:justify-start gap-4 mb-10">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-white text-stone-950 rounded-sm p-2 min-w-[72px]">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400 capitalize mt-1">
                  {unit}
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            href="/shop" 
            className="inline-block bg-green-500 hover:bg-white text-black font-bold py-3 px-10 rounded-full text-lg transition-colors duration-300"
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
}