// dish-drop-client/src/app/(public)/browse-recipes/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import { recipeAPI } from '@/lib/api';

export default function BrowseRecipesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get filters from URL
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0
  });
  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    page: initialPage
  });

  // Fetch recipes when filters change
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = {
          page: filters.page,
          limit: 9,
        };
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;

        const response = await recipeAPI.getAll(params);
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.page > 1) params.set('page', filters.page);
    
    const url = `/browse-recipes${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(url, { scroll: false });
  }, [filters, router]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Browse Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover amazing recipes from our community
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <RecipeFilters filters={filters} onFilterChange={handleFilterChange} />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-between"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {recipes.length} of {pagination.total} recipes
          </span>
        </motion.div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && recipes.length > 0 && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-[#D85A30] text-white'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}