'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <section className="page-header">
        <video autoPlay muted loop playsInline className="header-video">
          <source src="/12698077_1356_720_24fps.mp4" type="video/mp4" />
        </video>
        <div className="container header-content">
          <h1>THE <span>LEGACY</span></h1>
          <p>Founded on a passion for performance and a relentless pursuit of perfection.</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="content-grid">
            <div className="text-side">
              <h2>A VISION OF <span>LUXURY</span></h2>
              <p>For over two decades, UltraDrive has been the trusted partner for the world's most discerning collectors. We don't just sell cars; we curate masterpieces of engineering.</p>
              <p>Our global network and deep manufacturer relationships allow us to source the rarest and most sought-after supercars before they ever hit the public market.</p>
            </div>
            <div className="image-side">
              <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800" alt="Luxury Showroom" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="container">
          <div className="grid">
            <div className="stat">
              <span className="number">20+</span>
              <span className="label">Years Excellence</span>
            </div>
            <div className="stat">
              <span className="number">500+</span>
              <span className="label">Cars Delivered</span>
            </div>
            <div className="stat">
              <span className="number">12</span>
              <span className="label">Global Locations</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-wrapper {
          padding-top: 80px;
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

        .about-content {
          padding: 100px 0;
          background: #050505;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .text-side h2 {
          font-size: 40px;
          color: #fff;
          margin-bottom: 30px;
        }

        .text-side h2 span {
          color: var(--accent, #ff3e3e);
        }

        .text-side p {
          margin-bottom: 24px;
          text-align: left;
        }

        .image-side img {
          width: 100%;
          border-radius: 12px;
          filter: grayscale(0.5);
        }

        .stats-grid {
          padding: 80px 0;
          background: #111;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .number {
          font-size: 48px;
          font-weight: 900;
          color: var(--accent, #ff3e3e);
        }

        .label {
          font-size: 14px;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 10px;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .text-side p {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
