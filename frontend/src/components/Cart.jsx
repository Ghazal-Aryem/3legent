'use client';
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';

const Cart = ({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  shippingOption, 
  setShippingOption, 
  couponCode, 
  setCouponCode, 
  applyCoupon, 
  handleCheckout 
}) => {
  
  const [isMounted, setIsMounted] = React.useState(false);

  const calculateSubtotal = React.useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return total + (price * qty);
    }, 0);
  }, [cartItems]);

  const calculateTotal = React.useCallback(() => {
    const subtotal = calculateSubtotal();
    let shippingCost = 0;
    
    if (shippingOption === 'express') {
      shippingCost = 15.00;
    } else if (shippingOption === 'pickup') {
      shippingCost = 21.00;
    }
    
    return subtotal + shippingCost;
  }, [calculateSubtotal, shippingOption]);

 
  React.useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleDecrease = (item) => {
    updateQuantity(item.id, item.color, item.quantity - 1);
  };
  
  const handleIncrease = (item) => {
    updateQuantity(item.id, item.color, item.quantity + 1);
  };
  
  const handleRemove = (item) => {
    removeItem(item.id, item.color);
  };

  if (!isMounted) {
    return <div className="p-4">Loading cart...</div>;
  }
  return (
    <div className="flex flex-col justify-start items-start px-4 sm:px-0">
      <div className="py-10 lg:py-20 inline-flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-16 w-full">
        {/* Cart items list */}
        <div className="w-full lg:w-[643px] inline-flex flex-col justify-start items-start w-full">
          <div className="w-full pb-4 lg:pb-6 border-b border-zinc-500 inline-flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0">
            <div className="justify-start text-neutral-900 text-base font-semibold  leading-relaxed">Product</div>
            <div className="w-full lg:w-80 flex justify-between items-center">
              <div className="justify-start text-neutral-900 text-base font-semibold  leading-relaxed">Quantity</div>
              <div className="justify-start text-neutral-900 text-base font-semibold leading-relaxed">Price</div>
              <div className="justify-start text-neutral-900 text-base font-semibold  leading-relaxed">Subtotal</div>
            </div>
          </div>
          
          {cartItems.map((item) => (
            <div key={item.id} className="w-full lg:w-[643px] py-6 border-b border-gray-200 inline-flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
              {/* Item details */}
              <div className="inline-flex flex-col justify-start items-start gap-2.5">
                <div className="w-80 inline-flex justify-start items-center gap-4">
                  <div className="w-20 h-24 relative overflow-hidden">
                    <Image 
                        src={item.image} 
                        alt={item.name}
                        width={80}  // matches w-20 (20 * 4 = 80)
                        height={96} // matches h-24 (24 * 4 = 96)
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <div className="flex-1 flex justify-start items-start gap-4">
                    <div className="w-52 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch justify-start text-neutral-900 text-sm font-semibold  leading-snug">{item.name}</div>
                      <div className="justify-start text-zinc-500 text-xs font-normal  leading-tight">Color: {item.color}</div>
                      <button 
                        onClick={() => handleRemove(item)}
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                        <span className="text-sm font-semibold  leading-snug">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quantity and price */}
              <div className="w-80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
                <div className="w-20 h-8 px-2 py-3 rounded outline outline-1 outline-offset-[-1px] outline-zinc-500 inline-flex flex-col justify-center items-center gap-2.5">
                  <div className="self-stretch h-5 relative flex items-center justify-between">
                    <button 
                      onClick={() => handleDecrease(item)}
                      className="w-4 h-4 flex items-center justify-center"
                    >
                      <div className="w-2.5 h-0 outline outline-[0.75px] outline-offset-[-0.38px] outline-neutral-900" />
                    </button>
                    <div className="text-center justify-start text-neutral-900 text-xs font-semibold  leading-tight">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => handleIncrease(item)}
                      className="w-4 h-4 flex items-center justify-center"
                    >
                      <div className="w-2.5 h-0 outline outline-[0.75px] outline-offset-[-0.38px] outline-neutral-900" />
                      <div className="w-0 h-2.5 outline outline-[0.75px] outline-offset-[-0.38px] outline-neutral-900 absolute" />
                    </button>
                  </div>
                </div>
                <div className="text-right justify-start text-neutral-900 text-lg font-normal  leading-loose">
  ${(parseFloat(item.price) || 0).toFixed(2)}
</div>
<div className="text-right justify-start text-neutral-900 text-lg font-semibold  leading-loose">
  ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cart summary */}
        <div className="w-full lg:w-96 p-4 lg:p-6 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-500 inline-flex flex-col justify-start items-start gap-4 mt-4 lg:mt-0">
          <div className="self-stretch justify-start text-neutral-900 text-xl font-medium  leading-7">Cart summary</div>
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch pb-6 lg:pb-8 flex flex-col justify-start items-start">
              {/* Shipping options */}
              <div className="self-stretch pb-3 lg:pb-4 flex flex-col justify-start items-start gap-3">
                <button 
                  onClick={() => setShippingOption('free')}
                  className={`w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] ${shippingOption === 'free' ? 'bg-gray-100 outline-neutral-900' : 'bg-white outline-zinc-500'}`}
                >
                  <div className="flex-1 h-6 relative flex justify-between items-center">
                    <div className="inline-flex justify-start items-center gap-3">
                      <div className={`w-4 h-4 relative rounded-[100px] outline outline-1 outline-offset-[-0.50px] outline-neutral-900 ${shippingOption === 'free' ? 'bg-neutral-900' : ''}`}>
                        {shippingOption === 'free' && <div className="w-2.5 h-2.5 left-[3px] top-[3px] absolute bg-white rounded-full" />}
                      </div>
                      <div className="justify-start text-neutral-900 text-base font-normal leading-relaxed">Free shipping</div>
                    </div>
                    <div className="text-right justify-start text-neutral-900 text-base font-normal leading-relaxed">$0.00</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShippingOption('express')}
                  className={`w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] ${shippingOption === 'express' ? 'bg-gray-100 outline-neutral-900' : 'bg-white outline-zinc-500'}`}
                >
                  <div className="flex-1 h-6 relative flex justify-between items-center">
                    <div className="inline-flex justify-start items-center gap-3">
                      <div className={`w-4 h-4 relative rounded-[100px] outline outline-1 outline-offset-[-0.50px] outline-neutral-900 ${shippingOption === 'express' ? 'bg-neutral-900' : ''}`}>
                        {shippingOption === 'express' && <div className="w-2.5 h-2.5 left-[3px] top-[3px] absolute bg-white rounded-full" />}
                      </div>
                      <div className="justify-start text-neutral-900 text-base font-normal  leading-relaxed">Express shipping</div>
                    </div>
                    <div className="text-right justify-start text-neutral-900 text-base font-normal leading-relaxed">+$15.00</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShippingOption('pickup')}
                  className={`w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] ${shippingOption === 'pickup' ? 'bg-gray-100 outline-neutral-900' : 'bg-white outline-zinc-500'}`}
                >
                  <div className="flex-1 h-6 relative flex justify-between items-center">
                    <div className="inline-flex justify-start items-center gap-3">
                      <div className={`w-4 h-4 relative rounded-[100px] outline outline-1 outline-offset-[-0.50px] outline-neutral-900 ${shippingOption === 'pickup' ? 'bg-neutral-900' : ''}`}>
                        {shippingOption === 'pickup' && <div className="w-2.5 h-2.5 left-[3px] top-[3px] absolute bg-white rounded-full" />}
                      </div>
                      <div className="justify-start text-neutral-900 text-base font-normal  leading-relaxed">Pick Up</div>
                    </div>
                    <div className="text-right justify-start text-neutral-900 text-base font-normal  leading-relaxed">+$21.00</div>
                  </div>
                </button>
              </div>
              
              {/* Order summary */}
              <div className="self-stretch py-3 border-b border-gray-200 flex flex-col justify-start items-start">
                <div className="self-stretch inline-flex justify-between items-start">
                  <div className="justify-start text-neutral-900 text-base font-normal leading-relaxed">Subtotal</div>
                  <div className="text-right justify-start text-neutral-900 text-base font-semibold leading-relaxed">
                    ${calculateSubtotal().toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="self-stretch py-3 flex flex-col justify-start items-start">
                <div className="self-stretch inline-flex justify-between items-start">
                  <div className="justify-start text-neutral-900 text-xl font-semibold leading-loose">Total</div>
                  <div className="text-right justify-start text-neutral-900 text-xl font-semibold leading-loose">
                    ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Checkout button */}
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full px-6 py-2.5 rounded-lg inline-flex justify-center items-center gap-2 ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-neutral-900 hover:bg-neutral-800 transition-colors'}`}
            >
              <div className="text-center justify-start text-white text-lg font-medium leading-loose">Checkout</div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Coupon code section */}
      <div className="w-full lg:w-96 flex flex-col justify-start items-start gap-4 mt-8 lg:mt-0">
        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
          <div className="self-stretch justify-start text-neutral-900 text-xl font-medium leading-7">Have a coupon?</div>
          <div className="self-stretch justify-start text-zinc-500 text-base font-normal leading-relaxed">Add your code for an instant cart discount</div>
        </div>
        <div className="w-full h-12 px-4 outline outline-1 outline-offset-[-0.50px] outline-zinc-500 flex flex-col justify-center items-start gap-2">
          <div className="self-stretch h-12 border-b border-zinc-500/50 inline-flex justify-between items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="w-6 h-6 relative">
                <div className="w-5 h-4 left-[2px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-500" />
              </div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                className="flex-1 justify-start text-zinc-500 text-base font-medium leading-7 bg-transparent outline-none"
              />
            </div>
            <button 
              onClick={applyCoupon}
              className="border-neutral-900 flex justify-start items-center gap-0.5 hover:opacity-70"
            >
              <div className="flex justify-start items-center gap-1">
                <div className="justify-start text-neutral-900 text-base font-medium leading-7">Apply</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;