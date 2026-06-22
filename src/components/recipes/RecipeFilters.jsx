// dish-drop-client/src/components/recipes/RecipeFilters.jsx
'use client';

import { useState } from 'react';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Desserts', label: 'Desserts' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Snacks', label: 'Snacks' },
];

export default function RecipeFilters({ filters, onFilterChange }) {
  const [category, setCategory] = useState(filters.category || '');
  const [search, setSearch] = useState(filters.search || '');

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilterChange({ category: value, search });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ category, search });
  };

  const handleClearFilters = () => {
    setCategory('');
    setSearch('');
    onFilterChange({ category: '', search: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-white bg-[#D85A30] rounded-md hover:bg-[#993C1D] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(category || search) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#D85A30] transition-colors whitespace-nowrap"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}