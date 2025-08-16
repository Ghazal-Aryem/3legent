'use client';
import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const ReviewForm = ({ 
  newReview, 
  setNewReview, 
  setShowReviewForm, 
  setReviews 
}) => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const RatingStars = ({ rating, interactive = false, onRate }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate(star)}
            disabled={!interactive || isSubmitting}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-400 text-2xl" />
            ) : (
              <FaRegStar className="text-yellow-400 text-2xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newReview.rating === 0 || newReview.content.trim() === '') {
      setError('Please provide both a rating and review content');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("sessionStorage:", sessionStorage.getItem('firebaseIdToken'));
      console.log("localStorage:", localStorage.getItem('firebaseIdToken'));
      const token = localStorage.getItem('firebaseIdToken') || sessionStorage.getItem('firebaseIdToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `http://127.0.0.1:5000/api/product/${productId}/review`,
        {
          rating: newReview.rating,
          content: newReview.content
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        const newReviewData = response.data.data;
        
        // Format the new review to match your frontend structure
        const formattedReview = {
          id: newReviewData.id,
          name: newReviewData.user_name || "You",
          rating: newReviewData.rating,
          date: "just now",
          content: newReviewData.content,
          likes: newReviewData.likes || 0,
          liked: newReviewData.liked || false,
          avatar: newReviewData.avatar || "https://placehold.co/72x72"
        };

        setReviews(prev => [formattedReview, ...prev]);
        setNewReview({ rating: 0, content: '' });
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Your Rating *</label>
          <RatingStars 
            rating={newReview.rating} 
            interactive={true} 
            onRate={(rating) => setNewReview({...newReview, rating})}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Your Review *</label>
          <textarea 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            rows="4"
            value={newReview.content}
            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
            placeholder="Share your thoughts about this product..."
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <button 
            type="button"
            className="px-6 py-2 border border-gray-800 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            onClick={() => setShowReviewForm(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || newReview.rating === 0 || newReview.content.trim() === ''}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Review'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;