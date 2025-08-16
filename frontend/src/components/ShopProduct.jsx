'use client';
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { FiChevronDown, FiHeart, FiGrid, FiList } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { auth } from '@/lib/firebase';


const ShopProduct = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All Categories');
  const [selectedPrice, setSelectedPrice] = useState('All Price');
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [selectedColor, setSelectedColor] = useState('Black');
  const productsPerLoad = 3;
  const router = useRouter();
  const dispatch = useDispatch();
  const [uid, setUid] = useState(null);
  
 
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`
        );
        if (response.data.status === 'success') {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory !== 'All Categories') {
      router.replace(`?category=${selectedCategory}`);
    } else {
      router.replace('');
    }
  }, [selectedCategory, router]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`
        );
        
        if (response.data.status === 'success') {
          const imageMap = {
            "P1": '/assets/p1.png', // Ensure the path is correct
            "P2": '/assets/p2.jpg',
            "P3": '/assets/p3.png'
          };

          const productsWithImages = response.data.data.map(product => ({
            ...product,
            image: imageMap[product.image] || product.image,
            images: product.images?.map(img => ({
              ...img,
              url: imageMap[img.url] || img.url
            })) || []
          }));
          
          setProducts(productsWithImages);
        } else {
          console.error('Failed to fetch products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  useEffect(() => {
    setVisibleProducts(6); // Reset to initial number when filters change
  }, [selectedCategory, selectedPrice, sortBy]);

  // Initialize user and fetch wishlist
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is authenticated:', user.uid);
        setUid(user.uid);
        fetchWishlist(user.uid);
      } else {
        setUid(null);
        setWishlist([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch wishlist from API
  const fetchWishlist = async (userId) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const sortProducts = (products) => {
    switch(sortBy) {
      case 'newest': return [...products].sort((a, b) => b.id - a.id);
      case 'price-low': return [...products].sort((a, b) => a.price - b.price);
      case 'price-high': return [...products].sort((a, b) => b.price - a.price);
      case 'rating': return [...products].sort((a, b) => b.rating - a.rating);
      default: return products;
    }
  };
   
  const filteredProducts = products.filter(product => {
    const Productcategory = categories.find(cat => cat.id === product.category_id)?.name;
    const categoryMatch = selectedCategory === 'All Categories' || Productcategory === selectedCategory;
    
    let priceMatch = true;
    if (selectedPrice !== 'All Price') {
      if (selectedPrice === 'Under $50') {
        priceMatch = product.price < 50;
      } else if (selectedPrice === '$50 - $100') {
        priceMatch = product.price >= 50 && product.price <= 100;
      } else if (selectedPrice === 'Over $100') {
        priceMatch = product.price > 100;
      }
    }
    
    return categoryMatch && priceMatch;
  });

  const handleAddToCart = (product) => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name || product.title,
      price: Number(product.price),
      quantity: 1,
      image: product.image || (product.images?.[0]?.url || ''),
      color: selectedColor
    };
    
    dispatch(addToCart(cartItem));
    router.push('/cartPageSys');
  };

  
  // Wishlist functions
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!uid) {
      router.push('/signin');
      return;
    }

    try {
      const token = localStorage.getItem('firebaseIdToken') || sessionStorage.getItem('firebaseIdToken');
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id, token);
      } else {
        await addToWishlist(product, token);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const addToWishlist = async (product, token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${uid}`,
        { product_id: product.id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setWishlist(prev => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId, token) => {
    try {
      const item = wishlist.find(item => item.product_id === productId);
      if (!item) return;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${uid}/${item.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setWishlist(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // const getColorClass = (colorName) => {
  //   const colorMap = {
  //     'black': 'bg-black',
  //     'blue': 'bg-blue-500',
  //     'green': 'bg-green-500',
  //     'white': 'bg-white border',
  //     'gray': 'bg-gray-400',
  //     'default': 'bg-gray-200'
  //   };
  //   return colorMap[colorName.toLowerCase()] || colorMap['default'];
  // };
  // UI helpers
  const sortedProducts = sortProducts(filteredProducts);
  const displayedProducts = sortedProducts.slice(0, visibleProducts);
  const handleShowMore = () => setVisibleProducts(prev => prev + productsPerLoad);
  const handleShowLess = () => setVisibleProducts(6);
  const shouldShowMore = sortedProducts.length > 6 && visibleProducts < sortedProducts.length;
  const shouldShowLess = visibleProducts > 9;
  const handleColorSelect = (colorName) => setSelectedColor(colorName);
  if (loading) return <div className="flex justify-center items-center h-64">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 cursor-pointer mt-21">
      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <label className="block text-zinc-500 text-sm font-semibold mb-1">CATEGORIES</label>
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-lg border-2 border-zinc-500 appearance-none bg-white text-neutral-900 font-semibold"
              >
                <option value="All Categories">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-zinc-500" />
            </div>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-zinc-500 text-sm font-semibold mb-1">PRICE</label>
            <div className="relative">
              <select 
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  setVisibleProducts(6);
                }}
                className="w-full pl-4 pr-10 py-2 rounded-lg border-2 border-zinc-500 appearance-none bg-white text-neutral-900 font-semibold"
              >
                <option value="All Price">All Price</option>
                <option value="Under $50">Under $50</option>
                <option value="$50 - $100">$50 - $100</option>
                <option value="Over $100">Over $100</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-zinc-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-neutral-900 font-semibold">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-2 pr-8 py-1 border border-neutral-900 rounded bg-white appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              aria-label="Grid view"
            >
              <FiGrid className={viewMode === 'grid' ? 'text-neutral-900' : 'text-zinc-500'} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
              aria-label="List view"
            >
              <FiList className={viewMode === 'list' ? 'text-neutral-900' : 'text-zinc-500'} />
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No products found matching the selected filters.
        </div>
      )}

      {/* Products Grid */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 mb-10`}>
        {displayedProducts.map(product => (
          <div 
            key={product.id} 
            className={`flex ${viewMode === 'list' ? 'flex-row h-80' : 'flex-col h-full'} bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
          >
            {/* Product Image */}
            <Link 
              href={`/product?id=${product.id}`} 
              className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full h-64'}`}
              passHref
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                className="w-full h-full object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-white px-3 py-1 text-xs font-bold rounded uppercase">
                    {product.badge}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-emerald-400 text-white px-3 py-1 text-xs font-bold rounded uppercase">
                    {product.discount}
                  </span>
                )}
              </div>
            </Link>

            {/* Product Info */}
            <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'} flex flex-col h-full`}>
              <div className="flex-grow">
                <div className="flex items-center gap-1 ">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 ">
                  <span className="text-sm font-semibold text-neutral-900 mb-1">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500  line-clamp-3">{product.description}</p>
              </div>
              
              {/* Buttons Container */}
              <div className="mt-1">
                <div className="flex flex-col gap-2">
                  <button 
                    className="w-full py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to cart
                  </button>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`w-full py-2.5 flex items-center justify-center gap-1 text-sm font-medium border rounded-lg transition ${
                      isInWishlist(product.id) 
                        ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-neutral-900 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Buttons */}
      <div className="mt-10 mb-2 text-center">
        {shouldShowMore && (
          <button
            onClick={handleShowMore}
            className="px-10 py-2.5 rounded-full border border-neutral-900 hover:bg-neutral-100 transition-colors mx-2"
          >
            <span className="text-neutral-900 text-base font-medium">
              Show more
            </span>
          </button>
        )}
        {shouldShowLess && (
          <button
            onClick={handleShowLess}
            className="px-10 py-2.5 rounded-full border border-neutral-900 hover:bg-neutral-100 transition-colors mx-2"
          >
            <span className="text-neutral-900 text-base font-medium">
              Show less
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopProduct;