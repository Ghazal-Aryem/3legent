'use client';

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiperstyle.css';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('Black');
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`);

        // Check if response data exists and has the expected structure
        if (!response.data) {
          throw new Error('No data received from server');
        }

        // Handle different response formats
        if (response.data.status === 'success') {
          const imageMap = {
            "P1": '/assets/p1.png',
            "P2": '/assets/p2.jpg',
            "P3": '/assets/p3.png'
          };
          
          const productsWithImages = response.data.data.map(product => ({
            ...product,
            image: imageMap[product.image] || product.image,
            images: product.images?.map(img => ({
              ...img,
              url: imageMap[img.url] || img.url
            })) || [],
            // Ensure all required fields have defaults
            rating: product.rating || 0,
            price: product.price || 0,
            originalPrice: product.originalPrice || null,
            badge: product.badge || null,
            discount: product.discount || null
          }));
          
          setProducts(productsWithImages);
        } else if (Array.isArray(response.data)) {
          // Handle case where API returns array directly
          setProducts(response.data.map(p => ({
            ...p,
            rating: p.rating || 0,
            price: p.price || 0
          })));
        } else {
          throw new Error(response.data.message || 'Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to fetch products');
        setProducts([]); // Reset products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name || product.title || 'Unnamed Product',
      price: Number(product.price) || 0,
      quantity: 1,
      image: product.img || product.image || (product.images?.[0]?.url || ''),
      color: selectedColor
    };

    dispatch(addToCart(cartItem));
    console.log('Adding to cart:', cartItem);
    router.push(`/cartPageSys`);
  };

  if (loading) {
    return (
      <div className="py-9 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 w-64 h-80 animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-9 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-red-500 text-center py-8">
          Error loading products: {error}
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-9 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-gray-500 text-center py-8">No featured products available</div>
      </div>
    );
  }

  return (
    <section className="py-9 px-4 sm:px-6 lg:px-8 bg-white relative">
      <h2 className="text-3xl font-bold mb-8 text-black text-left px-1">Featured</h2>
      
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30
            }
          }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next'
          }}
          pagination={false}
          className="px-10"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-lg transition-all h-[350px] mx-2 group relative overflow-hidden">
                <div 
                  className="relative h-48 mb-4 cursor-pointer" 
                  onClick={() => router.push(`/product?id=${product.id}`)}
                >
                  <Image
                    src={product.image || '/assets/placeholder.jpg'}
                    alt={product.name || 'Product image'}
                    fill
                    className="h-full w-full object-contain group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 font-bold rounded">
                      {product.badge}
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 font-bold rounded">
                      {product.discount}
                    </span>
                  )}
                </div>
                
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <button 
                  className="absolute bottom-0 left-0 right-0 w-full bg-black text-white py-2 font-medium text-sm flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 mb-11 transition-transform duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  aria-label={`Add ${product.name || 'product'} to cart`}
                >
                  <FiShoppingCart className="text-white" />
                  <span>Add to cart</span>
                </button>
                
                <p className="text-sm text-gray-700 mb-5 mt-3 line-clamp-2">
                  {product.name || 'Unnamed Product'}
                </p>
                <div className="text-sm font-semibold text-black absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gray-200 rounded-b-lg">
                  ${(product.price || 0).toFixed(2)}
                  {product.originalPrice && (
                    <span className="line-through text-gray-500 text-xs ml-1">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="swiper-button-prev !left-0" aria-label="Previous slide"></button>
        <button className="swiper-button-next !right-0" aria-label="Next slide"></button>
      </div>
    </section>
  );
}