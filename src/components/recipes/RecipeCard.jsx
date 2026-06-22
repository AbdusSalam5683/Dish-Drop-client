// dish-drop-client/src/components/recipes/RecipeCard.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

export default function RecipeCard({ recipe, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <Image
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/D85A30/FFFFFF?text=Recipe';
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold bg-[#D85A30] text-white rounded-full">
            {recipe.category}
          </span>
          {recipe.isFeatured && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-500 text-white rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs">
          ⏱ {recipe.preparationTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {recipe.cuisineType}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {recipe.difficultyLevel}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
          {recipe.recipeName}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          by {recipe.authorName}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              ❤️ {recipe.likesCount || 0}
            </span>
          </div>
          <Link
            href={`/recipe/${recipe._id}`}
            className="px-4 py-2 text-sm font-medium text-[#D85A30] hover:text-[#993C1D] border border-[#D85A30] rounded-lg hover:bg-[#D85A30]/5 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}