// Footer.jsx
'use client';
import React from 'react';
import { FaCcVisa, FaCcMastercard, FaCcApplePay, FaCcPaypal } from 'react-icons/fa';
import { SiAmericanexpress } from 'react-icons/si';
import Link from 'next/link';
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-white px-4 py-6 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Brand Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Зієgant.</h1>
          <p className="text-gray-400 text-lg">
            More than just a game.<br />
            It's a lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1   md:grid-cols-3 gap-20 mb-12">
          {/* Page Links */}
          <div className="">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Page</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  <li><Link href="/shop" className="text-gray-400 hover:text-white transition">Shop</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Product</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Articles</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Shipping Policy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Return & Refund</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Support</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Office Info */}
          <div className=''>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Office</h2>
            <address className="not-italic text-gray-400">
              <p className="mb-2">43111 Hal Trieu street,</p>
              <p className="mb-2">District 1, HCMC Vietnam</p>
              <p>84-756-3237</p>
            </address>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-gray-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              Copyright © {year} Зієgant. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition">Terms & Conditions</a>
            </div>

            <div className="flex justify-center mt-3 md:justify-start space-x-4">
              <FaCcVisa className="text-5xl" />
             <FaCcMastercard className="text-5xl" />
               <div className="h-10 w-auto mt-1  rounded-2xl"> {/* Container with fixed height */}
               <SiAmericanexpress className="h-full w-auto" /> {/* Icon fills container height */}
                   </div>
                  <FaCcApplePay className="text-5xl" />
                   <FaCcPaypal className="text-5xl" />
              </div>
        </div>
      </div>
          
      </div>
    </footer>
  );
};

export default Footer;