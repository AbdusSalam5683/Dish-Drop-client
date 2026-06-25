'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-9xl mb-4">🍽️</div>
        <h1 className="text-6xl font-bold text-[#D85A30] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Oops! The recipe you're looking for seems to have been eaten.
          Let's get you back to the kitchen!
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors inline-block"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}