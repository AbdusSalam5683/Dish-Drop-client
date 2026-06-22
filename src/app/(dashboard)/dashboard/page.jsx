// dish-drop-client/src/app/(dashboard)/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    totalPurchased: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Implement stats API
        setStats({
          totalRecipes: user?.recipeCount || 0,
          totalFavorites: 0,
          totalLikesReceived: user?.totalLikesReceived || 0,
          totalPurchased: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      label: 'Total Recipes',
      value: stats.totalRecipes,
      icon: '📝',
      color: 'bg-blue-500/10 text-blue-500',
      link: '/dashboard/my-recipes',
    },
    {
      label: 'Favorites',
      value: stats.totalFavorites,
      icon: '⭐',
      color: 'bg-yellow-500/10 text-yellow-500',
      link: '/dashboard/favorites',
    },
    {
      label: 'Likes Received',
      value: stats.totalLikesReceived,
      icon: '❤️',
      color: 'bg-red-500/10 text-red-500',
      link: '#',
    },
    {
      label: 'Purchased',
      value: stats.totalPurchased,
      icon: '🛒',
      color: 'bg-green-500/10 text-green-500',
      link: '/dashboard/purchased',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}! 👋
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <Link href={stat.link} className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Premium Banner */}
      {!user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#D85A30] to-[#993C1D] rounded-xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">🚀 Upgrade to Premium</h3>
              <p className="text-white/80 text-sm mt-1">
                Unlock unlimited recipes, premium badge, and more features!
              </p>
            </div>
            <Link
              href="/payment/premium"
              className="px-6 py-2 bg-white text-[#D85A30] font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Get Premium
            </Link>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/dashboard/add-recipe"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">➕</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Add Recipe</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Share your culinary creation
          </p>
        </Link>

        <Link
          href="/dashboard/my-recipes"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">My Recipes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your recipes
          </p>
        </Link>

        <Link
          href="/dashboard/favorites"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Favorites</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your saved recipes
          </p>
        </Link>
      </div>
    </div>
  );
}