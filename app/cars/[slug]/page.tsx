'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Zap, Cpu, Shield, Gauge, Timer } from 'lucide-react';
import Link from 'next/link';

const carData: Record<string, any> = {
  'koenigsegg-jesko': {
    name: 'Koenigsegg Jesko',
    price: '$3,000,000',
    description: 'The Jesko is Koenigsegg’s all-new hypercar that was designed to be the ultimate track-focused car for the road. It features a redesigned 5.0 liter twin-turbo V8 engine and a revolutionary 9-speed Light Speed Transmission.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
    specs: [
      { label: 'Top Speed', value: '300+ MPH', icon: <Gauge /> },
      { label: 'Horsepower', value: '1600 HP', icon: <Zap /> },
      { label: '0-100 km/h', value: '2.5s', icon: <Timer /> },
      { label: 'Transmission', value: '9-Speed LST', icon: <Cpu /> }
    ]
  },
  'lamborghini-revuelto': {
    name: 'Lamborghini Revuelto',
    price: '$608,000',
    description: 'The first V12 hybrid plug-in HPEV (High Performance Electrified Vehicle) supercar. Defining a new paradigm in terms of performance, sportiness and driving pleasure.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000',
    specs: [
      { label: 'Top Speed', value: '217 MPH', icon: <Gauge /> },
      { label: 'Horsepower', value: '1001 HP', icon: <Zap /> },
      { label: '0-100 km/h', value: '2.5s', icon: <Timer /> },
      { label: 'Powertrain', value: 'V12 Hybrid', icon: <Cpu /> }
    ]
  },
  // Add more cars as needed...
};

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const car = carData[slug] || carData['koenigsegg-jesko']; // Fallback for demo

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <div className="hero-image" style={{ backgroundImage: `url(${car.image})` }}>
          <div className="overlay"></div>
        </div>
        <div className="container">
          <Link href="/inventory" className="back-link">
            <ArrowLeft size={20} /> Back to Inventory
          </Link>
          <div className="hero-content">
            <h1>{car.name}</h1>
            <p className="price">{car.price}</p>
          </div>
        </div>
      </div>

      <section className="specs-section">
        <div className="container">
          <div className="specs-grid">
            {car.specs.map((spec: any, index: number) => (
              <div className="spec-card" key={index}>
                <div className="icon">{spec.icon}</div>
                <span className="value">{spec.value}</span>
                <span className="label">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="description-section">
        <div className="container">
          <div className="content-grid">
            <div className="description">
              <h2>THE <span>UNRIVALED</span> MACHINE</h2>
              <p>{car.description}</p>
              <button className="primary-btn">Book an Appointment</button>
            </div>
            <div className="tech-info">
              <div className="info-item">
                <Shield size={24} />
                <div>
                  <h4>5 Year Warranty</h4>
                  <p>Comprehensive coverage for ultimate peace of mind.</p>
                </div>
              </div>
              <div className="info-item">
                <Cpu size={24} />
                <div>
                  <h4>Bespoke Engineering</h4>
                  <p>Every component is handcrafted to your exact specifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-wrapper {
          padding-top: 0;
        }

        .hero-section {
          position: relative;
          height: 80vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          color: #fff;
        }

        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          z-index: -1;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, #050505 0%, transparent 50%, rgba(0,0,0,0.4) 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          width: 100%;
        }

        .back-link {
          position: absolute;
          top: 100px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .back-link:hover {
          transform: translateX(-5px);
        }

        .hero-content h1 {
          font-size: clamp(48px, 10vw, 120px);
          font-weight: 900;
          margin-bottom: 10px;
          line-height: 0.9;
        }

        .price {
          font-size: 32px;
          color: var(--accent, #ff3e3e);
          font-weight: 800;
        }

        .specs-section {
          background: #050505;
          padding: 60px 0;
          margin-top: -80px;
          position: relative;
          z-index: 5;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .spec-card {
          background: #0a0a0a;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .spec-card .icon {
          color: var(--accent, #ff3e3e);
          margin-bottom: 20px;
        }

        .spec-card .value {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 5px;
        }

        .spec-card .label {
          font-size: 12px;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .description-section {
          padding: 100px 0;
          background: #050505;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 100px;
        }

        .description h2 {
          font-size: 40px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 30px;
        }

        .description h2 span {
          color: var(--accent, #ff3e3e);
        }

        .description p {
          font-size: 18px;
          color: #a1a1aa;
          line-height: 1.8;
          margin-bottom: 40px;
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
        }

        .tech-info {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .info-item {
          display: flex;
          gap: 20px;
          color: #fff;
        }

        .info-item h4 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .info-item p {
          font-size: 14px;
          color: #a1a1aa;
        }

        @media (max-width: 1024px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
        }
      `}</style>
    </div>
  );
}
