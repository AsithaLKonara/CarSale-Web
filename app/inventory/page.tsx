'use client';

import React from 'react';
import InventoryGrid from '@/components/InventoryGrid';

export default function InventoryPage() {
  return (
    <div className="page-wrapper">
      <section className="page-header">
        <video autoPlay muted loop playsInline className="header-video">
          <source src="/12698077_1356_720_24fps.mp4" type="video/mp4" />
        </video>
        <div className="container header-content">
          <h1>ENGINEERING <span>EXCELLENCE</span></h1>
          <p>Explore our curated collection of the world's most exceptional automobiles. From track-focused hypercars to elegant grand tourers.</p>
        </div>
      </section>
      
      <InventoryGrid />

      <style jsx>{`
        .page-wrapper {
          padding-top: 80px; /* Navbar height */
        }

        .page-header {
          position: relative;
          padding: 160px 0;
          background: #000;
          text-align: center;
          overflow: hidden;
        }

        .header-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
          z-index: 1;
        }

        .header-content {
          position: relative;
          z-index: 2;
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
