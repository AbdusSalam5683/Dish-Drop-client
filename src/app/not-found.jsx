"use client";

import Link from "next/link";
import { motion } from "motion/react";

// ── Steam path animation ───────────────────────────────────────────────────────
function Steam({ delay = 0 }) {
  return (
    <motion.path
      d="M0 0 Q-2-6 0-12"
      fill="none"
      stroke="#993C1D"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ opacity: 0, y: 0, scaleX: 1 }}
      animate={{ opacity: [0, 0.8, 0], y: -24, scaleX: 1.3 }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Plate illustration (the "0" in 404) ───────────────────────────────────────
function PlateIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <ellipse cx="45" cy="72" rx="36" ry="7" fill="#F5C4B3" opacity="0.5" />
      <ellipse cx="45" cy="62" rx="34" ry="11" fill="#D85A30" />
      <ellipse cx="45" cy="60" rx="28" ry="9" fill="#993C1D" />
      <ellipse cx="45" cy="58" rx="22" ry="7" fill="#FAECE7" />
      <path d="M33 48 Q45 28 57 48" fill="#F09975" stroke="#D85A30" strokeWidth="1.5" />
      <ellipse cx="45" cy="48" rx="10" ry="5" fill="#D85A30" />
      {/* Steam */}
      <g transform="translate(36,44)"><Steam delay={0} /></g>
      <g transform="translate(45,42)"><Steam delay={0.4} /></g>
      <g transform="translate(54,44)"><Steam delay={0.8} /></g>
      <text x="45" y="62" textAnchor="middle"
        fontFamily="Poppins,sans-serif" fontSize="11" fontWeight="700" fill="#D85A30">
        404
      </text>
    </svg>
  );
}

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

// ── 404 Page ──────────────────────────────────────────────────────────────────
export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#FAECE7] dark:bg-[#1A0E0B] flex flex-col
      items-center justify-center overflow-hidden px-4 py-16 font-[Poppins,sans-serif]">
      <Blobs />

      {/* 4 — plate — 4 */}
      <div className="relative z-10 flex items-center justify-center gap-1 mb-4">
        {["4", null, "4"].map((n, i) =>
          n ? (
            <motion.span
              key={i}
              className="text-[100px] sm:text-[120px] font-bold leading-none text-[#D85A30]"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {n}
            </motion.span>
          ) : (
            <motion.div
              key="plate"
              className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px]"
              animate={{ rotate: [-2, 2, -2], y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlateIcon />
            </motion.div>
          )
        )}
      </div>

      {/* Headline */}
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-[#993C1D] dark:text-[#F09975] text-center mb-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Oops! This recipe couldn't be found!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-sm text-[#712B13] dark:text-[#F5C4B3] text-center max-w-sm leading-relaxed mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        Looks like this page has gone missing from the kitchen.<br />
        Maybe the address was wrong, or the page has been removed.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full
            bg-[#D85A30] hover:bg-[#993C1D] text-[#FAECE7] text-sm font-semibold
            transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#D85A30]/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go Home
        </Link>
        <Link
          href="/browse-recipes"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full
            border-2 border-[#D85A30] text-[#993C1D] dark:text-[#F09975] text-sm font-semibold
            hover:bg-[#993C1D] hover:text-[#FAECE7] hover:border-[#993C1D]
            transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search Recipes
        </Link>
      </motion.div>

      {/* Tips card */}
      <motion.div
        className="bg-white dark:bg-[#2A1209] border border-[#F5C4B3] dark:border-[#993C1D]/40
          rounded-2xl px-7 py-5 max-w-sm w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-[#993C1D] dark:text-[#F09975] mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D85A30"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Troubleshooting Tips
        </p>
        <ul className="space-y-2">
          {[
            "Check that the URL is typed correctly",
            "Press the browser's back button",
            "Search for recipes from the home page",
            "Contact us if the problem persists",
          ].map((tip, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-[#712B13] dark:text-[#F5C4B3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30] flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}