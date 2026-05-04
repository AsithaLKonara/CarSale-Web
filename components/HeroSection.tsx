'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';


const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(bgRef.current,
      { scale: 1.2, filter: 'blur(10px)' },
      { scale: 1, filter: 'blur(0px)', duration: 2 }
    )
      .fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=1.5'
      )
      .fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=1'
      )
      .fromTo(ctaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        '-=0.8'
      );
  }, []);

  return (
    <section className="hero" ref={containerRef}>
      <div className="hero-bg" ref={bgRef}>
        <div className="overlay"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="bg-video"
        >
          <source src="/16815338-hd_1366_572_24fps.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-content">
        <h1 ref={titleRef}>POWER MEETS <br /><span>PRECISION</span></h1>
        <p ref={subtitleRef}>Experience the pinnacle of automotive engineering with our curated selection of supercars.</p>
        <div className="cta-group" ref={ctaRef}>
          <Link href="/inventory">
            <button className="primary-btn">Explore Models</button>
          </Link>
          <Link href="/book">
            <button className="secondary-btn">Book a Visit</button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1);
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          z-index: 2;
        }

        .hero-content {
          text-align: center;
          color: #fff;
          max-width: 900px;
          padding: 0 20px;
          z-index: 10;
        }

        h1 {
          font-size: clamp(48px, 8vw, 110px);
          font-weight: 950;
          line-height: 0.85;
          margin-bottom: 24px;
          letter-spacing: -4px;
          text-transform: uppercase;
        }

        h1 span {
          display: block;
          color: transparent;
          -webkit-text-stroke: 2px #fff;
          letter-spacing: 12px;
          margin-top: 20px;
          position: relative;
          opacity: 1;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }

        h1 span::after {
          content: 'PRECISION';
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          color: #fff;
          -webkit-text-stroke: 0;
          opacity: 0.1;
          filter: blur(20px);
        }

        p {
          font-size: 18px;
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .primary-btn {
          padding: 16px 40px;
          background: var(--accent, #ff3e3e);
          color: #fff;
          border: none;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .primary-btn:hover {
          background: #e63535;
          transform: translateY(-2px);
        }

        .secondary-btn {
          padding: 16px 40px;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .cta-group {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
