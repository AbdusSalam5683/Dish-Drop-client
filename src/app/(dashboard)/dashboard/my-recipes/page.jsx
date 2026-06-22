// dish-drop-client/src/app/(dashboard)/dashboard/my-recipes/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        // TODO: Implement API to fetch user's recipes
        // const response = await api.get('/recipes/my-recipes');
        // setRecipes(response.data.recipes);
        setRecipes([]);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      // TODO: Implement delete API
      // await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter(r => r._id !== id));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your recipes...</p>
      </div>
    );
  }

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

      {recipes.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
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
                {recipe.isFeatured && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs rounded-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {recipe.recipeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {recipe.category} • {recipe.preparationTime}
                </p>
                <div className="flex items-center gap-2 mt-3">
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
                    onClick={() => handleDelete(recipe._id)}
                    className="flex-1 px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}