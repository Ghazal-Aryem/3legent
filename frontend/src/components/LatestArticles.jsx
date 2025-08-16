'use client';
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function LatestArticles() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const articles = [
    {
      title: "Air Jordan x Travis Scott Event",
      link: "#",
      image: '/assets/art1.jpg'
    },
    {
      title: "The timeless classics on the green",
      link: "#",
      image: '/assets/art2.jpg'
    },
    {
      title: "The 2023 Ryder Cup",
      link: "#",
      image: '/assets/art3.jpg'
    }
  ];

  if (!isMounted) {
    return (
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b pb-6 md:border-b-0 md:pb-0">
                <div className="mb-4 h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-3/4 bg-gray-200 mb-4 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with View More link */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-black">Latest Articles</h2>
          <Link 
            href="#" 
            className="text-black hover:text-gray-600 font-medium flex items-center gap-1 transition-colors"
            prefetch={false}
          >
            View More
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={index} className="border-b pb-6 md:border-b-0 md:pb-0 group">
              <div className="mb-4 h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index < 2} // Prioritize first two images
                />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">{article.title}</h3>
              <Link 
                href={article.link} 
                className="text-black hover:text-gray-600 font-medium flex items-center gap-1 transition-colors"
                prefetch={false}
              >
                Read More 
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}