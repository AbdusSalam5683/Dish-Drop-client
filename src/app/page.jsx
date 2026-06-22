// dish-drop-client/src/app/page.jsx
'use client';

import { motion } from 'motion/react';
import Banner from '@/components/home/Banner';
import StatsSection from '@/components/home/StatsSection';
import FeaturedRecipes from '@/components/home/FeaturedRecipes';
import PopularRecipes from '@/components/home/PopularRecipes';
import NewsletterSection from '@/components/home/NewsletterSection';


export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Banner />
      <StatsSection />
      <FeaturedRecipes />
      <PopularRecipes />
      <NewsletterSection /> 
    </main>
  );
}