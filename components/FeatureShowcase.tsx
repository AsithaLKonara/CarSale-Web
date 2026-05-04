'use client';

import React from 'react';
import { Zap, Shield, Cpu } from 'lucide-react';

const features = [
  {
    title: '5.0L TWIN TURBO V8',
    description: '1600 HP on E85 biofuel. The world\'s most power-dense production engine.',
    icon: <Zap className="icon" />,
    image: 'https://images.unsplash.com/photo-1598553907572-c27b00da0d13?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'ACTIVE CHASSIS',
    description: 'Formula 1 inspired suspension that adjusts 1000 times per second.',
    icon: <Cpu className="icon" />,
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'SAFETY SYSTEM',
    description: 'Full carbon fiber monocoque with integrated roll cage for ultimate protection.',
    icon: <Shield className="icon" />,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  }
];

const FeatureShowcase = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="header">
          <h2>UNRIVALED <span>ENGINEERING</span></h2>
          <p>Cutting edge technology meets artisanal craftsmanship in every detail.</p>
        </div>

        <div className="grid">
          {features.map((feature, index) => (
            <div className="card" key={index}>
              <div className="card-image">
                <img src={feature.image} alt={feature.title} />
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <div className="icon-wrapper">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features {
          padding: 120px 0;
          background: #050505;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 80px;
        }

        h2 {
          font-size: 48px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
        }

        h2 span {
          color: var(--accent, #ff3e3e);
        }

        .header p {
          color: #71717a;
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .card {
          position: relative;
          background: #111;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 62, 62, 0.3);
        }

        .card-image {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .card:hover .card-image img {
          transform: scale(1.1);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(5, 5, 5, 0.8) 100%);
        }

        .card-content {
          padding: 30px;
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          background: var(--accent-muted, rgba(255, 62, 62, 0.1));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: var(--accent, #ff3e3e);
        }

        h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .card-content p {
          color: #a1a1aa;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default FeatureShowcase;
