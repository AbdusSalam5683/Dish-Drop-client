// dish-drop-client/src/components/home/FeaturedRecipes.jsx
'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

// Temporary mock data - will be replaced with API data
const mockFeaturedRecipes = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    category: 'Lunch',
    cuisine: 'American',
    preparationTime: '30 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    category: 'Dinner',
    cuisine: 'Indian',
    preparationTime: '45 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
  },
  {
    id: '3',
    name: 'Italian Pizza',
    category: 'Dinner',
    cuisine: 'Italian',
    preparationTime: '25 min',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
];

export default function FeaturedRecipes() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Featured Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our hand-picked selection of amazing recipes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockFeaturedRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-[#D85A30]/10 text-[#D85A30] rounded-full">
                    {recipe.category}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {recipe.cuisine}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {recipe.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ⏱ {recipe.preparationTime}
                  </span>
                  <Link
                    href={`/recipe/${recipe.id}`}
                    className="text-[#D85A30] hover:text-[#993C1D] font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}