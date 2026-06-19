"use client";

import { motion } from "motion/react";
import Link from "next/link";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using DishDrop, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of the revised terms.`,
  },
  {
    title: "2. User Accounts",
    content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. DishDrop reserves the right to terminate accounts that violate these terms.`,
  },
  {
    title: "3. Recipe Content & Ownership",
    content: `When you publish a recipe on DishDrop, you retain ownership of your content. However, you grant DishDrop a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content on the platform. You are solely responsible for ensuring that the content you post does not infringe upon any third-party intellectual property rights.`,
  },
  {
    title: "4. Free vs Premium Membership",
    content: `Free accounts are limited to publishing a maximum of 2 recipes. To unlock unlimited recipe publishing and other premium features, users must purchase a Premium Membership via Stripe. Premium benefits include a profile badge, unlimited recipe uploads, and access to exclusive content. Payments are non-refundable unless otherwise required by applicable law.`,
  },
  {
    title: "5. Prohibited Conduct",
    content: `You agree not to: post false, misleading, or plagiarized recipes; harass, abuse, or harm other users; attempt to gain unauthorized access to the platform or other accounts; use the platform for any illegal or unauthorized purpose; post spam, advertisements, or solicitations without prior approval from DishDrop.`,
  },
  {
    title: "6. Reporting & Moderation",
    content: `DishDrop provides a reporting system for users to flag content that is spam, offensive, or infringing copyright. Our admin team reviews all reports and reserves the right to remove content or suspend accounts without prior notice if a violation is found.`,
  },
  {
    title: "7. Payment & Stripe",
    content: `All payments on DishDrop are processed securely through Stripe. By making a purchase, you agree to Stripe's Terms of Service and Privacy Policy. DishDrop does not store your full payment card details. In case of billing disputes, please contact us within 7 days of the transaction.`,
  },
  {
    title: "8. Disclaimers",
    content: `DishDrop is provided "as is" without warranties of any kind. We do not guarantee that recipes are accurate, safe, or suitable for specific dietary needs. Always exercise caution and consult professionals when trying new recipes, especially if you have allergies or health conditions.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by law, DishDrop and its team shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of data, revenue, or health-related issues from following recipes.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us at hello@dishdrop.app or visit our contact page. We aim to respond to all inquiries within 2 business days.`,
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: <span className="font-medium text-gray-700 dark:text-gray-300">June 2025</span>
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            Please read these Terms of Service carefully before using DishDrop.
            These terms govern your access to and use of our recipe sharing platform.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#D85A30]" />
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
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
            By using DishDrop, you acknowledge that you have read and understood these Terms of Service.
            For questions, contact us at{" "}
            <a href="mailto:hello@dishdrop.app"
              className="text-[#D85A30] hover:underline font-medium">
              hello@dishdrop.app
            </a>
          </p>
          <Link href="/privacy"
            className="inline-block mt-3 text-sm text-[#D85A30] hover:text-[#993C1D] font-medium transition-colors">
            View Privacy Policy →
          </Link>
        </motion.div>

      </div>
    </div>
  );
}