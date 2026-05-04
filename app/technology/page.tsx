'use client';

import React from 'react';
import CinematicReveal from '@/components/CinematicReveal';

export default function TechnologyPage() {
  return (
    <div className="page-wrapper">
      <section className="page-header">
        <div className="container">
          <h1>FUTURE <span>TECHNOLOGY</span></h1>
          <p>Intelligence at the edge of performance. Experience the software and hardware innovations of tomorrow.</p>
        </div>
      </section>

      <CinematicReveal />
      
      <section className="tech-details">
        <div className="container">
          <div className="tech-grid">
            <div className="tech-card">
              <h3>AI Dynamics</h3>
              <p>Real-time machine learning algorithms that adapt to your driving style and road conditions in milliseconds.</p>
            </div>
            <div className="tech-card">
              <h3>Active Aero</h3>
              <p>Intelligent wing and flap systems that manage airflow for optimal downforce or maximum top speed.</p>
            </div>
            <div className="tech-card">
              <h3>Smart Connectivity</h3>
              <p>Seamless integration with your digital life, providing real-time telemetry and global concierge access.</p>
            </div>
          </div>
        </div>
      </section>

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

        .tech-details {
          padding: 100px 0;
          background: #050505;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .tech-card {
          padding: 40px;
          background: #111;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tech-card h3 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 20px;
        }

        .tech-card p {
          color: #a1a1aa;
          font-size: 16px;
        }

        @media (max-width: 1024px) {
          .tech-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
