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
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              ULTRA<span>DRIVE</span>
            </div>
            <p>© 2024 UltraDrive Automotive Group. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          padding: 60px 0;
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #71717a;
          text-align: center;
        }

        .footer-logo {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 20px;
        }

        .footer-logo span {
          color: var(--accent, #ff3e3e);
        }

        .footer p {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
