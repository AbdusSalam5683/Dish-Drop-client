// dish-drop-client/src/app/(dashboard)/admin/manage-recipes/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ManageRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/admin/recipes');
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await api.delete(`/admin/recipes/${id}`);
      setRecipes(recipes.filter(r => r._id !== id));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      const response = await api.put(`/admin/recipes/${id}/feature`, {
        featured: !currentStatus
      });
      
      setRecipes(recipes.map(r => 
        r._id === id ? { ...r, isFeatured: !currentStatus } : r
      ));
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update recipe');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading recipes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          📝 Manage Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View, delete, or feature recipes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recipes.map((recipe, index) => (
                <motion.tr
                  key={recipe._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={recipe.recipeImage}
                          alt={recipe.recipeName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {recipe.recipeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {recipe.authorName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {recipe.category}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(recipe._id, recipe.isFeatured)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        recipe.isFeatured
                          ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {recipe.isFeatured ? '⭐ Featured' : 'Feature'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/recipe/${recipe._id}`}
                        className="px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}