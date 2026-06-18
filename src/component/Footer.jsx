"use client";

import Link from "next/link";
import { motion } from "motion/react";
import DishDropLogo from "./Logo";


const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const quickLinks = [
  { href: "/",               label: "Home" },
  { href: "/browse-recipes", label: "Browse Recipes" },
  { href: "/dashboard",      label: "Dashboard" },
  { href: "/login",          label: "Login" },
  { href: "/register",       label: "Register" },
];

const socials = [
  { icon: <FacebookIcon />,  href: "#", label: "Facebook" },
  { icon: <InstagramIcon />, href: "#", label: "Instagram" },
  { icon: <TwitterIcon />,   href: "#", label: "Twitter / X" },
  { icon: <YoutubeIcon />,   href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A0E0B] text-gray-300 pt-14 pb-6 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10
          border-b border-white/10">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <DishDropLogo variant="footer" showTagline />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              A community-driven platform for food lovers to create, share, and
              discover recipes from every corner of the world.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center
                    bg-white/5 hover:bg-[#D85A30] text-gray-400 hover:text-white
                    transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-[#D85A30]
                      transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#D85A30] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {["Breakfast","Lunch","Dinner","Desserts","Vegan","Snacks"].map(cat => (
                <li key={cat}>
                  <Link href={`/browse-recipes?category=${cat.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-[#D85A30]
                      transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#D85A30] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MailIcon />
                <a href="mailto:hello@dishdrop.app" className="hover:text-[#D85A30] transition-colors">
                  hello@dishdrop.app
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <PhoneIcon />
                <a href="tel:+8801700000000" className="hover:text-[#D85A30] transition-colors">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <LocationIcon />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">Get weekly recipe picks</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10
                    rounded-lg text-gray-300 placeholder-gray-600
                    focus:outline-none focus:border-[#D85A30]/60 transition-colors" />
                <button className="px-3 py-1.5 text-xs font-semibold text-white
                  bg-[#D85A30] rounded-lg hover:bg-[#993C1D] transition-colors flex-shrink-0">
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar — suppressHydrationWarning fixes year mismatch on SSR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-gray-500">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} DishDrop. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#D85A30] transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-[#D85A30] transition-colors">Terms of Use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}