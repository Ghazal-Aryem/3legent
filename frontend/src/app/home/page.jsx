'use client';
import React, {useEffect} from 'react';
import NavBar from '@/components/Navbar.jsx';
import BAnner from '@/components/Banner.jsx';
import Hero from '@/components/Hero.jsx';
import Features from '@/components/FeatureProduct.jsx';
import Categories from '@/components/CategoryGrid.jsx';
import LimitedEdition from '@/components/LimitedEdition.jsx';
import ShopCollection from '@/components/ShopCollection.jsx';
import LatestArticals from '@/components/LatestArticles.jsx';
import NewsLatter from '@/components/Newsletter.jsx';
import InstagramSec from '@/components/Instagramsection.jsx';
import Footer from '@/components/Footer.jsx';


function page() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="Home">
      <BAnner />
      <NavBar />
      <Hero/>
      <Features/>
      <Categories/>
      <LimitedEdition/>
      <ShopCollection/> {/* Corrected the component name */}
      <LatestArticals/>
      <NewsLatter/>
      <InstagramSec/>
      <Footer/>
    </div>
  );
}

export default page;