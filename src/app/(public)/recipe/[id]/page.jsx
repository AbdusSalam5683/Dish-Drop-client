'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { recipeAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // ==================== FETCH RECIPE DETAILS ====================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await recipeAPI.getById(id);
        setRecipe(response.data.recipe);
        setLikes(response.data.recipe.likesCount || 0);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('Recipe not found');
        router.push('/browse-recipes');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, router]);

  // ==================== CHECK FAVORITE STATUS ====================
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/favorites/${id}/check`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    checkFavorite();
  }, [id, isAuthenticated]);

  // ==================== HANDLE LIKE ====================
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recipes/${id}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsLiked(data.isLiked);
        setLikes(data.likesCount);
        toast.success(data.message);
        window.dispatchEvent(new Event('likesUpdated'));
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      toast.error('Failed to like recipe');
    }
  };

  // ==================== HANDLE FAVORITE ====================
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/favorites/${id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites! ⭐');
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  // ==================== HANDLE REPORT ====================
  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipeId: id,
          reason: reportReason
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Report submitted successfully');
        setShowReportModal(false);
        setReportReason('');
      } else {
        toast.error(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error reporting recipe:', error);
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== HANDLE PURCHASE ====================
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase recipes');
      router.push('/login');
      return;
    }

    setPurchasing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/create-recipe-checkout/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error purchasing recipe:', error);
      toast.error('Failed to process purchase');
    } finally {
      setPurchasing(false);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recipe not found</h2>
          <Link href="/browse-recipes" className="mt-4 inline-block text-[#D85A30] hover:text-[#993C1D]">
            ← Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/browse-recipes"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#D85A30] transition-colors mb-6"
        >
          ← Back to recipes
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Recipe Image */}
          <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700">
            <Image
              src={recipe.recipeImage}
              alt={recipe.recipeName}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x600/D85A30/FFFFFF?text=Recipe';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Badges */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#D85A30] text-white text-sm font-semibold rounded-lg">
                {recipe.category}
              </span>
              <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold rounded-lg">
                {recipe.cuisineType}
              </span>
              <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold rounded-lg">
                {recipe.difficultyLevel}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title & Author */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {recipe.recipeName}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span>by</span>
                <Link
                  href={`/profile/${recipe.authorId?._id}`}
                  className="text-[#D85A30] hover:text-[#993C1D] font-medium"
                >
                  {recipe.authorName}
                </Link>
                {recipe.authorId?.isPremium && (
                  <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">⭐ Premium</span>
                )}
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>⏱</span> {recipe.preparationTime}
                </span>
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>❤️</span> {likes} likes
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-500/10 text-red-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  title="Like"
                >
                  <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                </button>

                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  title="Add to favorites"
                >
                  <span className="text-xl">{isFavorite ? '⭐' : '☆'}</span>
                </button>

                {/* Report Button */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Report"
                >
                  <span className="text-xl">🚩</span>
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                🛒 Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-[#D85A30] font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                👨‍🍳 Instructions
              </h3>
              <ol className="space-y-3 list-decimal list-inside">
                {recipe.instructions?.map((step, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Purchase Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full py-3 bg-gradient-to-r from-[#D85A30] to-[#993C1D] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                '💳 Purchase Recipe - $2.99'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🚩 Report Recipe
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Why are you reporting this recipe?
            </p>

            <div className="space-y-2 mb-6">
              {['Spam', 'Offensive Content', 'Copyright Issue', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-4 h-4 text-[#D85A30] focus:ring-[#D85A30]"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={submitting || !reportReason}
                className="flex-1 px-4 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}