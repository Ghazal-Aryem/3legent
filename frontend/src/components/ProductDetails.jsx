'use client';
import { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronDown, FiMinus, FiPlus, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../styles/swiperstyle.css'
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { auth } from '@/lib/firebase';

const ProductDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [uid, setUid] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  // Image mapping configuration
  const imageMap = {
    "P1": '/assets/p1.png',
    "P2": '/assets/p2.jpg',
    "P3": '/assets/p3.png',
    "default": '/assets/default-product.png'
  };

  // Fetch product data
  useEffect(() => {
    const fetchProductById = async () => {
      if (!id) {
        console.error("Product ID is not available");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/${id}`
        );
        
        if (response.data?.product) {
          const productData = response.data.product;
          
          // Process images with fallback
          const processedImages = productData.images?.map(img => ({
            ...img,
            url: imageMap[img.url] || img.url || imageMap.default
          })) || [{ url: imageMap.default }];
          
          // Process reviews
          const processedReviews = productData.review?.map(review => ({
            ...review,
            date: review.date ? new Date(review.date).toLocaleDateString() : 'N/A'
          })) || [];
          
          setProduct({
            ...productData,
            images: processedImages,
            review: processedReviews,
            selectedColor: productData.color?.[0]?.name || 'Black'
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Set default product data if fetch fails
        setProduct({
          id,
          name: "Product Not Found",
          images: [{ url: imageMap.default }],
          price: 0,
          description: "This product could not be loaded.",
          color: [{ name: 'Black' }],
          selectedColor: 'Black'
        });
      }
    };
    
    fetchProductById();
  }, [id]);

  // Initialize user and fetch wishlist
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        await fetchWishlist(user.uid);
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
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Quantity handlers
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Color selection
  const handleColorSelect = (colorName) => {
    setProduct(prev => prev ? {
      ...prev,
      selectedColor: colorName
    } : null);
  };

  const handleAddToCart = () => {
  if (!product) return;
  
  // Create a unique key for the cart item
  const uniqueKey = `${product.id}-${product.selectedColor}-${Date.now()}`;
  
  const cartItem = {
    id: product.id,
    key: uniqueKey,  // Add unique key to the cart item
    name: product.name,
    color: product.selectedColor,
    price: Number(product.price),
    quantity: quantity,
    image: product.images[0]?.url || imageMap.default,
    description: product.description
  };
  
  dispatch(addToCart(cartItem));
  router.push('/cartPageSys');
};
  // Wishlist functions
  const isInWishlist = () => {
    return wishlist.some(item => item.product_id === id);
  };

  const toggleWishlist = async () => {
    if (!uid) {
      router.push('/signin');
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      if (isInWishlist()) {
        await removeFromWishlist(token);
      } else {
        await addToWishlist(token);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const addToWishlist = async (token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${uid}`,
        { product_id: id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setWishlist(prev => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (token) => {
    try {
      const item = wishlist.find(item => item.product_id === id);
      if (!item) return;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${uid}/${item.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setWishlist(prev => prev.filter(item => item.product_id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Color display helper
  const getColorClass = (colorName) => {
    const colorMap = {
      'black': 'bg-black',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'white': 'bg-white border',
      'gray': 'bg-gray-400',
      'default': 'bg-gray-200'
    };
    return colorMap[colorName?.toLowerCase()] || colorMap['default'];
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-6 flex-wrap gap-1">
        <span className="hover:text-gray-700 cursor-pointer">Home</span>
        <FiChevronRight className="mx-1" />
        <span className="hover:text-gray-700 cursor-pointer">Shop</span>
        <FiChevronRight className="mx-1" />
        <span className="hover:text-gray-700 cursor-pointer">{product.category || 'Category'}</span>
        <FiChevronRight className="mx-1" />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Section */}
        <div className="w-full lg:w-1/2">
          <div className="mb-4 relative">
            {/* Labels */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.badge && (
                <span className="bg-white px-3 py-1 text-lg font-bold rounded">NEW</span>
              )}
              {product.discount && (
                <span className="bg-emerald-400 text-white px-3 py-1 text-lg font-bold rounded">
                  {product.discount}
                </span>
              )}
            </div>

            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="h-100 w-full bg-gray-100 rounded-lg mt-10"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={`main-${image.id || index}`}>
                  <div className="relative w-full h-96">
                    <Image 
                      src={image.url} 
                      alt={`Product ${image.id || index}`} 
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Swiper */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[Thumbs]}
            className="h-24"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={`thumb-${image.id || index}`}>
                <div className="relative w-full h-full">
                  <Image 
                    src={image.url} 
                    alt={`Thumbnail ${image.id || index}`} 
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-1/2">
          {/* Rating and Title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600">{product.reviewCount || 0} Reviews</span>
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-500">
              {product.description || 'No description available'}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 my-6">
            <span className="text-3xl font-medium text-gray-900">
              ${Number(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {product.discount && (
            <div className="border-t border-b border-gray-200 py-6 my-6">
              <div className="mb-6">
                <h3 className="text-gray-700 mb-3">Offer expires in:</h3>
                <div className="grid grid-cols-4 gap-4">
                  {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                    <div key={unit} className="text-center">
                      <div className="bg-gray-100 rounded-lg p-3 mb-1">
                        <span className="text-3xl font-medium">
                          {timeLeft[unit].toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.color?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-1 mb-3">
                <h3 className="text-gray-500 font-semibold">Choose Color</h3>
                <FiChevronDown className="text-gray-500" />
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg">{product.selectedColor}</span>
                <FiChevronRight className="text-gray-500" />
              </div>
              <div className="flex gap-4 mt-2">
                {product.color.map((colorObj, index) => (
                  <div 
                    key={`color-${colorObj.name}-${index}`}
                    onClick={() => handleColorSelect(colorObj.name)}
                    className={`w-8 h-8 rounded-full ${getColorClass(colorObj.name)} cursor-pointer border-2 ${
                      colorObj.name === product.selectedColor ? 'border-black' : 'border-transparent'
                    }`}
                    title={colorObj.name}
                    aria-label={`Select ${colorObj.name} color`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Buttons */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={decreaseQuantity} 
                  className="px-4 py-4 bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className="px-6 py-3 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={increaseQuantity} 
                  className="px-4 py-4 bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                onClick={toggleWishlist}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-6 py-3 text-sm font-medium transition ${
                  isInWishlist()  
                    ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-neutral-900 border-gray-200 hover:bg-gray-50'
                }`}
                aria-label={isInWishlist() ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart className={isInWishlist() ? 'fill-current' : ''} />
                <span>{isInWishlist() ? 'In Wishlist' : 'Wishlist'}</span>
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg px-6 py-3 hover:bg-gray-800 transition"
              aria-label="Add to cart"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Product Meta */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">SKU</span>
              <span className="text-xs text-gray-900">{product.sku || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">CATEGORY</span>
              <span className="text-xs text-gray-900">{product.category || 'Uncategorized'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;