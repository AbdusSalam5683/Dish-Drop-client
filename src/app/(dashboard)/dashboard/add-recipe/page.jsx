// dish-drop-client/src/app/(dashboard)/dashboard/add-recipe/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // 👈 এই লাইন যোগ করুন
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegan', 'Snacks'];
const cuisines = ['American', 'Indian', 'Italian', 'French', 'Greek', 'Mediterranean', 'Asian', 'Mexican', 'Other'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

export default function AddRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipeName: '',
    recipeImage: '',
    category: '',
    cuisineType: '',
    difficultyLevel: '',
    preparationTime: '',
    ingredients: [''],
    instructions: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length <= 1) return;
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.recipeName || !formData.category || !formData.cuisineType) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check recipe limit for free users
    if (!user?.isPremium && user?.recipeCount >= 2) {
      toast.error('Free users can only add 2 recipes. Upgrade to premium for unlimited!');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement add recipe API
      // await api.post('/recipes', formData);
      toast.success('Recipe added successfully! 🎉');
      router.push('/dashboard/my-recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Add Recipe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share your culinary creation
        </p>
        {!user?.isPremium && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
            ⚠️ Free users can add up to 2 recipes.{' '}
            <Link href="/payment/premium" className="text-[#D85A30] hover:underline">
              Upgrade to Premium
            </Link>{' '}
            for unlimited recipes!
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recipe Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Name *
            </label>
            <input
              type="text"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            />
          </div>

          {/* Recipe Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              name="recipeImage"
              value={formData.recipeImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Cuisine Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cuisine Type *
            </label>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            >
              <option value="">Select Cuisine</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty Level *
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            >
              <option value="">Select Difficulty</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preparation Time *
            </label>
            <input
              type="text"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              placeholder="30 min"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ingredients *
          </label>
          {formData.ingredients.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, 'ingredients', e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayItem('ingredients', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('ingredients')}
            className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Instructions *
          </label>
          {formData.instructions.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayItem('instructions', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('instructions')}
            className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
          >
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}