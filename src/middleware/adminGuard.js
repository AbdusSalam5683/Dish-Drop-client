// dish-drop-client/src/middleware/adminGuard.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export function useAdminGuard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

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

  return { user, loading, isAdmin: user?.role === 'admin' };
}