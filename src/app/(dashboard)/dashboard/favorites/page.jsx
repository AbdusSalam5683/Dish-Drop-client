'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [favoriteToRemove, setFavoriteToRemove] = useState(null);

  // ==================== FETCH FAVORITES ====================
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        } else {
          toast.error(data.message || 'Failed to load favorites');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==================== OPEN REMOVE MODAL ====================
  const openRemoveModal = (favorite) => {
    setFavoriteToRemove(favorite);
    setShowRemoveModal(true);
  };

  // ==================== CLOSE REMOVE MODAL ====================
  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setFavoriteToRemove(null);
  };

  // ==================== CONFIRM REMOVE ====================
  const confirmRemove = async () => {
    if (!favoriteToRemove) return;

    setRemovingId(favoriteToRemove._id);
    try {
      const token = localStorage.getItem('token');
      const recipeId = favoriteToRemove.recipeId._id;
      
      const response = await fetch(`http://localhost:5000/api/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setFavorites(favorites.filter(f => f._id !== favoriteToRemove._id));
        toast.success('Removed from favorites');
        closeRemoveModal();
      } else {
        toast.error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================
  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start saving your favorite recipes!
        </p>
        <Link
          href="/browse-recipes"
          className="mt-4 inline-block px-6 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors"
        >
          Browse Recipes
        </Link>
      </motion.div>
    );
  }

  // ==================== FAVORITES GRID ====================
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ⭐ My Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {favorites.length} saved recipes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite, index) => {
          const recipe = favorite.recipeId;
          if (!recipe) return null;

          return (
            <motion.div
              key={favorite._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                  {recipe.category}
                </span>
                {/* Heart overlay */}
                <button
                  onClick={() => openRemoveModal(favorite)}
                  className="absolute top-3 left-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <span className="text-xl">❤️</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                  {recipe.recipeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {recipe.cuisineType} • {recipe.preparationTime}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  by {recipe.authorName}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="flex-1 text-center px-3 py-1.5 text-sm text-[#D85A30] border border-[#D85A30] rounded-lg hover:bg-[#D85A30] hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => openRemoveModal(favorite)}
                    disabled={removingId === favorite._id}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {removingId === favorite._id ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== REMOVE CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {showRemoveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              {/* Icon */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-3xl">
                  ❤️
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                Remove from Favorites?
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {favoriteToRemove?.recipeId?.recipeName}
                </span>
                {' '}from your favorites?
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeRemoveModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}