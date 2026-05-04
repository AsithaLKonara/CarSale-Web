'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Zap, Cpu, Shield, Gauge, Timer, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const carData: Record<string, any> = {
  'koenigsegg-jesko': {
    name: 'Koenigsegg Jesko',
    price: '$3,000,000',
    description: 'The Jesko is Koenigsegg’s all-new hypercar that was designed to be the ultimate track-focused car for the road. It features a redesigned 5.0 liter twin-turbo V8 engine and a revolutionary 9-speed Light Speed Transmission.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1603584173870-7f3ca935fb64?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544636331-e268592033c2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { label: 'Top Speed', value: '300+ MPH', icon: <Gauge /> },
      { label: 'Horsepower', value: '1600 HP', icon: <Zap /> },
      { label: '0-100 km/h', value: '2.5s', icon: <Timer /> },
      { label: 'Transmission', value: '9-Speed LST', icon: <Cpu /> }
    ],
    fullSpecs: {
      "Engine": "5.0L V8 Twin-Turbo",
      "Power": "1280 hp (gasoline) / 1600 hp (E85)",
      "Torque": "1500 Nm at 5100 rpm",
      "Transmission": "9-speed Koenigsegg LST",
      "Dimensions": "4610mm L x 2030mm W x 1210mm H",
      "Weight": "1420 kg (Curb weight)",
      "Brakes": "Ventilated Ceramic Discs",
      "Tires": "Michelin Pilot Sport Cup 2"
    }
  },
  'lamborghini-revuelto': {
    name: 'Lamborghini Revuelto',
    price: '$608,000',
    description: 'The first V12 hybrid plug-in HPEV (High Performance Electrified Vehicle) supercar. Defining a new paradigm in terms of performance, sportiness and driving pleasure.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544636331-e268592033c2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1603584173870-7f3ca935fb64?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { label: 'Top Speed', value: '217 MPH', icon: <Gauge /> },
      { label: 'Horsepower', value: '1001 HP', icon: <Zap /> },
      { label: '0-100 km/h', value: '2.5s', icon: <Timer /> },
      { label: 'Powertrain', value: 'V12 Hybrid', icon: <Cpu /> }
    ],
    fullSpecs: {
      "Engine": "6.5L V12 + 3 Electric Motors",
      "Power": "1001 CV / 1015 hp",
      "Torque": "725 Nm (engine) + 350 Nm (electric)",
      "Transmission": "8-speed dual-clutch",
      "Dimensions": "4947mm L x 2266mm W x 1160mm H",
      "Weight": "1772 kg",
      "Brakes": "CCB+ (Carbon Ceramic Brakes Plus)",
      "Tires": "Bridgestone Potenza Sport"
    }
  }
};

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const car = carData[slug] || carData['koenigsegg-jesko'];
  const [activeImg, setActiveImg] = useState(0);

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

      <section className="specs-summary">
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

      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>VISUAL <span>STORY</span></h2>
            <p>Every angle captured in stunning high definition.</p>
          </div>
          <div className="gallery-main">
            <img src={car.gallery[activeImg]} alt="Main View" className="main-image" />
            <div className="gallery-thumbs">
              {car.gallery.map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="details-section">
        <div className="container">
          <div className="content-grid">
            <div className="description">
              <h2>THE <span>UNRIVALED</span> MACHINE</h2>
              <p>{car.description}</p>
              <Link href="/book">
                <button className="primary-btn">Book an Appointment</button>
              </Link>
            </div>
            <div className="full-specs">
              <h3>Technical Specifications</h3>
              <div className="specs-list">
                {Object.entries(car.fullSpecs).map(([key, value]) => (
                  <div className="spec-item" key={key}>
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-wrapper {
          padding-top: 0;
          background: #050505;
        }

        .hero-section {
          position: relative;
          height: 90vh;
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
          z-index: 100; /* Fixed z-index */
          transition: transform 0.3s ease;
          background: rgba(0,0,0,0.5);
          padding: 10px 20px;
          border-radius: 30px;
          backdrop-filter: blur(5px);
        }

        .back-link:hover {
          transform: translateX(-5px);
          background: var(--accent, #ff3e3e);
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

        .specs-summary {
          background: #050505;
          padding: 60px 0;
          margin-top: -80px;
          position: relative;
          z-index: 50;
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

        .gallery-section {
          padding: 100px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 40px;
          color: #fff;
        }

        .section-header span {
          color: var(--accent, #ff3e3e);
        }

        .gallery-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .main-image {
          width: 100%;
          height: 600px;
          object-fit: cover;
          border-radius: 12px;
        }

        .gallery-thumbs {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 15px;
        }

        .thumb {
          cursor: pointer;
          border-radius: 6px;
          overflow: hidden;
          opacity: 0.5;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .thumb.active, .thumb:hover {
          opacity: 1;
          border-color: var(--accent, #ff3e3e);
        }

        .thumb img {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }

        .details-section {
          padding: 100px 0;
          background: #0a0a0a;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          transition: transform 0.3s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          background: #e63535;
        }

        .full-specs h3 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--accent, #ff3e3e);
          padding-bottom: 10px;
          display: inline-block;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .spec-key {
          color: #71717a;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .spec-value {
          color: #fff;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .gallery-thumbs {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
