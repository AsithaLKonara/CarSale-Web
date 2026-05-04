'use client';

import React, { useEffect, useRef } from 'react';
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
        {/* Placeholder for cinematic video or high-res image */}
        <div className="bg-image"></div>
      </div>

      <div className="hero-content">
        <h1 ref={titleRef}>POWER MEETS <br/><span>PRECISION</span></h1>
        <p ref={subtitleRef}>Experience the pinnacle of automotive engineering with our curated selection of supercars.</p>
        <div className="cta-group" ref={ctaRef}>
          <button className="primary-btn">Explore Models</button>
          <button className="secondary-btn">Book Test Drive</button>
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

        .bg-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(5, 5, 5, 0.4), rgba(5, 5, 5, 0.4)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-position: center;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(5, 5, 5, 0.8) 100%);
        }

        .hero-content {
          text-align: center;
          color: #fff;
          max-width: 900px;
          padding: 0 20px;
          z-index: 10;
        }

        h1 {
          font-size: clamp(48px, 8vw, 100px);
          font-weight: 900;
          line-height: 0.9;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }

        h1 span {
          color: var(--accent, #ff3e3e);
          -webkit-text-stroke: 1px #fff;
          color: transparent;
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
