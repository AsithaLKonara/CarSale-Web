'use client';

import React from 'react';
import InventoryGrid from '@/components/InventoryGrid';

export default function InventoryPage() {
  return (
    <div className="page-wrapper">
      <section className="page-header">
        <div className="container">
          <h1>OUR <span>INVENTORY</span></h1>
          <p>Explore our curated collection of the world's most exceptional automobiles. From track-focused hypercars to elegant grand tourers.</p>
        </div>
      </section>
      
      <InventoryGrid />

      <style jsx>{`
        .page-wrapper {
          padding-top: 80px; /* Navbar height */
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
