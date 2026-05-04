'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import HeroSection from '@/components/HeroSection';
import ScrollStory from '@/components/ScrollStory';
import CinematicReveal from '@/components/CinematicReveal';
import FeatureShowcase from '@/components/FeatureShowcase';
import InventoryGrid from '@/components/InventoryGrid';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <HeroSection />
      <ScrollStory />
      <CinematicReveal />
      <FeatureShowcase />
      <InventoryGrid />
    </div>
  );
}
