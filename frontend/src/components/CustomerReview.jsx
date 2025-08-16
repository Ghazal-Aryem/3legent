'use client';
import { useState, useEffect } from 'react';
import { FiChevronDown, FiMessageSquare, FiShare2, FiThumbsUp } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import AdditionalInfoTab from './AdditionalInfoTab';
import ReviewForm from './ReviewForm';
import Image from 'next/image';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function CustomerReview() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  // State management
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [newReview, setNewReview] = useState({ rating: 0, content: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [productData, setProductData] = useState({
    name: "",
    rating: 0,
    specs: []
  });

  // Fetch reviews and product data
  useEffect(() => {
    if (!productId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch product details
        const productResponse = await axios.get(`http://127.0.0.1:5000/api/product/${productId}`);
        setProductData({
          name: productResponse.data.name,
          rating: productResponse.data.averageRating || 0,
          specs: productResponse.data.specs || []
        });
        
        // Fetch reviews
        const reviewsResponse = await axios.get(
          `http://127.0.0.1:5000/api/product/${productId}/review`
        );
        
        if (reviewsResponse.data.status === 'success') {
          // Transform API data to match our frontend structure
          const formattedReviews = reviewsResponse.data.data.map(review => ({
            id: review.id,
            name: review.user_name,
            rating: review.rating,
            date: new Date(review.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            content: review.content,
            likes: review.likes || 0,
            liked: review.liked || false,
            avatar: review.avatar
          }));
          
          setReviews(formattedReviews);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch reviews');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Review handlers
  const handleLikeReview = async (reviewId) => {
    try {
      // Find the review to update
      const reviewToUpdate = reviews.find(r => r.id === reviewId);
      if (!reviewToUpdate) return;
      
      // Optimistic UI update
      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            likes: review.liked ? review.likes - 1 : review.likes + 1,
            liked: !review.liked
          };
        }
        return review;
      }));
      
      // API call to update like status
      await axios.patch(
        `http://127.0.0.1:5000/api/product/${productId}/review/${reviewId}`,
        { liked: !reviewToUpdate.liked }
      );
    } catch (err) {
      console.error('Error updating like:', err);
      // Revert optimistic update if API call fails
      setReviews(reviews);
    }
  };

  // Sort reviews
  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedReviews = [...reviews];
    
    switch(option) {
      case 'newest':
        sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    setReviews(sortedReviews);
  };

  // Review content with see more/less
  const renderReviewContent = (review) => {
    const isExpanded = expandedReviews[review.id] || false;
    const showSeeMore = review.content.length > 100 && !isExpanded;
    
    return (
      <>
        <p className="text-gray-700 mb-1">
          {isExpanded ? review.content : `${review.content.substring(0, 100)}${showSeeMore ? '...' : ''}`}
        </p>
        {showSeeMore && (
          <button 
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setExpandedReviews({...expandedReviews, [review.id]: true})}
          >
            See more
          </button>
        )}
        {isExpanded && review.content.length > 100 && (
          <button 
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setExpandedReviews({...expandedReviews, [review.id]: false})}
          >
            See less
          </button>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button 
          className={`px-4 py-3 font-medium ${activeTab === 'additional-info' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('additional-info')}
        >
          Additional Info
        </button>
        
        <button 
          className={`px-4 py-3 font-medium ${activeTab === 'reviews' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'additional-info' && <AdditionalInfoTab specs={productData.specs} />}
      
      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Customer Reviews</h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= productData.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-yellow-400" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {productData.rating.toFixed(1)} ({reviews.length} Reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-600 hidden md:block">|</span>
                <span className="text-sm font-medium text-gray-700">{productData.name}</span>
              </div>
              
              <div className="relative w-full md:w-48">
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                <FiChevronDown className="absolute right-3 top-2.5 text-gray-500" />
              </div>
            </div>

            {!showReviewForm ? (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-8">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500">Share your thoughts</p>
                  <button 
                    className="px-6 py-2 bg-gray-900 text-white rounded-full flex items-center gap-2 hover:bg-gray-800 transition"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <FiMessageSquare />
                    <span>Write Review</span>
                  </button>
                </div>
              </div>
            ) : (
              <ReviewForm 
                productId={productId}
                newReview={newReview}
                setNewReview={setNewReview}
                setShowReviewForm={setShowReviewForm}
                setReviews={setReviews}
              />
            )}
          </div>

          <div className="space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-200">
                  <div className="flex gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={review.avatar} 
                        alt={review.name} 
                        width={72}
                        height={72}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>
                                {star <= review.rating ? (
                                  <FaStar className="text-yellow-400" />
                                ) : (
                                  <FaRegStar className="text-yellow-400" />
                                )}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      
                      {renderReviewContent(review)}
                      
                      <div className="flex items-center gap-4 text-sm mt-4">
                        <button 
                          className={`flex items-center gap-1 ${review.liked ? 'text-blue-500' : 'text-gray-600'} hover:text-gray-900`}
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <FiThumbsUp className={review.liked ? 'fill-current' : ''} />
                          <span>Like ({review.likes})</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                          <FiMessageSquare />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                          <FiShare2 />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          {reviews.length > 5 && (
            <div className="mt-8 text-center">
              <button className="px-8 py-2 border border-gray-800 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
                Load more reviews
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}