// dish-drop-client/src/app/(dashboard)/dashboard/purchased/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PurchasedPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // TODO: Implement API to fetch purchased recipes
        // const response = await api.get('/payments/purchased');
        // setPurchases(response.data.purchases);
        setPurchases([]);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        toast.error('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading purchases...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🛒 Purchased Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Recipes you have purchased
        </p>
      </div>

      {purchases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            No purchases yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Browse and purchase recipes from our collection!
          </p>
          <Link
            href="/browse-recipes"
            className="mt-4 inline-block px-6 py-2 bg-[#D85A30] text-white rounded-lg hover:bg-[#993C1D] transition-colors"
          >
            Browse Recipes
          </Link>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Recipe</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <motion.tr
                  key={purchase._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={purchase.recipeImage}
                          alt={purchase.recipeName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {purchase.recipeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    ${purchase.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(purchase.paidAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      {purchase.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/recipe/${purchase.recipeId}`}
                      className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
                    >
                      View Recipe
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}