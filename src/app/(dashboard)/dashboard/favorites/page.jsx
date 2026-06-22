// dish-drop-client/src/app/(dashboard)/dashboard/favorites/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // TODO: Implement API to fetch favorites
        // const response = await api.get('/favorites');
        // setFavorites(response.data.favorites);
        setFavorites([]);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      // TODO: Implement remove favorite API
      // await api.delete(`/favorites/${recipeId}`);
      setFavorites(favorites.filter(f => f._id !== recipeId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ⭐ My Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your saved recipes
        </p>
      </div>

      {favorites.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-48">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(recipe._id)}
                  className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span className="text-xl">❤️</span>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {recipe.recipeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  by {recipe.authorName}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="flex-1 text-center px-3 py-1.5 text-sm text-[#D85A30] border border-[#D85A30] rounded-lg hover:bg-[#D85A30] hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}