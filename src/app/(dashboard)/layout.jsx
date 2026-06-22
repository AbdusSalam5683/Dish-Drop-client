// dish-drop-client/src/app/(dashboard)/layout.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/my-recipes', label: 'My Recipes', icon: '📝' },
  { href: '/dashboard/add-recipe', label: 'Add Recipe', icon: '➕' },
  { href: '/dashboard/favorites', label: 'Favorites', icon: '⭐' },
  { href: '/dashboard/purchased', label: 'Purchased', icon: '🛒' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please login to access dashboard');
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-64px)] sticky top-16">
          <div className="p-6">
            {/* User Info */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-2xl">
                  {user?.name?.[0] || '👤'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.isPremium ? '⭐ Premium Member' : 'Free Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#D85A30]/10 text-[#D85A30]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-8 bg-[#D85A30] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-16 z-10">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-gray-800 dark:text-white"
          >
            <span className="text-2xl">☰</span>
            <span className="font-medium">Dashboard</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed inset-x-0 top-32 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg z-20"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#D85A30]/10 text-[#D85A30]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}