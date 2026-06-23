'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function MyRecipesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // ==================== DELETE MODAL STATE ====================
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // ==================== FETCH MY RECIPES ====================
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/recipes/my-recipes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setRecipes(data.recipes);
        } else {
          toast.error(data.message || 'Failed to load recipes');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMyRecipes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==================== OPEN DELETE MODAL ====================
  const openDeleteModal = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  // ==================== CLOSE DELETE MODAL ====================
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  // ==================== CONFIRM DELETE ====================
  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    setDeleteLoading(recipeToDelete._id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setRecipes(recipes.filter(r => r._id !== recipeToDelete._id));
        toast.success('Recipe deleted successfully');
        closeDeleteModal();
      } else {
        toast.error(data.message || 'Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your recipes...</p>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================
  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No recipes yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start sharing your culinary creations!
        </p>
        <Link
          href="/dashboard/add-recipe"
          className="mt-4 inline-block px-6 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors"
        >
          Add Your First Recipe
        </Link>
      </motion.div>
    );
  }

  // ==================== RECIPES GRID ====================
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your recipes
          </p>
        </div>
        <Link
          href="/dashboard/add-recipe"
          className="px-4 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors"
        >
          + Add Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
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
              {recipe.isFeatured && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs rounded-lg">
                  ⭐ Featured
                </span>
              )}
              <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                {recipe.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                {recipe.recipeName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {recipe.cuisineType} • {recipe.preparationTime}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href={`/recipe/${recipe._id}`}
                  className="flex-1 text-center px-3 py-1.5 text-sm text-[#D85A30] border border-[#D85A30] rounded-lg hover:bg-[#D85A30] hover:text-white transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/edit-recipe/${recipe._id}`}
                  className="flex-1 text-center px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => openDeleteModal(recipe)}
                  disabled={deleteLoading === recipe._id}
                  className="flex-1 px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === recipe._id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {showDeleteModal && (
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
                  🗑️
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                Delete Recipe?
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {recipeToDelete?.recipeName}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}