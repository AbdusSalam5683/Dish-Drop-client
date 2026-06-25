// dish-drop-client/src/app/(dashboard)/admin/layout.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

// 👇 Profile link যোগ করা হয়েছে
const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/manage-users', label: 'Manage Users', icon: '👥' },
  { href: '/admin/manage-recipes', label: 'Manage Recipes', icon: '📝' },
  { href: '/admin/reports', label: 'Reports', icon: '🚩' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },  // ✅ নতুন
];

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Admin Guard - সরাসরি useAuth ব্যবহার করছি
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        toast.error('Please login to access admin panel');
        router.push('/login');
        return;
      }
      if (user?.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, user, router]);

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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-64px)] sticky top-16">
          <div className="p-6">
            {/* Admin Info */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-lg overflow-hidden">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-lg">${user?.name?.[0] || 'A'}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-lg">{user?.name?.[0] || 'A'}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    👨‍💼 Administrator
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Admin Panel
            </h2>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
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