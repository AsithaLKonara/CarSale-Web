'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinematicReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        }
      });

      tl.fromTo(silhouetteRef.current, 
        { opacity: 0, scale: 1.1 }, 
        { opacity: 1, scale: 1, duration: 1 }
      )
      .fromTo(lightRef.current, 
        { left: '-100%' }, 
        { left: '200%', duration: 2, ease: 'power2.inOut' }, 
        '-=0.5'
      )
      .fromTo(textRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        '-=1.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cinematic-reveal" ref={containerRef}>
      <div className="dark-overlay"></div>
      
      <div className="video-wrapper" ref={silhouetteRef}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="reveal-video"
        >
          <source src="/12698153_1356_720_24fps.mp4" type="video/mp4" />
        </video>
        <div className="light-sweep" ref={lightRef}></div>
      </div>

      <div className="reveal-content" ref={textRef}>
        <h2>BORN ON THE TRACK</h2>
        <p>FORGED FOR THE ROAD</p>
      </div>

      <style jsx>{`
        .cinematic-reveal {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .dark-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%);
          z-index: 2;
        }

        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .reveal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.4) contrast(1.1);
        }

        .light-sweep {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-20deg);
          z-index: 3;
          pointer-events: none;
        }

        .reveal-content {
          position: absolute;
          bottom: 15%;
          text-align: center;
          z-index: 4;
          color: #fff;
        }

        h2 {
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 900;
          letter-spacing: 10px;
          margin-bottom: 10px;
        }

        p {
          font-size: 14px;
          letter-spacing: 5px;
          color: var(--accent, #ff3e3e);
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
};

export default CinematicReveal;
