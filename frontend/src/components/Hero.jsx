'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

{/* <Image 
  src="/assets/hero.jpg" 
  alt="Golf lifestyle" 
  layout="fill"
  objectFit="cover"
  className="opacity-70"
/> */}

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative w-full bg-black text-white" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero.jpg"
          alt="Golf lifestyle"
          fill
          className=" object-cover opacity-70"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            More than
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            just a game.
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            It's a <span className="text-gray-300">lifestyle</span>.
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto md:mx-0">
            Whether you're just starting out, have<br />
            played your whole life or you're a Tour<br />
            pro, your swing is like a fingerprint.
          </p>
          
          <button className="bg-white hover:bg-green-500 text-black font-semibold py-3 px-8 rounded-full transition-colors duration-300" onClick={()=>{
            router.push('/shop');
          }}>
            Shopping Now
          </button>
        </div>
      </div>
    </div>
  );
}