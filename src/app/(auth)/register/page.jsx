"use client";
import { useForm } from "react-hook-form";
import axiosSecure from "@/lib/axios"; //  Axios instance
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import DishDropLogo from "@/components/Logo";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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

function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ characters",      ok: password.length >= 6 },
    { label: "Uppercase letter",    ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter",    ok: /[a-z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-red-400", "bg-yellow-400", "bg-green-500"];
  const labels = ["Weak", "Medium", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-1.5 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300
              ${i < score ? colors[score - 1] : "bg-gray-200 dark:bg-gray-700"}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span key={c.label}
            className={`text-xs flex items-center gap-1
              ${c.ok ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
            <span>{c.ok ? "✓" : "○"}</span>{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, error, rightEl, hint }) {
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
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function AuthIllustration() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-10 overflow-hidden">
      <motion.div className="absolute w-72 h-72 rounded-full bg-[#F09975] opacity-20 -top-16 -left-16"
        animate={{ y: [0, 18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-48 h-48 rounded-full bg-[#F5C4B3] opacity-25 -bottom-10 -right-10"
        animate={{ y: [0, -14, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.svg width="180" height="180" viewBox="0 0 180 180" fill="none"
          animate={{ rotate: [-2, 2, -2], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="30" y="130" width="120" height="22" rx="4" fill="#993C1D"/>
          <path d="M50 130 Q50 60 90 55 Q130 60 130 130Z" fill="white" opacity="0.9"/>
          <circle cx="90" cy="55" r="28" fill="white" opacity="0.9"/>
          <circle cx="65" cy="75" r="22" fill="white" opacity="0.85"/>
          <circle cx="115" cy="75" r="22" fill="white" opacity="0.85"/>
          <rect x="30" y="130" width="120" height="4" rx="2" fill="#D85A30" opacity="0.6"/>
          {[[60, 145], [90, 148], [120, 145]].map(([x, y], i) => (
            <motion.text key={i} x={x} y={y} textAnchor="middle" fontSize="10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}>
              ⭐
            </motion.text>
          ))}
        </motion.svg>

        <motion.h2 className="text-2xl font-bold text-white mt-4 mb-2"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Join as a Chef! 👨‍🍳
        </motion.h2>
        <motion.p className="text-[#F5C4B3] text-sm leading-relaxed max-w-xs"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          Share your cooking recipes and reach thousands of food lovers.
        </motion.p>

        <motion.ul className="mt-6 space-y-2 text-left w-full max-w-xs"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          {[
            "Create & share recipes",
            "Like other users' recipes",
            "Save favorite recipes",
            "Unlock premium recipes",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#F5C4B3]">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm]        = useState({ name: "", email: "", imageUrl: "", password: "", confirm: "" });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    setErrors(p => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name)                      e.name     = "Name is required";
    if (!form.email)                    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Please enter a valid email";
    if (!form.password)                  e.password = "Password is required";
    else if (form.password.length < 6)          e.password = "Minimum 6 characters";
    else if (!/[A-Z]/.test(form.password))      e.password = "Requires an uppercase letter";
    else if (!/[a-z]/.test(form.password))      e.password = "Requires a lowercase letter";
    if (form.confirm !== form.password)         e.confirm  = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    // TODO: better-auth signUp
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#993C1D] via-[#D85A30] to-[#F09975]">
        <AuthIllustration />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10
        bg-[#FAECE7]/30 dark:bg-gray-950 overflow-y-auto">
        <motion.div
          className="w-full max-w-md py-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="mb-6">
            <DishDropLogo variant="navbar" />
            <h1 className="mt-5 text-2xl font-bold text-gray-800 dark:text-gray-100">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D85A30] hover:text-[#993C1D] font-medium transition-colors">
                Log In
              </Link>
            </p>
          </div>

          <button
            onClick={() => { /* TODO: better-auth Google signUp */ }}
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

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or fill out the form</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField label="Full Name" value={form.name} onChange={set("name")}
              placeholder="Your full name" error={errors.name} />

            <InputField label="Email" type="email" value={form.email} onChange={set("email")}
              placeholder="your@email.com" error={errors.email} />

            <InputField label="Profile Image URL" value={form.imageUrl} onChange={set("imageUrl")}
              placeholder="https://example.com/photo.jpg" error={errors.imageUrl}
              hint="Optional — upload to imgbb and paste the link" />

            <div>
              <InputField label="Password" type={showPass ? "text" : "password"}
                value={form.password} onChange={set("password")}
                placeholder="••••••••" error={errors.password}
                rightEl={
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="text-gray-400 hover:text-[#D85A30] transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                }
              />
              <PasswordStrength password={form.password} />
            </div>

            <InputField label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={form.confirm} onChange={set("confirm")}
              placeholder="••••••••" error={errors.confirm}
              rightEl={
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="text-gray-400 hover:text-[#D85A30] transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              }
            />

            <label className="flex items-start gap-2 cursor-pointer mt-1">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#D85A30]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-[#D85A30] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#D85A30] hover:underline">Privacy Policy</Link>
              </span>
            </label>

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
                  Registering...
                </span>
              ) : "Register"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}