"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import DishDropLogo from "./Logo";
import toast from "react-hot-toast";

// ── Icons ──────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Navigation Link Component ────────────────────────────────────────────────
function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-200 group
        ${isActive
          ? "text-[#D85A30]"
          : "text-gray-700 dark:text-gray-300 hover:text-[#D85A30] dark:hover:text-[#D85A30]"
        }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-[#D85A30] rounded-full transition-all duration-300
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
}

// ── Public navigation links ──────────────────────────────────────────────────
const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-recipes", label: "Browse Recipes" },
];

// ── Theme toggle component ──────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg text-gray-600 dark:text-gray-400
          hover:bg-[#FAECE7] dark:hover:bg-[#993C1D]/20
          hover:text-[#D85A30] transition-colors duration-200 w-9 h-9 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-400
        hover:bg-[#FAECE7] dark:hover:bg-[#993C1D]/20
        hover:text-[#D85A30] transition-colors duration-200 w-9 h-9 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// ── Main Navbar Component ────────────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for background effects
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  // 👇 Role-based dashboard link
  const getDashboardLink = () => {
    if (!isAuthenticated) return null;
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  // 👇 Role-based profile link
  const getProfileLink = () => {
    if (!isAuthenticated) return null;
    return user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile';
  };

  const dashboardLink = getDashboardLink();
  const profileLink = getProfileLink();

  return (
    <>
      {/* ── Main Header ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-[#D85A30]/10"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0">
              <DishDropLogo variant="navbar" />
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden md:flex items-center gap-7">
              {publicLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && dashboardLink && (
                <NavLink href={dashboardLink}>
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </NavLink>
              )}
            </nav>

            {/* ── Right Side Actions ── */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* ── Desktop Auth Buttons ── */}
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-semibold text-[#993C1D] border border-[#D85A30]
                      rounded-lg hover:bg-[#FAECE7] transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-[#D85A30]
                      rounded-lg hover:bg-[#993C1D] transition-colors duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  {/* ── Premium Badge ── */}
                  {user?.isPremium && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                      ⭐ Premium
                    </span>
                  )}
                  
                  {/* ── User Avatar ── */}
                  {profileLink && (
                    <Link href={profileLink} className="relative w-9 h-9">
                      <Image
                        src={user?.image || "/default-avatar.png"}
                        alt={user?.name || "User avatar"}
                        width={36}
                        height={36}
                        unoptimized={true}
                        className="rounded-full object-cover ring-2 ring-[#D85A30]/40
                          hover:ring-[#D85A30] transition-all duration-200"
                      />
                    </Link>
                  )}
                  
                  {/* ── Sign Out Button ── */}
                  <button
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-[#D85A30]
                      rounded-lg hover:bg-[#993C1D] transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* ── Mobile Menu Toggle ── */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300
                  hover:bg-[#FAECE7] dark:hover:bg-[#993C1D]/20 transition-colors"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Navigation Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-16 inset-x-0 z-40 bg-white dark:bg-gray-950
              border-b border-[#D85A30]/15 shadow-lg md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {/* ── Mobile Navigation Links ── */}
              {publicLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && dashboardLink && (
                <NavLink
                  href={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
                </NavLink>
              )}

              {/* ── Mobile Auth Buttons ── */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-semibold text-[#993C1D]
                        border border-[#D85A30] rounded-lg hover:bg-[#FAECE7] transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-semibold text-white
                        bg-[#D85A30] rounded-lg hover:bg-[#993C1D] transition-colors"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.isPremium && (
                      <span className="text-center text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-lg px-3 py-1">
                        ⭐ Premium Member
                      </span>
                    )}
                    <button
                      className="w-full px-4 py-2 text-sm font-semibold text-white
                        bg-[#D85A30] rounded-lg hover:bg-[#993C1D] transition-colors"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Spacer to prevent content from hiding behind fixed navbar ── */}
      <div className="h-16" />
    </>
  );
}