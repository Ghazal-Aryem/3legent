'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import Link from 'next/link';
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Image mapping configuration
  const imageMap = {
    "P1": '/assets/p1.png',
    "P2": '/assets/p2.jpg',
    "P3": '/assets/p3.png'
  };

  // Initialize user and fetch wishlist
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        await fetchWishlist(user.uid);
      } else {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, []);

  // Generate a unique key for color buttons
  // const getColorButtonKey = (itemId, color, viewType) => {
  //   // Use color.id if available, otherwise create a hash from color name
  //   const colorId = color.id || `${color.name.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
  //   return `color-${viewType}-${itemId}-${colorId}`;
  // };

  // Fetch wishlist with product details
  const fetchWishlist = async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      
    
      const wishlistResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (wishlistResponse.data.status === 'success') {
        const wishlistItems = wishlistResponse.data.data;
        
        
        const productsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`,
          { 
            params: { 
              ids: wishlistItems.map(item => item.product_id).join(',') 
            }
          }
        );

        if (productsResponse.data.status === 'success') {
          // 3. Merge wishlist items with product data
          const mergedItems = wishlistItems.map(wishlistItem => {
            const product = productsResponse.data.data.find(
              p => p.id === wishlistItem.product_id
            );
            
            if (!product) return null;

            return {
              ...wishlistItem, 
              ...product,     
              image: imageMap[product.image] || product.image,
              images: product.images?.map(img => ({
                ...img,
                url: imageMap[img.url] || img.url
              })) || [],
              selectedColor: product.color?.[0]?.name || 'Black'
            };
          }).filter(Boolean); // Remove any null items

          setWishlistItems(mergedItems);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${uid}/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Add to cart
  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.product_id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      color: product.selectedColor || (product.color?.[0]?.name || 'Black')
    };
    
    dispatch(addToCart(cartItem));
    router.push('/cartPageSys');
  };

  // Handle color change
  const handleColorChange = (itemId, colorName) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selectedColor: colorName } 
          : item
      )
    );
  };

  // Get selected color
  const getSelectedColor = (item) => {
    return item.selectedColor || (item.color?.[0]?.name || 'Black');
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading wishlist...</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      
      {wishlistItems.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Your wishlist is empty</p>
          <button 
            onClick={() => router.push('/shop')}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Browse Products
          </button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left"></th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wishlistItems.map(item => (
              <tr key={`wishlist-${item.id}`} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    <FiX size={20} />
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <Link 
                        href={`/product?id=${item.id}`} 
                        >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-contain"
                      />
                      </Link>
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">
                          Color: {getSelectedColor(item)}
                        </p>
                        {item.color && item.color.length > 1 && (
                          <div className="flex gap-2 mt-1">
                            {item.color.map((color, index) => (
                              <button
                                key={`color-desktop-${item.id}-${index}`}
                                onClick={() => handleColorChange(item.id, color.name)}
                                className={`w-4 h-4 rounded-full border ${
                                  getSelectedColor(item) === color.name 
                                    ? 'border-black' 
                                    : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color.name.toLowerCase() }}
                                title={color.name}
                                aria-label={`Select ${color.name} color`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium">${item.price?.toFixed(2)}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                  >
                    <FiShoppingCart />
                    <span>Add to cart</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {wishlistItems.map(item => (
          <div key={`wishlist-mobile-${item.id}`} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 flex-1">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Color: {getSelectedColor(item)}
                  </p>
                  <div className="mt-2 font-medium">${item.price?.toFixed(2)}</div>
                </div>
              </div>
              <button 
                onClick={() => removeFromWishlist(item.id)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {item.color && item.color.length > 1 && (
              <div className="flex gap-2 mt-3">
                {item.color.map((color, index) => (
                  <button
                    key={`color-mobile-${item.id}-${index}`}
                    onClick={() => handleColorChange(item.id, color.name)}
                    className={`w-6 h-6 rounded-full border ${
                      getSelectedColor(item) === color.name 
                        ? 'border-black' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.name.toLowerCase() }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            )}
            
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              <FiShoppingCart />
              <span>Add to cart</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;