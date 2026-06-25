'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function DashboardPage() {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    totalPurchased: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // ==================== FETCH STATS ====================
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Fetching stats...');
      
      const response = await fetch('http://localhost:5000/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('📥 Stats response:', data);
      
      if (data.success) {
        setStats(data.stats);
        console.log('✅ Stats loaded:', data.stats);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ==================== CHECK PREMIUM STATUS ====================
  const checkPremiumStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/premium-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsPremium(data.isPremium);
        console.log('⭐ Premium status:', data.isPremium);
      }
    } catch (error) {
      console.error('Error checking premium:', error);
    }
  }, []);

  // ==================== HANDLE GOOGLE OAUTH TOKEN ====================
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token && !isProcessingToken) {
      setIsProcessingToken(true);
      localStorage.setItem('token', token);

      const fetchUser = async () => {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Google login successful! 🎉');
            window.history.replaceState({}, '', '/dashboard');
            fetchStats();
            checkPremiumStatus();
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Failed to load user data');
          localStorage.removeItem('token');
        } finally {
          setIsProcessingToken(false);
        }
      };
      
      fetchUser();
    }
  }, [searchParams, router, setUser, isProcessingToken, fetchStats, checkPremiumStatus]);

  // ==================== FETCH STATS ON AUTH ====================
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      checkPremiumStatus();
    } else {
      setStatsLoading(false);
    }
  }, [isAuthenticated, fetchStats, checkPremiumStatus]);

  // ==================== EVENT LISTENER FOR LIKES/FAVORITES UPDATE ====================
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleLikesUpdate = () => {
      console.log('🔄 Likes updated, refreshing stats...');
      fetchStats();
    };

    const handleFavoritesUpdate = () => {
      console.log('🔄 Favorites updated, refreshing stats...');
      fetchStats();
    };

    window.addEventListener('likesUpdated', handleLikesUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('likesUpdated', handleLikesUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [isAuthenticated, fetchStats]);

  // ==================== EVENT LISTENER FOR PAYMENT UPDATE ====================
  useEffect(() => {
    if (!isAuthenticated) return;

    const handlePaymentUpdate = () => {
      console.log('🔄 Payment updated, refreshing stats and user...');
      fetchStats();
      checkPremiumStatus();
      
      // Refresh user data
      const token = localStorage.getItem('token');
      if (token) {
        api.get('/auth/me').then(response => {
          if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
          }
        });
      }
    };

    window.addEventListener('paymentCompleted', handlePaymentUpdate);

    return () => {
      window.removeEventListener('paymentCompleted', handlePaymentUpdate);
    };
  }, [isAuthenticated, fetchStats, checkPremiumStatus, setUser]);

  // ==================== AUTO-REFRESH ====================
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing stats...');
      fetchStats();
      checkPremiumStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchStats, checkPremiumStatus]);

  // ==================== REDIRECT ====================
  useEffect(() => {
    const token = searchParams.get('token');
    if (!loading && !isAuthenticated && !token && !isProcessingToken) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, searchParams, isProcessingToken]);

  // ==================== LOADING ====================
  if (loading || statsLoading || isProcessingToken) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isProcessingToken ? 'Authenticating...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ==================== STAT CARDS ====================
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}! 👋
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={stat.link} className="block">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
              className="px-6 py-2.5 bg-white text-[#D85A30] font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap shadow-lg"
            >
              Get Premium
            </Link>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          href="/dashboard/add-recipe"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-[#D85A30]/30 transition-all group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Add Recipe</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Share your culinary creation
          </p>
        </Link>

        <Link
          href="/dashboard/my-recipes"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-[#D85A30]/30 transition-all group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">My Recipes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your recipes
          </p>
        </Link>

        <Link
          href="/dashboard/favorites"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-[#D85A30]/30 transition-all group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⭐</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Favorites</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your saved recipes
          </p>
        </Link>
      </motion.div>

      {/* Premium Status Badge */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20 border border-yellow-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Premium Member</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You have unlimited access to all features
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}