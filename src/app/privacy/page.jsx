"use client";

import { motion } from "motion/react";
import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you register an account, including your name, email address, and optional profile image URL. When you publish recipes, we store the recipe content, images, and associated metadata. We also collect usage data such as pages visited, recipes viewed, likes, and interactions on the platform.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to: operate and maintain the DishDrop platform; personalize your experience and show you relevant recipes; process payments and manage subscriptions via Stripe; send you important account and service notifications; improve the platform through usage analytics; respond to your support requests and inquiries.`,
  },
  {
    title: "3. Authentication & Security",
    content: `DishDrop uses Better Auth for secure authentication. Passwords are hashed and never stored in plain text. Authentication tokens (JWT) are stored in secure HTTPOnly cookies to prevent client-side access. We implement industry-standard security measures to protect your data against unauthorized access, alteration, or destruction.`,
  },
  {
    title: "4. Cookies & Local Storage",
    content: `We use cookies and local storage to maintain your session, remember your theme preference (dark/light mode), and improve your experience. You can control cookie settings through your browser preferences. Disabling cookies may affect some features of the platform.`,
  },
  {
    title: "5. Third-Party Services",
    content: `DishDrop integrates with third-party services including: Google (for OAuth login), Stripe (for payment processing), and imgbb (for image hosting). These services have their own privacy policies and we encourage you to review them. We do not sell your personal information to third parties.`,
  },
  {
    title: "6. Data Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for analytical purposes. We may disclose information if required by law, to enforce our Terms of Service, or to protect the rights and safety of DishDrop and its users.`,
  },
  {
    title: "7. Recipe & Content Visibility",
    content: `Recipes you publish on DishDrop are visible to all users of the platform by default. Your profile information such as name and profile image is publicly visible. You can manage and delete your recipes at any time from your dashboard. Deleted content may remain in our backups for a limited period before being permanently removed.`,
  },
  {
    title: "8. Payment Information",
    content: `All payment transactions are processed securely by Stripe. DishDrop does not store your credit card number, CVV, or other sensitive payment details. We store only transaction metadata such as transaction ID, amount, and payment status to maintain records of your purchases and subscriptions.`,
  },
  {
    title: "9. Data Retention",
    content: `We retain your account information and content for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by legal obligations. Recipe content may be retained in anonymized form for platform analytics.`,
  },
  {
    title: "10. Your Rights",
    content: `You have the right to: access the personal information we hold about you; request correction of inaccurate data; request deletion of your account and personal data; withdraw consent for data processing where applicable; lodge a complaint with your local data protection authority. To exercise these rights, contact us at hello@dishdrop.app.`,
  },
  {
    title: "11. Children's Privacy",
    content: `DishDrop is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information promptly.`,
  },
  {
    title: "12. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email or a prominent notice on the platform. Your continued use of DishDrop after changes are posted constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAECE7]/40 dark:bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold
            bg-[#D85A30]/15 text-[#D85A30] border border-[#D85A30]/20 mb-4">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: <span className="font-medium text-gray-700 dark:text-gray-300">June 2025</span>
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            At DishDrop, we are committed to protecting your personal information and your right to privacy.
            This policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#D85A30]" />
        </motion.div>

        {/* Quick summary cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {[
            { icon: "🔒", title: "Secure Auth", desc: "JWT in HTTPOnly cookies" },
            { icon: "🚫", title: "No Data Selling", desc: "We never sell your data" },
            { icon: "🗑️", title: "Right to Delete", desc: "Delete your account anytime" },
          ].map((item, i) => (
            <div key={i}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100
                dark:border-gray-800 text-center shadow-sm">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((sec, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100
                dark:border-gray-800 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <h2 className="text-base font-semibold text-[#993C1D] dark:text-[#F09975] mb-2">
                {sec.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {sec.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          className="mt-10 p-5 rounded-2xl bg-[#D85A30]/10 border border-[#D85A30]/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you have any questions about this Privacy Policy or how we handle your data,
            please contact us at{" "}
            <a href="mailto:hello@dishdrop.app"
              className="text-[#D85A30] hover:underline font-medium">
              hello@dishdrop.app
            </a>
          </p>
          <Link href="/terms"
            className="inline-block mt-3 text-sm text-[#D85A30] hover:text-[#993C1D] font-medium transition-colors">
            View Terms of Service →
          </Link>
        </motion.div>

      </div>
    </div>
  );
}