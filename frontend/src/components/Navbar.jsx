'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { RiAccountCircleLine } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Link from 'next/link';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm font-Montserrat z-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4 relative">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-3xl font-bold text-gray-900 font-Playfair hover:text-[#2DC071] transition-colors duration-300"
        >
          3legant.
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2DC071] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/shop" 
            className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors duration-200 relative group"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2DC071] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/product" 
            className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors duration-200 relative group"
          >
            Product
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2DC071] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors duration-200 relative group"
          >
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2DC071] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Right Section (Icons + Mobile Button) */}
        <div className="flex items-center space-x-6">
          {/* Search Bar (Desktop) */}
          <div className="hidden md:block relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 px-4 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2DC071] focus:border-[#2DC071] transition-all duration-200 text-sm"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2DC071] transition-colors"
              >
                <FiSearch className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Search Icon (Mobile) */}
          <button 
            className="md:hidden text-gray-700 hover:text-[#2DC071] transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FiSearch className="w-5 h-5" />
          </button>

          {/* Account Button */}
          <Link 
            href="/signin"
            className="text-gray-700 hover:text-[#2DC071] transition-colors relative group"
          >
            <RiAccountCircleLine className="w-5 h-5" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">Account</span>
          </Link>
          
          <button 
            className="text-gray-700 hover:text-[#2DC071] transition-colors relative group"
            onClick={() => navigate('/cartPageSys')}
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">Cart</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 ml-2 hover:text-[#2DC071] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white px-6 py-3 shadow-sm border-t z-50">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2DC071] focus:border-[#2DC071] transition-all duration-200"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2DC071] transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white px-6 py-4 shadow-md border-t flex flex-col space-y-3 z-40">
            <Link 
              href="/" 
              className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/product" 
              className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Product
            </Link> 
            <Link 
              href="/contact" 
              className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              href="/signin" 
              className="text-gray-700 text-base font-medium hover:text-[#2DC071] transition-colors py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;