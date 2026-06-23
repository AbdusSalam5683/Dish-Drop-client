'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegan', 'Snacks'];
const cuisines = ['American', 'Indian', 'Italian', 'French', 'Greek', 'Mediterranean', 'Asian', 'Mexican', 'Other'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

export default function EditRecipePage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
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

  // ==================== FETCH RECIPE ====================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          const recipe = data.recipe;
          setFormData({
            recipeName: recipe.recipeName,
            recipeImage: recipe.recipeImage,
            category: recipe.category,
            cuisineType: recipe.cuisineType,
            difficultyLevel: recipe.difficultyLevel,
            preparationTime: recipe.preparationTime,
            ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
            instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
          });
        } else {
          toast.error('Recipe not found');
          router.push('/dashboard/my-recipes');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('Failed to load recipe');
        router.push('/dashboard/my-recipes');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchRecipe();
    }
  }, [id, isAuthenticated, router]);

  // ==================== HANDLE CHANGE ====================
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

  // ==================== IMAGE UPLOAD ====================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://api.imgbb.com/1/upload?key=' + process.env.NEXT_PUBLIC_IMGBB_API_KEY, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, recipeImage: data.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredIngredients = formData.ingredients.filter(item => item.trim() !== '');
    const filteredInstructions = formData.instructions.filter(item => item.trim() !== '');

    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (filteredInstructions.length === 0) {
      toast.error('Please add at least one instruction step');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const recipeData = {
        ...formData,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      };

      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Recipe updated successfully! 🎉');
        router.push('/dashboard/my-recipes');
      } else {
        toast.error(data.message || 'Failed to update recipe');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading recipe...</p>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Edit Recipe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your recipe
        </p>
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
              placeholder="e.g., 30 min"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
              required
            />
          </div>

          {/* Recipe Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Image *
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                disabled={imageUploading}
              />
              {imageUploading && <p className="text-sm text-gray-500">Uploading...</p>}
              {formData.recipeImage && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={formData.recipeImage}
                    alt="Recipe"
                    fill
                    className="object-cover"
                    sizes="(max-width: 128px) 100vw"
                  />
                </div>
              )}
            </div>
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
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium min-w-[40px] text-center">
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
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
          disabled={submitting || imageUploading}
          className="mt-8 w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Updating...' : 'Update Recipe'}
        </button>
      </form>
    </div>
  );
}