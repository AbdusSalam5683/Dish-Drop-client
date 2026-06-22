// dish-drop-client/src/components/home/StatsSection.jsx
'use client';

import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  {
    id: 1,
    value: '1000+',
    label: 'Total Recipes',
    icon: '📝',
    description: 'Recipes shared by our community'
  },
  {
    id: 2,
    value: '500+',
    label: 'Active Chefs',
    icon: '👨‍🍳',
    description: 'Passionate home cooks and chefs'
  },
  {
    id: 3,
    value: '50+',
    label: 'Cuisines',
    icon: '🌍',
    description: 'From every corner of the world'
  },
  {
    id: 4,
    value: '10K+',
    label: 'Happy Users',
    icon: '❤️',
    description: 'Loving and sharing recipes daily'
  }
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-16 bg-gradient-to-r from-[#D85A30] to-[#993C1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="text-4xl mb-2"
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-3xl md:text-4xl font-bold"
              >
                {stat.value}
              </motion.div>
              <div className="text-lg font-semibold mt-1 text-[#F5C4B3]">
                {stat.label}
              </div>
              <div className="text-sm text-[#F5C4B3]/80 mt-1">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}