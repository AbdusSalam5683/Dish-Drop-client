// dish-drop-client/src/components/home/NewsletterSection.jsx
'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Subscribed successfully! 🎉');
      setEmail('');
      setLoading(false);
    }, 1500);
  };

  return (
    <section ref={ref} className="py-16 bg-linear-to-r from-[#1A0E0B] to-[#2A1A14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Get Weekly Recipe Picks
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and get the best recipes delivered to your inbox every week.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#D85A30] transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#D85A30] text-white font-semibold rounded-xl hover:bg-[#993C1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">✅ Weekly recipes</span>
            <span className="flex items-center gap-1">✅ Cooking tips</span>
            <span className="flex items-center gap-1">✅ Exclusive content</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}