// dish-drop-client/src/context/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== SYNC AUTH ====================
  const syncAuth = () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('🔍 AuthProvider mounted');
      console.log('📦 storedToken:', storedToken ? '✅ exists' : '❌ null');
      console.log('📦 storedUser:', storedUser ? '✅ exists' : '❌ null');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          setUser(parsedUser);
          console.log('✅ User restored from localStorage:', parsedUser.email);
        } catch (parseError) {
          console.error('❌ Error parsing stored user:', parseError);
          localStorage.removeItem('user');
        }
      } else if (storedToken && !storedUser) {
        // 👇 Token exists but user doesn't - fetch user
        console.log('🔄 Token exists but no user, fetching...');
        fetchUserFromToken(storedToken);
      } else {
        setUser(null);
        delete api.defaults.headers.Authorization;
      }
    } catch (error) {
      console.error('❌ Auth sync error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH USER FROM TOKEN ====================
  const fetchUserFromToken = async (token) => {
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        console.log('✅ User fetched from token:', userData.email);
      } else {
        console.error('❌ Failed to fetch user from token');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error fetching user from token:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();
  }, []);

  // ==================== REGISTER ====================
  const register = async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // ==================== LOGIN ====================
  const login = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // ==================== GOOGLE LOGIN ====================
  const loginWithGoogle = () => {
    console.log('🌐 Redirecting to Google OAuth...');
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      delete api.defaults.headers.Authorization;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    setUser,
    loading,
    register,
    login,
    logout,
    loginWithGoogle,
    syncAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPremium: user?.isPremium || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};