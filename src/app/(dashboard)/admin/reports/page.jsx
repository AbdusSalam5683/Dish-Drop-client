// dish-drop-client/src/app/(dashboard)/admin/reports/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/admin/reports');
        setReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDismiss = async (id) => {
    try {
      await api.put(`/admin/reports/${id}/dismiss`);
      setReports(reports.map(r => 
        r._id === id ? { ...r, status: 'dismissed' } : r
      ));
      toast.success('Report dismissed');
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast.error('Failed to dismiss report');
    }
  };

  const handleRemoveRecipe = async (id) => {
    if (!confirm('Are you sure you want to remove this recipe?')) return;
    
    try {
      await api.put(`/admin/reports/${id}/remove`);
      setReports(reports.map(r => 
        r._id === id ? { ...r, status: 'resolved' } : r
      ));
      toast.success('Recipe removed and report resolved');
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast.error('Failed to remove recipe');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🚩 Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage reported recipes
        </p>
        {pendingReports.length > 0 && (
          <span className="inline-block mt-2 px-3 py-1 bg-red-500/10 text-red-600 text-sm font-semibold rounded-full">
            {pendingReports.length} pending reports
          </span>
        )}
      </div>

      {reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            No reports
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            All reports have been resolved
          </p>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
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
                {reports.map((report, index) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      report.status === 'pending' ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={report.recipeId?.recipeImage || '/placeholder.jpg'}
                            alt={report.recipeId?.recipeName || 'Recipe'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {report.recipeId?.recipeName || 'Unknown Recipe'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            by {report.recipeId?.authorName || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {report.reporterEmail}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'pending' 
                          ? 'bg-red-100 text-red-700' 
                          : report.status === 'dismissed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {report.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveRecipe(report._id)}
                            className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                          >
                            Remove Recipe
                          </button>
                          <button
                            onClick={() => handleDismiss(report._id)}
                            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}