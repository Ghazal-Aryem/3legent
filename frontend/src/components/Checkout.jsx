'use client';
import React from 'react';
import { selectCurrentUser } from '../store/profileSlice';
import { useSelector } from 'react-redux';
import Image from 'next/image';
const Checkout = ({ cartItems, shippingOption, calculateSubtotal, calculateTotal, handleCompleteOrder }) => {
     const [isMounted, setIsMounted] = React.useState(false);
    const currentUser = useSelector(selectCurrentUser);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div>Loading checkout...</div>;
    }

    if (!currentUser) {
        return (
            <div className="w-full flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">Please Sign In to Checkout</h1>
                <a href="/signin" className="text-blue-500 underline ml-2">Sign In</a>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Checkout Form - Mobile First */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">
                        <h3 className="text-xl font-medium mb-4">Shipping Information</h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={currentUser?.name}
                                readOnly={!!currentUser.name}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            <input 
                                type="text" 
                                placeholder="Address" 
                                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            <input 
                                type="text" 
                                placeholder="City" 
                                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="State/Province" 
                                    className="p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Postal Code" 
                                    className="p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-medium mb-4">Payment Method</h3>
                        <div className="space-y-4">
                            <div className="border rounded p-4">
                                <label className="flex items-center gap-3 mb-3">
                                    <input type="radio" name="payment" className="w-5 h-5" defaultChecked />
                                    <span className="font-medium">Credit Card</span>
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder="Card Number" 
                                        className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Name on Card" 
                                        className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Expiration Date" 
                                            className="p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="CVV" 
                                            className="p-3 border rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary - Mobile Optimized */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm sticky top-4">
                        <h3 className="text-xl font-medium mb-4">Order Summary</h3>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                                    <div className="flex items-center gap-3">
                                         <Image 
                                           src={item.image} 
                                           alt={item.name}
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 object-cover rounded"
                                            />
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-3 pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {shippingOption === 'free' ? '$0.00' : 
                                     shippingOption === 'express' ? '$15.00' : '$21.00'}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleCompleteOrder}
                            className="w-full mt-6 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            Complete Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;