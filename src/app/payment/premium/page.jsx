'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

// ✅ Stripe Publishable Key চেক করুন
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PremiumPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(false);

  // Check premium status
  useEffect(() => {
    const checkPremium = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Checking premium status...');
        console.log('🔑 Token:', token ? 'exists' : 'null');
        
        const response = await fetch('http://localhost:5000/api/payments/premium-status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('📥 Response status:', response.status);
        const data = await response.json();
        console.log('📥 Data:', data);
        
        if (data.success) {
          setPremiumStatus(data.isPremium);
        }
      } catch (error) {
        console.error('❌ Error checking premium:', error);
        toast.error('Failed to check premium status');
      }
    };

    checkPremium();
  }, [isAuthenticated]);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upgrade');
      router.push('/login');
      return;
    }

    setLoadingPayment(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Creating checkout with token:', token ? 'exists' : 'null');
      
      const response = await fetch('http://localhost:5000/api/payments/create-premium-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Data:', data);
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('❌ Error creating checkout:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (premiumStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            You're a Premium Member!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enjoy unlimited access to all features.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D85A30] to-[#993C1D] p-6 text-white text-center">
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-2xl font-bold">Premium Membership</h1>
          <p className="text-white/80 text-sm mt-1">Unlock all premium features</p>
        </div>

        {/* Features */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[
              '📝 Unlimited Recipe Creation',
              '⭐ Premium Profile Badge',
              '🛒 Access to Premium Recipes',
              '📊 Advanced Analytics',
              '🎯 Priority Support'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-500 text-lg">✓</span>
                <span className="text-sm md:text-base">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Price */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white">$9.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              Cancel anytime • Secure payment
            </p>
          </div>

          {/* Upgrade Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpgrade}
            disabled={loadingPayment}
            className="w-full py-3 bg-gradient-to-r from-[#D85A30] to-[#993C1D] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingPayment ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
            ) : (
              'Upgrade to Premium'
            )}
          </motion.button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            🔒 Secured by Stripe • No hidden fees
          </p>
        </div>
      </motion.div>
    </div>
  );
}