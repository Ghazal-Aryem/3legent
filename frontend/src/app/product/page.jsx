'use client';
import React from 'react'
import ProductDetails from '@/components/ProductDetails.jsx'
import NavBar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Newslettter from '@/components/Newsletter.jsx'
import CustomerRview from '@/components/CustomerReview.jsx'


export default function ProductPage() {

  return (
    <div className='product'>
      <NavBar />
      <ProductDetails/>
      <CustomerRview  /> 
      <Newslettter />
      <Footer />
    </div>
  )
}


