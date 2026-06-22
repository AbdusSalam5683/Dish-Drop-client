// dish-drop-client/src/components/home/PopularRecipes.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const mockPopularRecipes = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    likesCount: 156,
    authorName: 'Chef Maria',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    category: 'Dinner'
  },
  {
    id: '2',
    name: 'Chocolate Lava Cake',
    likesCount: 142,
    authorName: 'Chef James',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    category: 'Dessert'
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    likesCount: 128,
    authorName: 'Chef Sarah',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    category: 'Dinner'
  },
  {
    id: '4',
    name: 'Greek Salad',
    likesCount: 98,
    authorName: 'Chef Alex',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    category: 'Lunch'
  }
];

export default function PopularRecipes() {
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1,
    margin: "-50px" 
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
          {mockPopularRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
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
                  {recipe.name}
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
                    href={`/recipe/${recipe.id}`}
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