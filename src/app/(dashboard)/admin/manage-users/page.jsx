'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentBlockStatus) => {
    try {
      const response = await api.put(`/admin/users/${userId}/block`, {
        block: !currentBlockStatus
      });
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlocked: !currentBlockStatus } : user
      ));
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling user block:', error);
      toast.error('Failed to update user status');
    }
  };

  // Stats
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.isPremium).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;
  const activeUsers = users.filter(u => !u.isBlocked).length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.isBlocked) ||
                         (filterStatus === 'blocked' && user.isBlocked) ||
                         (filterStatus === 'premium' && user.isPremium);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const statCards = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Premium Members', value: premiumUsers, icon: '⭐', color: 'bg-yellow-500/10 text-yellow-500' },
    { label: 'Active Users', value: activeUsers, icon: '✅', color: 'bg-green-500/10 text-green-500' },
    { label: 'Blocked Users', value: blockedUsers, icon: '🚫', color: 'bg-red-500/10 text-red-500' },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          👥 Manage Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View, block, or unblock users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="premium">Premium</option>
        </select>
        {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
              setFilterStatus('all');
            }}
            className="px-4 py-2 text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      user.isBlocked ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* 👇 FIX: Use img tag instead of next/image */}
                        <div className="w-10 h-10 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-lg">${user.name?.[0] || '👤'}</span>`;
                                }
                              }}
                            />
                          ) : (
                            <span className="text-lg">{user.name?.[0] || '👤'}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {user.name}
                          </span>
                          {user.isPremium && (
                            <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                              ⭐ Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isBlocked 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                        {user.isPremium && (
                          <span className="text-xs text-yellow-600">⭐</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            user.isBlocked
                              ? 'bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white'
                              : 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}