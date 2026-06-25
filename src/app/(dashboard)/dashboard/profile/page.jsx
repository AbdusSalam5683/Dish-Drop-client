'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || '',
  });

  // ==================== HANDLE CHANGE ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ==================== HANDLE IMAGE UPLOAD ====================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=' + process.env.NEXT_PUBLIC_IMGBB_API_KEY, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // ==================== HANDLE SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ==================== STATS ====================
  const stats = [
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', icon: '📅' },
    { label: 'Role', value: user?.role || 'User', icon: '👤' },
    { label: 'Status', value: user?.isBlocked ? 'Blocked' : 'Active', icon: user?.isBlocked ? '🚫' : '✅' },
    { label: 'Premium', value: user?.isPremium ? 'Premium Member' : 'Free Member', icon: user?.isPremium ? '⭐' : '🆓' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          👤 My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==================== PROFILE CARD ==================== */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-6xl overflow-hidden ring-4 ring-[#D85A30]/20 mx-auto">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-6xl">${user?.name?.[0] || '👤'}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-6xl">{user?.name?.[0] || '👤'}</span>
                )}
              </div>
              {user?.isPremium && (
                <span className="absolute -top-1 -right-1 text-2xl">⭐</span>
              )}
            </div>

            {/* Name & Email */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {user?.role === 'admin' && (
                <span className="px-3 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                  👨‍💼 Admin
                </span>
              )}
              {user?.isPremium && (
                <span className="px-3 py-1 text-xs font-semibold bg-yellow-500 text-white rounded-full">
                  ⭐ Premium
                </span>
              )}
              {user?.isBlocked && (
                <span className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                  🚫 Blocked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ==================== PROFILE FORM ==================== */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Edit Profile
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Image
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                      disabled={imageUploading}
                    />
                    {imageUploading && (
                      <span className="text-sm text-gray-500">Uploading...</span>
                    )}
                  </div>
                  {formData.image && (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={formData.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">Image uploaded</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Or paste image URL"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || imageUploading}
                className="w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ==================== ACCOUNT STATS ==================== */}
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📊 Account Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stat.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}