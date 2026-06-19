"use client";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "motion/react";

// ── Background blobs ───────────────────────────────────────────────────────────
function Blobs() {
  return (
    <>
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-[#F5C4B3] opacity-30 -top-24 -right-20 pointer-events-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-[#F09975] opacity-20 -bottom-16 -left-12 pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ── Broken plate illustration ─────────────────────────────────────────────────
function BrokenPlate() {
  return (
    <motion.svg
      width="120" height="120" viewBox="0 0 120 120" fill="none"
      animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="108" rx="40" ry="7" fill="#F5C4B3" opacity="0.4" />
      {/* Plate base */}
      <ellipse cx="60" cy="78" rx="44" ry="14" fill="#D85A30" />
      <ellipse cx="60" cy="75" rx="36" ry="10" fill="#993C1D" />
      <ellipse cx="60" cy="72" rx="28" ry="8" fill="#FAECE7" />
      {/* Crack lines */}
      <path d="M60 30 L54 52 L62 58 L52 78" stroke="#D85A30" strokeWidth="2.5"
        strokeLinecap="round" opacity="0.7" />
      <path d="M60 30 L68 50 L60 58 L70 76" stroke="#993C1D" strokeWidth="2"
        strokeLinecap="round" opacity="0.5" />
      {/* Exclamation */}
      <text x="60" y="46" textAnchor="middle"
        fontFamily="Poppins,sans-serif" fontSize="28" fontWeight="700" fill="#D85A30">
        !
      </text>
    </motion.svg>
  );
}

// ── Error Page ────────────────────────────────────────────────────────────────
export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-[#FAECE7] dark:bg-[#1A0E0B] flex flex-col
      items-center justify-center overflow-hidden px-4 py-16">
      <Blobs />

      {/* Illustration */}
      <motion.div
        className="relative z-10 mb-6"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <BrokenPlate />
      </motion.div>

      {/* Error code badge */}
      <motion.span
        className="relative z-10 mb-4 px-4 py-1 rounded-full bg-[#D85A30]/15 border border-[#D85A30]/30
          text-xs font-semibold text-[#D85A30] tracking-widest uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        500 — Server Error
      </motion.span>

      {/* Headline */}
      <motion.h1
        className="relative z-10 text-2xl sm:text-3xl font-bold text-[#993C1D] dark:text-[#F09975]
          text-center mb-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        Something went wrong in the kitchen!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="relative z-10 text-sm text-[#712B13] dark:text-[#F5C4B3] text-center
          max-w-sm leading-relaxed mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        An unexpected error occurred on the server.<br />
        Please try again in a moment or refresh the page.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="relative z-10 flex flex-wrap gap-3 justify-center mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full
            bg-[#D85A30] hover:bg-[#993C1D] text-[#FAECE7] text-sm font-semibold
            transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#D85A30]/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.17" />
          </svg>
          Try Again
        </button>
        
<Link
  href="/"
  className="inline-flex items-center gap-2 px-7 py-3 rounded-full
    border-2 border-[#D85A30] text-[#993C1D] dark:text-[#F09975] text-sm font-semibold
    hover:bg-[#993C1D] hover:text-[#FAECE7] hover:border-[#993C1D]
    transition-all duration-200 hover:-translate-y-0.5"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
  Go Home
</Link>
      </motion.div>

      {/* Error detail card (dev-friendly) */}
      {error?.message && (
        <motion.div
          className="relative z-10 bg-white dark:bg-[#2A1209] border border-[#F5C4B3]
            dark:border-[#993C1D]/40 rounded-2xl px-6 py-4 max-w-sm w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <p className="text-xs font-semibold text-[#993C1D] dark:text-[#F09975] mb-1.5 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D85A30"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Error Details
          </p>
          <p className="text-xs text-[#712B13] dark:text-[#F5C4B3] font-mono break-all leading-relaxed">
            {error.message}
          </p>
        </motion.div>
      )}
    </div>
  );
}