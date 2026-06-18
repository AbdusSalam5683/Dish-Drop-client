"use client";

import { motion } from "motion/react";

function LogoIcon() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Fork */}
      <motion.g
        animate={{ rotate: [0, -8, 6, -4, 3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 80%" }}
      >
        <line x1="14" y1="10" x2="14" y2="42" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="9"  y1="10" x2="9"  y2="22" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="19" y1="10" x2="19" y2="22" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M9 22 Q14 30 14 34"  fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M19 22 Q14 30 14 34" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      </motion.g>

      {/* Water Drop */}
      <motion.g
        animate={{
          y:       [0,  2,  8, -9,  0,  -1,  0],
          scale:   [1,  1, 0.85, 0.5, 1.08, 0.97, 1],
          opacity: [1,  1, 0.6,  0,   1,    1,    1],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center top" }}
      >
        <path d="M34 10 Q44 22 44 30 Q44 40 34 42 Q24 40 24 30 Q24 22 34 10Z" fill="white" />
        <ellipse cx="34" cy="39" rx="8" ry="3" fill="#F09975" opacity="0.7" />
      </motion.g>
    </svg>
  );
}

const sizeMap = {
  navbar: {
    wrap:     "inline-flex items-center",
    row:      "flex items-center gap-2.5",
    iconBox:  "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 p-2",
    text:     "text-2xl",
    tagline:  "text-[10px] mt-0.5",
  },
  footer: {
    wrap:     "inline-flex items-center",
    row:      "flex items-center gap-2",
    iconBox:  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5",
    text:     "text-[18px]",
    tagline:  "text-[9px] mt-0.5",
  },
};

/**
 * DishDropLogo
 * @param {'navbar' | 'footer'} variant
 * @param {boolean} showTagline
 */
export default function DishDropLogo({ variant = "navbar", showTagline = false }) {
  const s = sizeMap[variant] ?? sizeMap.navbar;

  return (
    <div className={s.wrap}>
      <div className={s.row}>

        {/* Animated Icon Box */}
        <motion.div
          className={`${s.iconBox} bg-[#D85A30]`}
          animate={{ y: [0, -5, -2, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: [0.36, 0.07, 0.19, 0.97] }}
        >
          <LogoIcon />
        </motion.div>

        {/* Brand Text */}
        <div className="flex flex-col">
          <div
            className={`font-poppins font-bold leading-none flex ${s.text}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <motion.span
              className="text-[#993C1D]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Dish
            </motion.span>
            <motion.span
              className="text-[#D85A30]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Drop
            </motion.span>
          </div>

          {showTagline && (
            <motion.p
              className={`${s.tagline} text-[#993C1D] tracking-wide leading-none`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Share the taste. Drop the recipe.
            </motion.p>
          )}
        </div>

      </div>
    </div>
  );
}
