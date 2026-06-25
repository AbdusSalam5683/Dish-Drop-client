// dish-drop-client/src/app/(dashboard)/admin/profile/page.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ==================== IMAGE UPLOAD TO IMGBB ====================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

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

  // ==================== UPDATE PROFILE ====================
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          👤 Admin Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile information
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* ==================== PROFILE HEADER ==================== */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-4xl overflow-hidden ring-4 ring-[#D85A30]/20">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={user?.name || 'Admin'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-4xl">${user?.name?.[0] || 'A'}</span>`;
                    }
                  }}
                />
              ) : (
                <span>{user?.name?.[0] || 'A'}</span>
              )}
            </div>
            <span className="absolute -top-1 -right-1 text-2xl">👨‍💼</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-purple-500 text-white rounded-full">
                👨‍💼 Administrator
              </span>
              {user?.isPremium && (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-500 text-white rounded-full">
                  ⭐ Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ==================== PROFILE FORM ==================== */}
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

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value="Administrator"
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Profile Image */}
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
                  <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
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

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="w-full py-3 bg-[#D85A30] text-white font-semibold rounded-lg hover:bg-[#993C1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        {/* ==================== ACCOUNT STATS ==================== */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            📊 Account Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                {user?.role || 'User'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-sm font-medium text-green-600">
                {user?.isBlocked ? 'Blocked' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}