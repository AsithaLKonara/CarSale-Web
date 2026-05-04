'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollStory = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for background
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Car reveal and movement
      gsap.fromTo(carRef.current, 
        { x: -100, opacity: 0, rotate: -5 },
        { 
          x: 0, opacity: 1, rotate: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          }
        }
      );

      // Text reveal
      gsap.fromTo(textRef.current, 
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="scroll-story" ref={sectionRef}>
      <div className="bg-layer" ref={bgRef}></div>
      
      <div className="content-wrapper">
        <div className="car-reveal" ref={carRef}>
          <img src="https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200" alt="Supercar" />
        </div>
        
        <div className="text-content" ref={textRef}>
          <h2>AERODYNAMICS <br/><span>REDEFINED</span></h2>
          <p>Every curve serves a purpose. The active aerodynamics system adjusts in real-time to provide maximum downforce and minimal drag.</p>
          <div className="stats">
            <div className="stat">
              <span className="label">Drag Coeff</span>
              <span className="value">0.278 Cd</span>
            </div>
            <div className="stat">
              <span className="label">Downforce</span>
              <span className="value">1000kg+</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scroll-story {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 0;
          background: #0a0a0a;
          overflow: hidden;
        }

        .bg-layer {
          position: absolute;
          top: -20%;
          left: 0;
          width: 100%;
          height: 140%;
          background: radial-gradient(circle at 70% 50%, rgba(255, 62, 62, 0.1) 0%, transparent 50%);
          z-index: 1;
        }

        .content-wrapper {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          z-index: 2;
        }

        .car-reveal img {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
          border-radius: 12px;
        }

        .text-content {
          color: #fff;
        }

        h2 {
          font-size: 60px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 24px;
        }

        h2 span {
          color: var(--accent, #ff3e3e);
        }

        p {
          font-size: 18px;
          color: #a1a1aa;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .stats {
          display: flex;
          gap: 40px;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 12px;
          text-transform: uppercase;
          color: #71717a;
          letter-spacing: 1px;
        }

        .value {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .stats {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default ScrollStory;
