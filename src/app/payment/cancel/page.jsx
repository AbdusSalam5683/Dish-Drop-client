'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Icon */}
        <div className="text-6xl mb-4">😔</div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Canceled
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment was not completed. No charges were made to your account.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="block w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="block w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/browse-recipes"
            className="block w-full py-3 text-[#D85A30] hover:text-[#993C1D] transition-colors text-sm"
          >
            Browse Recipes
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Having issues? Contact our support team.
        </p>
      </motion.div>
    </div>
  );
}