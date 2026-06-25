// dish-drop-client/src/app/(dashboard)/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalPremium: 0,
    totalReports: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
        
        // Fetch recent activity (last 5 users)
        const usersResponse = await api.get('/admin/users');
        if (usersResponse.data.success) {
          setRecentActivity(usersResponse.data.users.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500/10 text-blue-500',
      link: '/admin/manage-users',
      change: '+12%'
    },
    {
      label: 'Total Recipes',
      value: stats.totalRecipes,
      icon: '📝',
      color: 'bg-green-500/10 text-green-500',
      link: '/admin/manage-recipes',
      change: '+8%'
    },
    {
      label: 'Premium Members',
      value: stats.totalPremium,
      icon: '⭐',
      color: 'bg-yellow-500/10 text-yellow-500',
      link: '/admin/manage-users',
      change: '+5%'
    },
    {
      label: 'Pending Reports',
      value: stats.totalReports,
      icon: '🚩',
      color: 'bg-red-500/10 text-red-500',
      link: '/admin/reports',
      change: stats.totalReports > 0 ? '⚠️ Action needed' : '✅ All clear'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Admin Profile */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            👨‍💼 Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-2xl overflow-hidden ring-2 ring-[#D85A30]/20">
            {user?.image ? (
              <Image src={user.image} alt={user.name} width={48} height={48} className="object-cover" />
            ) : (
              <span>{user?.name?.[0] || 'A'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <Link href={stat.link} className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className={`text-xs mt-1 ${
                      stat.change.includes('+') ? 'text-green-500' : 
                      stat.change.includes('⚠️') ? 'text-yellow-500' : 
                      stat.change.includes('✅') ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            👥 Recent Users
          </h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((u) => (
                <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-sm">
                    {u.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    u.isPremium ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.isPremium ? '⭐ Premium' : 'Free'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent users</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            ⚡ Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/manage-users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Manage Users</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View, block, or unblock users</p>
              </div>
              <span className="ml-auto text-[#D85A30]">→</span>
            </Link>
            <Link
              href="/admin/manage-recipes"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">📝</span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Manage Recipes</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View, delete, or feature recipes</p>
              </div>
              <span className="ml-auto text-[#D85A30]">→</span>
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">🚩</span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Reports</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Review and manage reports</p>
              </div>
              <span className="ml-auto text-[#D85A30]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}