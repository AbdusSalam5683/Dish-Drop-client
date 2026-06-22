// dish-drop-client/src/app/(dashboard)/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAdminGuard } from '@/middleware/adminGuard';
import { motion } from 'motion/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminOverview() {
  const { user, loading: authLoading } = useAdminGuard();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalPremium: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500/10 text-blue-500',
      link: '/admin/manage-users'
    },
    {
      label: 'Total Recipes',
      value: stats.totalRecipes,
      icon: '📝',
      color: 'bg-green-500/10 text-green-500',
      link: '/admin/manage-recipes'
    },
    {
      label: 'Premium Members',
      value: stats.totalPremium,
      icon: '⭐',
      color: 'bg-yellow-500/10 text-yellow-500',
      link: '/admin/manage-users'
    },
    {
      label: 'Pending Reports',
      value: stats.totalReports,
      icon: '🚩',
      color: 'bg-red-500/10 text-red-500',
      link: '/admin/reports'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          👨‍💼 Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}!
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
                    {stat.value}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/manage-users"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Manage Users</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View, block, or unblock users
          </p>
        </Link>

        <Link
          href="/admin/manage-recipes"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Manage Recipes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View, delete, or feature recipes
          </p>
        </Link>

        <Link
          href="/admin/reports"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🚩</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and manage reports
          </p>
        </Link>
      </div>
    </div>
  );
}