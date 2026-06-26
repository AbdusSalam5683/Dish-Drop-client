// dish-drop-client/src/components/payment/PaymentSuccessContent.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState('premium');
  const [recipeId, setRecipeId] = useState(null);
  const [user, setUser] = useState(null);

  const sessionId = searchParams.get('session_id');
  const recipeIdParam = searchParams.get('recipe_id');

  useEffect(() => {
    // Redirect if no session ID
    if (!sessionId) {
      toast.error('Invalid payment session');
      router.push('/dashboard');
      return;
    }

    // Set payment type for recipe purchases
    if (recipeIdParam) {
      setPaymentType('recipe');
      setRecipeId(recipeIdParam);
    }

    // Update user status after successful payment
    const updateStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          router.push('/login');
          return;
        }

        // Fetch updated user data using API library
        const response = await api.get('/auth/me');

        if (response.data.success) {
          const userData = response.data.user;

          // Update localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);

          // Dispatch events for context updates
          window.dispatchEvent(new Event('userUpdated'));
          window.dispatchEvent(new Event('paymentCompleted'));

          toast.success('Payment successful! 🎉');
        } else {
          toast.error(response.data.message || 'Failed to update account status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error(error.response?.data?.message || 'Failed to update account status');
      } finally {
        setLoading(false);
      }
    };

    updateStatus();
  }, [sessionId, router, recipeIdParam]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  // Success page
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Success icon */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Successful!
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {paymentType === 'premium'
            ? 'Your account has been upgraded to Premium! 🚀'
            : 'You have successfully purchased this recipe! 📝'}
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          {paymentType === 'recipe' && recipeId && (
            <Link
              href={`/recipe/${recipeId}`}
              className="block w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] transition-colors shadow-md hover:shadow-lg"
            >
              View Purchased Recipe
            </Link>
          )}

          <Link
            href="/dashboard"
            className="block w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] transition-colors shadow-md hover:shadow-lg"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/browse-recipes"
            className="block w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Browse More Recipes
          </Link>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Your payment was successful. Thank you for your purchase!
        </p>
      </motion.div>
    </div>
  );
}