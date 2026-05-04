'use client';

import React from 'react';
import FeatureShowcase from '@/components/FeatureShowcase';
import ScrollStory from '@/components/ScrollStory';

export default function PerformancePage() {
  return (
    <div className="page-wrapper">
      <section className="page-header">
        <div className="container">
          <h1>ENGINEERING <span>EXCELLENCE</span></h1>
          <p>Where raw power meets surgical precision. Discover the technology that defines the modern supercar.</p>
        </div>
      </section>

      <ScrollStory />
      <FeatureShowcase />

      <style jsx>{`
        .page-wrapper {
          padding-top: 80px;
        }

        .page-header {
          padding: 80px 0;
          background: #0a0a0a;
          text-align: center;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        h1 {
          font-size: 60px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 24px;
          letter-spacing: 2px;
        }

        h1 span {
          color: var(--accent, #ff3e3e);
        }

        p {
          font-size: 18px;
          color: #a1a1aa;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
