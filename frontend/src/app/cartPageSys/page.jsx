'use client';

import { useState, useEffect } from 'react';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import Complete from '@/components/CompleteOrder';
import { FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeFromCart, clearCart } from '@/store/cartSlice';
import { useRouter , useSearchParams  } from 'next/navigation';

const CartPageSystem = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('cart');
    const [shippingOption, setShippingOption] = useState('free');
    const [couponCode, setCouponCode] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsMounted(true);
        const cartItemParam = searchParams.get('cartItem');
        
        if (cartItemParam) {
            try {
                const cartItem = JSON.parse(decodeURIComponent(cartItemParam));
                dispatch(addToCart(cartItem));
                router.replace('/cartPageSys', undefined, { shallow: true });
            } catch (error) {
                console.error('Error parsing cart item:', error);
            }
        }
    }, [dispatch, router, searchParams])

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity) || 0;
            return total + (price * qty);
        }, 0);
    };
  
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        let shippingCost = 0;
        
        if (shippingOption === 'express') {
            shippingCost = 15.00;
        } else if (shippingOption === 'pickup') {
            shippingCost = 21.00;
        }
        
        return subtotal + shippingCost;
    };
  
    const handleUpdateQuantity = (id, color, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id, color, quantity: newQuantity }));
    };

    const handleRemoveItem = (id, color) => {
        dispatch(removeFromCart({ id, color }));
    };

    const applyCoupon = () => {
        alert(`Coupon code "${couponCode}" applied!`);
    };
  
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return;
        }
        setActiveTab('checkout');
    };
  
    const handleCompleteOrder = () => {
        setActiveTab('complete');
        dispatch(clearCart());
    };
     if (!isMounted) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className=" px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-10 md:py-20 bg-white flex flex-col justify-start items-center w-full ">
            <div className="flex flex-col justify-start items-center gap-8 md:gap-10 w-full">
                <h1 className="text-black text-3xl sm:text-4xl md:text-5xl font-medium  leading-[58px]">
                    {activeTab === 'cart' ? 'Cart' : 
                     activeTab === 'checkout' ? 'Checkout' : 'Order Complete'}
                </h1>
                
                {/* Navigation Tabs */}
                <div className="flex justify-start items-start gap-2 sm:gap-4 md:gap-8 w-full overflow-x-auto pb-4">
                    <button 
                        onClick={() => setActiveTab('cart')}
                        className={`min-w-[120px] sm:min-w-40 pb-4 sm:pb-6 ${activeTab === 'cart' ? 'border-b-2 border-neutral-900' : ''} flex flex-col justify-start items-start gap-4 sm:gap-6`}
                    >
                        <div className="flex justify-start items-center gap-2 sm:gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${['checkout', 'complete'].includes(activeTab) ? 'bg-green-500 ' : activeTab === 'cart' ? 'bg-zinc-800' : 'bg-gray-400'}`}>
                                {['checkout', 'complete'].includes(activeTab) ? (
                                    <FaCheck className="text-white text-sm" />
                                ) : (
                                    <span className="text-center text-gray-50 text-base font-semibold  leading-relaxed">1</span>
                                )}
                            </div>
                            <div className={`text-base font-semibold leading-relaxed ${activeTab === 'cart' ? 'text-zinc-800' : ['checkout', 'complete'].includes(activeTab) ? 'text-green-500' : 'text-gray-400'}`}>
                                Shopping cart
                            </div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => cartItems.length > 0 && setActiveTab('checkout')}
                        disabled={cartItems.length === 0 || activeTab === 'complete'}
                        className={`min-w-[120px] sm:min-w-40 pb-4 sm:pb-6 ${activeTab === 'checkout' ? 'border-b-2 border-neutral-900' : ''} flex flex-col justify-start items-start gap-4 sm:gap-6 ${(cartItems.length === 0 || activeTab === 'complete') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex justify-start items-center gap-2 sm:gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${activeTab === 'complete' ? 'bg-green-500' : activeTab === 'checkout' ? 'bg-zinc-800' : 'bg-gray-400'}`}>
                                {activeTab === 'complete' ? (
                                    <FaCheck className="text-white text-sm" />
                                ) : (
                                    <span className="text-center text-gray-50 text-base font-semibold  leading-normal">2</span>
                                )}
                            </div>
                            <div className={`text-base font-semibold leading-relaxed ${activeTab === 'checkout' ? 'text-zinc-800' : activeTab === 'complete' ? 'text-green-500' : 'text-gray-400'}`}>
                                Checkout details
                            </div>
                        </div>
                    </button>
                    
                    <button 
                        disabled={activeTab !== 'complete'}
                        className={`min-w-[120px] sm:min-w-40 pb-4 sm:pb-6 ${activeTab === 'complete' ? 'border-b-2 border-neutral-900' : ''} flex flex-col justify-start items-start gap-4 sm:gap-6 ${activeTab !== 'complete' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex justify-start items-center gap-2 sm:gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${activeTab === 'complete' ? 'bg-zinc-800' : 'bg-gray-400'}`}>
                                <span className="text-center text-gray-50 text-base font-semibold  leading-relaxed">3</span>
                            </div>
                            <div className={`text-base font-semibold leading-relaxed ${activeTab === 'complete' ? 'text-zinc-800' : 'text-gray-400'}`}>
                                Order complete
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Render Active Tab */}
            {activeTab === 'cart' && (
                <Cart
                    cartItems={cartItems}
                    updateQuantity={handleUpdateQuantity}
                    removeItem={handleRemoveItem}
                    shippingOption={shippingOption}
                    setShippingOption={setShippingOption}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    applyCoupon={applyCoupon}
                    handleCheckout={handleCheckout}
                />
            )}
            
            {activeTab === 'checkout' && (
                <Checkout
                    cartItems={cartItems}
                    shippingOption={shippingOption}
                    calculateSubtotal={calculateSubtotal}
                    calculateTotal={calculateTotal}
                    handleCompleteOrder={handleCompleteOrder}
                />
            )}
            
            {activeTab === 'complete' && (
                <Complete setActiveTab={setActiveTab} />
            )}
        </div>
    );
};

export default CartPageSystem;