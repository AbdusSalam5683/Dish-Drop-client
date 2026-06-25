// src/app/(public)/browse-recipes/page.js
import Link from "next/link";

export default function BrowseRecipesPage() {
  // ডামি ডেটা (পরে API থেকে ডেটা আনবেন)
  const recipes = [
    { id: 1, title: "Chicken Biryani", category: "Main Course", image: "/images/biryani.jpg" },
    { id: 2, title: "Beef Kala Bhuna", category: "Main Course", image: "/images/kala-bhuna.jpg" },
    { id: 3, title: "Fish Curry", category: "Main Course", image: "/images/fish-curry.jpg" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Browse All Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover delicious recipes from our community
        </p>
      </div>

      {/* Search & Filters (Placeholder) */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">Image Placeholder</span>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {recipe.category}
              </p>
              <Link
                href={`/recipe/${recipe.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Placeholder) */}
      <div className="flex justify-center mt-12 space-x-2">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Previous
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          1
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          2
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}