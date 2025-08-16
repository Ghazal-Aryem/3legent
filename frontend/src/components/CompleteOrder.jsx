'use client';
import React from 'react';

const CompleteOrder = ({ setActiveTab }) => {
     const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div>Loading order confirmation...</div>;
    }
    return (
        <div className="w-full py-8 md:py-12 lg:py-16">
            <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg 
                        className="w-8 h-8 md:w-10 md:h-10 text-green-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Order Complete</h2>
                <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
                    Thank you for your purchase! Your order has been received.
                </p>
                
                <button 
                    onClick={() => setActiveTab('cart')}
                    className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm md:text-base"
                >
                    Back to Shopping
                </button>
            </div>
        </div>
    );
};

export default CompleteOrder;