// dish-drop-client/src/app/(dashboard)/dashboard/page.jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Please login to view dashboard</h2>
          <Link href="/login" className="mt-4 inline-block px-6 py-2 bg-[#D85A30] text-white rounded-lg">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your recipes
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Recipes', value: user?.recipeCount || 0, icon: '📝' },
            { label: 'Favorites', value: 0, icon: '❤️' },
            { label: 'Likes Received', value: user?.totalLikesReceived || 0, icon: '👍' },
            { label: 'Status', value: user?.isPremium ? '⭐ Premium' : 'Free', icon: user?.isPremium ? '⭐' : '🆓' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link href="/dashboard/add-recipe" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Add Recipe</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your culinary creation</p>
          </Link>
          
          <Link href="/dashboard/my-recipes" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">My Recipes</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your recipes</p>
          </Link>
          
          <Link href="/dashboard/favorites" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Favorites</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your saved recipes</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}