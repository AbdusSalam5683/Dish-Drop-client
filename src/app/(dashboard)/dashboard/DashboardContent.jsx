// dish-drop-client/src/app/(dashboard)/dashboard/DashboardContent.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api'; // ✅ API লাইব্রেরি ব্যবহার করুন

export default function DashboardContent() {
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
  const [recentLikes, setRecentLikes] = useState([]);
  const [likesLoading, setLikesLoading] = useState(true);

  // ==================== HANDLE GOOGLE OAUTH TOKEN ====================
  useEffect(() => {
    const token = searchParams.get('token');
    console.log('🔑 Token from URL:', token ? '✅ exists' : '❌ null');
    
    if (token && !isProcessingToken) {
      setIsProcessingToken(true);
      console.log('📦 Processing token...');
      localStorage.setItem('token', token);

      const fetchUser = async () => {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          console.log('📥 User response:', response.data);
          
          if (response.data.success) {
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Google login successful! 🎉');
            window.history.replaceState({}, '', '/dashboard');
            fetchStats();
            checkPremiumStatus();
            fetchRecentLikes();
          }
        } catch (error) {
          console.error('❌ Error fetching user:', error);
          toast.error('Failed to load user data');
          localStorage.removeItem('token');
        } finally {
          setIsProcessingToken(false);
        }
      };
      
      fetchUser();
    }
  }, [searchParams, setUser, isProcessingToken]);

  // ==================== FORCE SYNC AUTH ====================
  const forceSyncAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔄 Force sync - token:', token ? 'exists' : 'null');
    console.log('🔄 Force sync - user:', storedUser ? 'exists' : 'null');
    
    if (token && storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        console.log('✅ User force synced:', parsedUser.email);
      } catch (error) {
        console.error('❌ Force sync error:', error);
      }
    }
  }, [user, setUser]);

  // ==================== FETCH STATS ====================
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        setStatsLoading(false);
        return;
      }
      
      console.log('📤 Fetching stats...');
      // ✅ API লাইব্রেরি ব্যবহার করুন
      const response = await api.get('/users/stats');
      
      console.log('📥 Stats response:', response.data);
      
      if (response.data.success) {
        setStats(response.data.stats);
        console.log('✅ Stats loaded:', response.data.stats);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ==================== CHECK PREMIUM STATUS ====================
  const checkPremiumStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // ✅ API লাইব্রেরি ব্যবহার করুন
      const response = await api.get('/payments/premium-status');
      
      if (response.data.success) {
        setIsPremium(response.data.isPremium);
        console.log('⭐ Premium status:', response.data.isPremium);
      }
    } catch (error) {
      console.error('Error checking premium:', error);
    }
  }, []);

  // ==================== FETCH RECENT LIKES ====================
  const fetchRecentLikes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLikesLoading(false);
        return;
      }
      
      // ✅ API লাইব্রেরি ব্যবহার করুন
      const response = await api.get('/users/recent-likes');

      if (response.data.success) {
        setRecentLikes(response.data.likes);
        console.log('❤️ Recent likes loaded:', response.data.likes.length);
      }
    } catch (error) {
      console.error('Error fetching recent likes:', error);
    } finally {
      setLikesLoading(false);
    }
  }, []);

  // ==================== FORCE SYNC ON MOUNT ====================
  useEffect(() => {
    forceSyncAuth();
  }, [forceSyncAuth]);

  // ==================== CHECK AUTH STATUS ====================
  useEffect(() => {
    console.log('🔍 Dashboard auth check:');
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - user:', user?.email);
    console.log('  - loading:', loading);
    console.log('  - token:', localStorage.getItem('token') ? 'exists' : 'null');

    if (!loading && !isAuthenticated && !isProcessingToken) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access dashboard');
        router.push('/login');
      } else {
        forceSyncAuth();
      }
    }
  }, [loading, isAuthenticated, isProcessingToken, router, forceSyncAuth]);

  // ==================== FETCH DATA ON AUTH ====================
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, fetching data...');
      fetchStats();
      checkPremiumStatus();
      fetchRecentLikes();
    } else if (!loading) {
      setStatsLoading(false);
      setLikesLoading(false);
    }
  }, [isAuthenticated, user, fetchStats, checkPremiumStatus, fetchRecentLikes, loading]);

  // ==================== EVENT LISTENERS ====================
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleLikesUpdate = () => {
      console.log('🔄 Likes updated, refreshing stats and recent likes...');
      fetchStats();
      fetchRecentLikes();
    };

    const handleFavoritesUpdate = () => {
      console.log('🔄 Favorites updated, refreshing stats...');
      fetchStats();
    };

    const handlePaymentUpdate = () => {
      console.log('🔄 Payment updated, refreshing stats and user...');
      fetchStats();
      checkPremiumStatus();
      fetchRecentLikes();
      
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

    window.addEventListener('likesUpdated', handleLikesUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('paymentCompleted', handlePaymentUpdate);

    return () => {
      window.removeEventListener('likesUpdated', handleLikesUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('paymentCompleted', handlePaymentUpdate);
    };
  }, [isAuthenticated, fetchStats, checkPremiumStatus, fetchRecentLikes, setUser]);

  // ==================== AUTO-REFRESH ====================
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing stats...');
      fetchStats();
      checkPremiumStatus();
      fetchRecentLikes();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchStats, checkPremiumStatus, fetchRecentLikes]);

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
      {/* Welcome Section */}
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

      {/* Recent Likes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            ❤️ Recent Likes
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {stats.totalLikesReceived}
            </span>
          </h3>
          <button
            onClick={fetchRecentLikes}
            className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
          >
            Refresh
          </button>
        </div>

        {likesLoading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentLikes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">💔</span>
            <p>No likes yet. Share your recipes and get likes!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLikes.map((like, index) => (
              <motion.div
                key={`${like.recipeId}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {/* Liker Avatar - ✅ FIX: Use img instead of next/image */}
                <div className="w-10 h-10 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                  {like.likerImage ? (
                    <img
                      src={like.likerImage}
                      alt={like.likerName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.parentElement) {
                          e.target.parentElement.innerHTML = `<span>${like.likerName?.[0] || '👤'}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span>{like.likerName?.[0] || '👤'}</span>
                  )}
                </div>

                {/* Liker Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-white">
                    <span className="font-medium">{like.likerName}</span>
                    {' '}liked your recipe{' '}
                    <Link
                      href={`/recipe/${like.recipeId}`}
                      className="text-[#D85A30] hover:text-[#993C1D] font-medium"
                    >
                      {like.recipeName}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {like.likedAt ? new Date(like.likedAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

                {/* Recipe Thumbnail - ✅ FIX: Use img instead of next/image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={like.recipeImage || '/placeholder.jpg'}
                    alt={like.recipeName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
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