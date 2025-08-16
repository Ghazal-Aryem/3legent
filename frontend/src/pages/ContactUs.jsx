import React, { useState } from 'react';
import { FiChevronRight, FiMapPin, FiPhone, FiMail, FiTruck, FiDollarSign, FiCreditCard, FiHeadphones , FiSearch  ,FiHeart ,FiShoppingCart} from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import shophero from '../assets/shophero.jpg';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar/>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-21">
        <div className="flex items-center text-sm">
          <span className="text-zinc-600">Home</span>
          <FiChevronRight className="mx-2 text-zinc-600" />
          <span className="text-neutral-900">Contact Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
          <h1 className="text-neutral-900 text-4xl md:text-5xl font-medium font-['Poppins'] leading-tight mb-6">
            We believe in sustainable decor. We're passionate about life at home.
          </h1>
          <p className="text-neutral-900 text-base font-normal leading-relaxed">
            Our features timeless furniture, with natural fabrics, curved lines, plenty of mirrors and classic design, 
            which can be incorporated into any decor project. The pieces enchant for their sobriety, to last for generations, 
            faithful to the shapes of each period, with a touch of the present.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img 
              src={shophero}
              alt="About Us" 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="lg:w-1/2 bg-gray-100 p-12 rounded-lg flex flex-col justify-center">
            <h2 className="text-neutral-900 text-4xl font-medium font-['Poppins'] mb-6">About Us</h2>
            <p className="text-neutral-900 text-base font-normal leading-relaxed mb-8">
              3legant is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
              <br />
              Our customer service is always prepared to support you 24/7.
            </p>
            <a href="/shop" className="flex items-center gap-2 text-neutral-900 text-base font-medium border-b border-neutral-900 pb-1 w-max">
              Shop Now
              <FiChevronRight />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-neutral-900 text-4xl font-medium font-['Poppins'] text-center mb-12">Contact Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Address Card */}
          <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <FiMapPin className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-zinc-500 text-base font-bold uppercase mb-2">Address</h3>
            <p className="text-neutral-900 text-base font-semibold leading-relaxed">
              234 Hai Trieu, Ho Chi Minh City,<br />
              Viet Nam
            </p>
          </div>
          
          {/* Contact Card */}
          <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <FiPhone className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-zinc-500 text-base font-bold uppercase mb-2">Contact Us</h3>
            <p className="text-neutral-900 text-base font-semibold leading-relaxed">
              +84 234 567 890
            </p>
          </div>
          
          {/* Email Card */}
          <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <FiMail className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-zinc-500 text-base font-bold uppercase mb-2">Email</h3>
            <p className="text-neutral-900 text-base font-semibold leading-relaxed">
              hello@3legant.com
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-zinc-500 text-xs font-bold uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-zinc-500 text-xs font-bold uppercase mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-zinc-500 text-xs font-bold uppercase mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  className="w-full px-4 py-3 bg-white rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="px-10 py-3 bg-neutral-900 text-white text-base font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                disabled={!formData.name || !formData.email || !formData.message}
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Google Map */}
          <div className="lg:w-1/2 h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.126365068485!2d106.7042763152608!3d10.8018262617351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528a459cb43ab%3A0x6c3d29d370b52a7e!2sHai%20Ba%20Trung%20Street%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Shipping */}
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiTruck className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-neutral-900 text-xl font-medium mb-2">Free Shipping</h3>
            <p className="text-zinc-500 text-sm font-normal">Order above $200</p>
          </div>
          
          {/* Money-back */}
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiDollarSign className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-neutral-900 text-xl font-medium mb-2">Money-back</h3>
            <p className="text-zinc-500 text-sm font-normal">30 days guarantee</p>
          </div>
          
          {/* Secure Payments */}
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiCreditCard className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-neutral-900 text-xl font-medium mb-2">Secure Payments</h3>
            <p className="text-zinc-500 text-sm font-normal">Secured by Stripe</p>
          </div>
          
          {/* 24/7 Support */}
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiHeadphones className="text-neutral-900 text-xl" />
            </div>
            <h3 className="text-neutral-900 text-xl font-medium mb-2">24/7 Support</h3>
            <p className="text-zinc-500 text-sm font-normal">Phone and Email support</p>
          </div>
        </div>
      </section>

      {/* Footer
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-zinc-500">
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-white text-2xl font-medium">3legant</span>
                <span className="text-zinc-500 text-2xl font-medium">.</span>
              </div>
              <div className="h-6 w-px bg-zinc-500"></div>
              <p className="text-gray-200 text-sm font-normal">Gift & Decoration Store</p>
            </div>
            
            <div className="flex gap-8">
              {['Home', 'Shop', 'Product', 'Blog', 'Contact Us'].map((item) => (
                <a key={item} href="#" className="text-white text-sm font-normal hover:text-gray-300 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-6 mb-4 md:mb-0">
              <p className="text-gray-200 text-xs font-normal">Copyright © 2023 3legant. All rights reserved</p>
              <a href="#" className="text-white text-xs font-semibold hover:underline">Privacy Policy</a>
              <a href="#" className="text-white text-xs font-semibold hover:underline">Terms of Use</a>
            </div>
            
            <div className="flex gap-6">
              <a href="#" aria-label="Facebook">
                <FaFacebook className="text-white text-xl hover:text-gray-300 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter className="text-white text-xl hover:text-gray-300 transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className="text-white text-xl hover:text-gray-300 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
};

export default ContactUs;