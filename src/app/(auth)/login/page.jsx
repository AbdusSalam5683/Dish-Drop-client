// dish-drop-client/src/app/(auth)/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import DishDropLogo from "@/components/Logo";
import toast from "react-hot-toast";

// ── Google Icon ────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Eye Icon ──────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
  </svg>
);

// ── Illustration Component ──────────────────────────────────────────────────────
function AuthIllustration() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-10 overflow-hidden">
      <motion.div 
        className="absolute w-72 h-72 rounded-full bg-[#F09975] opacity-20 -top-16 -left-16"
        animate={{ y: [0, 18, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
      />
      <motion.div 
        className="absolute w-48 h-48 rounded-full bg-[#F5C4B3] opacity-25 -bottom-10 -right-10"
        animate={{ y: [0, -14, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.svg 
          width="200" height="200" viewBox="0 0 200 200" fill="none"
          animate={{ rotate: [-2, 2, -2], y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="100" cy="170" rx="75" ry="14" fill="#F5C4B3" opacity="0.5"/>
          <ellipse cx="100" cy="155" rx="70" ry="18" fill="#D85A30"/>
          <ellipse cx="100" cy="150" rx="58" ry="14" fill="#993C1D"/>
          <ellipse cx="100" cy="145" rx="46" ry="11" fill="#FAECE7"/>
          <path d="M68 110 Q100 65 132 110" fill="#F09975" stroke="#D85A30" strokeWidth="2"/>
          <ellipse cx="100" cy="110" rx="20" ry="10" fill="#D85A30"/>
          <line x1="38" y1="70" x2="38" y2="150" stroke="#993C1D" strokeWidth="4" strokeLinecap="round"/>
          <line x1="30" y1="70" x2="30" y2="100" stroke="#993C1D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="46" y1="70" x2="46" y2="100" stroke="#993C1D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M30 100 Q38 118 38 124" fill="none" stroke="#993C1D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M46 100 Q38 118 38 124" fill="none" stroke="#993C1D" strokeWidth="3" strokeLinecap="round"/>
          <line x1="162" y1="70" x2="162" y2="150" stroke="#993C1D" strokeWidth="4" strokeLinecap="round"/>
          <path d="M162 70 Q175 85 162 105" fill="#D85A30" opacity="0.6"/>
          {[85, 100, 115].map((x, i) => (
            <motion.path 
              key={x} 
              d={`M${x} 100 Q${x - 5} 82 ${x} 65`} 
              fill="none"
              stroke="#993C1D" strokeWidth="2.5" strokeLinecap="round"
              animate={{ opacity: [0, 0.6, 0], y: [0, -12] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }} 
            />
          ))}
        </motion.svg>

        <motion.h2
          className="text-2xl font-bold text-white mt-4 mb-2"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome Back! 🍽️
        </motion.h2>
        <motion.p
          className="text-[#F5C4B3] text-sm leading-relaxed max-w-xs"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          Share your favorite recipes and discover the world's best cuisines.
        </motion.p>

        <motion.div
          className="flex gap-8 mt-8"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[["1000+", "Recipes"], ["500+", "Chefs"], ["50+", "Cuisines"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold text-white">{num}</div>
              <div className="text-xs text-[#F5C4B3] mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Input Field Component ─────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, placeholder, error, rightEl }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 outline-none
            bg-white dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-600
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/20"
            }
            ${rightEl ? "pr-11" : ""}
          `}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightEl}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Login Page Component ──────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔒 Redirect authenticated users away from login page
  useEffect(() => {
    // Only redirect after auth loading is complete
    if (!authLoading && isAuthenticated && user) {
      const redirectPath = user?.role === 'admin' ? '/admin' : '/dashboard';
      console.log(`🔒 Auth guard: User already logged in, redirecting to: ${redirectPath}`);
      
      // Use replace to prevent back button to login page
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, authLoading, router]);

  // Form validation
  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    const result = await login({ email, password });
    console.log('🔐 Login result:', result);
    
    if (result.success) {
      // The useEffect above will handle redirect after state update
      toast.success('Login successful!');
    } else {
      setErrors({ general: result.message });
      setLoading(false);
    }
  };

  // Show loading screen while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // 👇 If user is authenticated, don't render login form
  // (Although useEffect will redirect, this prevents any flash)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#993C1D] via-[#D85A30] to-[#F09975]">
        <AuthIllustration />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12
        bg-[#FAECE7]/30 dark:bg-gray-950">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {/* Header */}
          <div className="mb-8">
            <DishDropLogo variant="navbar" />
            <h1 className="mt-5 text-2xl font-bold text-gray-800 dark:text-gray-100">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#D85A30] hover:text-[#993C1D] font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {errors.general}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
              border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-sm font-medium text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800
              transition-all duration-200 shadow-sm hover:shadow mb-5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="your@email.com"
              error={errors.email}
            />
            
            <InputField
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
              error={errors.password}
              rightEl={
                <button 
                  type="button" 
                  onClick={() => setShowPass((prev) => !prev)}
                  className="text-gray-400 hover:text-[#D85A30] transition-colors"
                >
                  <EyeIcon open={showPass} />
                </button>
              }
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 accent-[#D85A30]" 
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="/forgot-password"
                className="text-sm text-[#D85A30] hover:text-[#993C1D] transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white
                bg-[#D85A30] hover:bg-[#993C1D] disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 shadow-md shadow-[#D85A30]/25 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}