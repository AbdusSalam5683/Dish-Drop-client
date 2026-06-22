// dish-drop-client/src/components/home/Banner.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TypeAnimation } from 'react-type-animation';

export default function Banner() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#993C1D] via-[#D85A30] to-[#F09975]">
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

          {/* Right Content - Real Food Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Main Image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=600&fit=crop&crop=center"
                  alt="Delicious food platter"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Floating Badge 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">4.9 Rating</p>
                      <p className="text-xs text-gray-500">500+ reviews</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍🍳</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Top Chefs</p>
                      <p className="text-xs text-gray-500">50+ experts</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute bottom-4 left-4 bg-[#D85A30] text-white rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <p className="text-xs font-semibold">Popular</p>
                      <p className="text-xs opacity-80">100+ recipes</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#F5C4B3]/30 backdrop-blur-sm flex items-center justify-center text-3xl"
              >
                🍽️
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[#F5C4B3]/20 backdrop-blur-sm flex items-center justify-center text-2xl"
              >
                🥘
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}