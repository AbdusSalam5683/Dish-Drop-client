// dish-drop-client/src/components/home/PopularRecipes.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { recipeAPI } from '@/lib/api';

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1,
    margin: "-50px" 
  });

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await recipeAPI.getPopular();
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching popular recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🔥 Popular Recipes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            🔥 Popular Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Most loved recipes by our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/D85A30/FFFFFF?text=Food';
                  }}
                />
                <div className="absolute top-3 right-3 bg-[#D85A30] text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                  {recipe.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                  {recipe.recipeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  by {recipe.authorName}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D85A30]">
                    <span>❤️</span>
                    <span className="font-semibold">{recipe.likesCount}</span>
                    <span className="text-gray-400 text-sm">likes</span>
                  </div>
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="text-[#D85A30] hover:text-[#993C1D] font-medium text-sm transition-colors"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/browse-recipes"
            className="inline-block px-8 py-3 bg-[#D85A30] text-white font-semibold rounded-xl hover:bg-[#993C1D] transition-colors shadow-lg"
          >
            View All Recipes
          </Link>
        </div>
      </div>
    </section>
  );
}