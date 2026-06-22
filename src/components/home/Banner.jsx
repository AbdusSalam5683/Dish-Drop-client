// dish-drop-client/src/components/home/Banner.jsx
'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { TypeAnimation } from 'react-type-animation';

export default function Banner() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-linear-to-br from-[#993C1D] via-[#D85A30] to-[#F09975]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Share the Taste.{' '}
              <br />
              <TypeAnimation
                sequence={[
                  'Drop the Recipe.',
                  2000,
                  'Discover Cuisines.',
                  2000,
                  'Connect with Chefs.',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-[#F5C4B3]"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 text-lg text-[#F5C4B3] max-w-lg"
            >
              A community-driven platform for food lovers to create, share, 
              and discover recipes from every corner of the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/browse-recipes"
                className="px-8 py-3 bg-white text-[#D85A30] font-semibold rounded-xl hover:bg-[#FAECE7] transition-colors shadow-lg"
              >
                Explore Recipes
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-10 flex gap-8"
            >
              {[
                { value: '1000+', label: 'Recipes' },
                { value: '500+', label: 'Chefs' },
                { value: '50+', label: 'Cuisines' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[#F5C4B3]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Food Plate Illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full aspect-square rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center p-8"
              >
                <div className="text-center">
                  <div className="text-8xl mb-4">🍳</div>
                  <h3 className="text-2xl font-bold text-white">Delicious Recipes</h3>
                  <p className="text-[#F5C4B3] mt-2">Cook, Share, Enjoy!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}