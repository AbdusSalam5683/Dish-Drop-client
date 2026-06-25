'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function PurchasedPage() {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================== FETCH PURCHASED RECIPES ====================
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/payments/purchased', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setPurchases(data.purchases);
        } else {
          setPurchases([]);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPurchases();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading purchases...</p>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================
  if (purchases.length === 0) {
    return (
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
    );
  }

  // ==================== PURCHASES TABLE ====================
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🛒 Purchased Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {purchases.length} recipes purchased
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {purchases.map((purchase, index) => {
                // 👇 Extract recipe ID properly
                const recipeId = purchase.recipeId?._id || purchase.recipeId;
                const recipeImage = purchase.recipeImage || purchase.recipeId?.recipeImage || '/placeholder.jpg';
                const recipeName = purchase.recipeName || purchase.recipeId?.recipeName || 'Unknown Recipe';

                return (
                  <motion.tr
                    key={purchase._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Recipe */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recipeImage}
                            alt={recipeName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {recipeName}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      ${purchase.amount?.toFixed(2) || '0.00'}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {purchase.paidAt ? new Date(purchase.paidAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        purchase.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : purchase.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {purchase.paymentStatus || 'completed'}
                      </span>
                    </td>

                    {/* Action - FIXED */}
                    <td className="px-6 py-4">
                      {recipeId ? (
                        <Link
                          href={`/recipe/${recipeId}`}
                          className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
                        >
                          View Recipe
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">Recipe removed</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}