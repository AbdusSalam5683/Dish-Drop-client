// dish-drop-client/src/app/page.jsx
'use client';

import { motion } from 'motion/react';
import Banner from '@/components/home/Banner';
import FeaturedRecipes from '@/components/home/FeaturedRecipes';
import PopularRecipes from '@/components/home/PopularRecipes';
import StatsSection from '@/components/home/StatsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <main>
      {/* Banner Section */}
      <Banner />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Featured Recipes */}
      <FeaturedRecipes />
      
      {/* Popular Recipes */}
      <PopularRecipes />
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}