'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Zap, Cpu, Gauge, Timer, Shield, Info } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface CarSpec {
  id: string;
  label: string;
  value: string;
}

interface CarImage {
  id: string;
  url: string;
  type: string;
}

interface CarType {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: string;
  description: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  zeroTo100: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  status: string;
  images: CarImage[];
  specs: CarSpec[];
}

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/cars/${slug}`);
        if (response.data?.data?.car) {
          setCar(response.data.data.car);
        }
      } catch (err) {
        console.error('Failed to query model specs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCarDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-wrapper skeleton-wrapper">
        <div className="skeleton-hero shimmer"></div>
        <div className="container" style={{ marginTop: '40px' }}>
          <div className="skeleton-grid">
            <div className="shimmer skeleton-box"></div>
            <div className="shimmer skeleton-box"></div>
            <div className="shimmer skeleton-box"></div>
            <div className="shimmer skeleton-box"></div>
          </div>
          <div className="skeleton-details">
            <div className="shimmer skeleton-title"></div>
            <div className="shimmer skeleton-text"></div>
            <div className="shimmer skeleton-text"></div>
          </div>
        </div>
        <style jsx>{`
          .skeleton-wrapper {
            background: #050505;
            min-height: 100vh;
            padding-bottom: 80px;
          }
          .skeleton-hero {
            height: 60vh;
            width: 100%;
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .skeleton-box {
            height: 120px;
            border-radius: 8px;
          }
          .skeleton-details {
            max-width: 800px;
          }
          .skeleton-title {
            width: 300px;
            height: 36px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          .skeleton-text {
            width: 100%;
            height: 18px;
            margin-bottom: 12px;
            border-radius: 4px;
          }
          .shimmer {
            background: linear-gradient(90deg, #0c0c0f 25%, #181822 50%, #0c0c0f 75%);
            background-size: 200% 100%;
            animation: shimmerEffect 1.5s infinite;
          }
          @keyframes shimmerEffect {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 768px) {
            .skeleton-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="page-wrapper error-wrapper">
        <div className="container">
          <div className="error-card">
            <Info size={40} className="error-icon" />
            <h2>Model Specifications Sealed</h2>
            <p>The requested high-performance vehicle details are currently private or unavailable.</p>
            <Link href="/inventory" className="back-btn">
              Return to Catalog
            </Link>
          </div>
        </div>
        <style jsx>{`
          .error-wrapper {
            background: #050505;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-card {
            text-align: center;
            background: #0c0c0f;
            border: 1px solid rgba(255, 62, 62, 0.15);
            padding: 50px 40px;
            border-radius: 12px;
            max-width: 500px;
            margin: 0 auto;
          }
          .error-icon {
            color: #ff3e3e;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 24px;
            color: #fff;
            margin-bottom: 10px;
            font-weight: 700;
          }
          p {
            color: #8f8f9e;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .back-btn {
            background: #ff3e3e;
            color: #fff;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: opacity 0.2s;
          }
          .back-btn:hover {
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  const images = car.images?.length > 0 ? car.images : [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000', type: 'hero' }];
  const heroImage = images.find(img => img.type === 'hero')?.url || images[0].url;

  // Compile standard summary specs dynamically
  const summarySpecs = [
    { label: 'Top Speed', value: car.topSpeed ? `${car.topSpeed} MPH` : 'N/A', icon: <Gauge size={20} /> },
    { label: 'Output', value: car.horsepower ? `${car.horsepower} HP` : 'N/A', icon: <Zap size={20} /> },
    { label: 'Acceleration', value: car.zeroTo100 ? `${car.zeroTo100}s` : 'N/A', icon: <Timer size={20} /> },
    { label: 'Transmission', value: car.transmission || 'Automatic', icon: <Cpu size={20} /> }
  ];

  const isSold = car.status === 'sold';

  return (
    <div className="page-wrapper">
      {/* Dynamic SEO JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Car',
            'name': `${car.brand} ${car.name}`,
            'image': heroImage,
            'description': car.description,
            'brand': {
              '@type': 'Brand',
              'name': car.brand,
            },
            'offers': {
              '@type': 'Offer',
              'price': isSold ? undefined : (car.price ? car.price.replace(/[^0-9]/g, '') : '250000'),
              'priceCurrency': 'USD',
              'availability': isSold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            },
          }),
        }}
      />

      <div className="hero-section">
        <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="overlay"></div>
        </div>
        <div className="container">
          <Link href="/inventory" className="back-link">
            <ArrowLeft size={18} /> Back to Catalog
          </Link>
          <div className="hero-content">
            <span className="brand-badge">{car.brand}</span>
            <h1>{car.name}</h1>
            <p className="price">{isSold ? 'SOLD / PRIVATE COLLECTION' : car.price || 'Inquire for Pricing'}</p>
          </div>
        </div>
      </div>

      <section className="specs-summary">
        <div className="container">
          <div className="specs-grid">
            {summarySpecs.map((spec, index) => (
              <div className="spec-card" key={index}>
                <div className="icon">{spec.icon}</div>
                <span className="value">{spec.value}</span>
                <span className="label">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual story gallery */}
      {images.length > 1 && (
        <section className="gallery-section">
          <div className="container">
            <div className="section-header">
              <h2>VISUAL <span>STORY</span></h2>
              <p>Explore this machine from every performance perspective.</p>
            </div>
            <div className="gallery-main">
              <div className="main-image-container">
                <img src={images[activeImg].url} alt={`${car.brand} ${car.name}`} className="main-image" />
              </div>
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <div 
                    key={img.url} 
                    className={`thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img.url} alt={`Angle ${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="details-section">
        <div className="container">
          <div className="content-grid">
            <div className="description">
              <h2>THE <span>UNRIVALED</span> MACHINE</h2>
              <p className="desc-paragraph">{car.description}</p>
              
              {isSold ? (
                <div className="sold-notice">
                  <Shield size={20} className="shield-icon" />
                  <div>
                    <h4>Marked Sold</h4>
                    <p>This exclusive build has been registered under private ownership and is closed for registration.</p>
                  </div>
                </div>
              ) : (
                <Link href="/book">
                  <button className="primary-btn">Schedule VIP Showroom Private Viewing</button>
                </Link>
              )}
            </div>

            <div className="full-specs">
              <h3>Technical Specifications</h3>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-key">Year</span>
                  <span className="spec-value">{car.year}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-key">Mileage</span>
                  <span className="spec-value">{car.mileage.toLocaleString()} miles</span>
                </div>
                <div className="spec-item">
                  <span className="spec-key">Fuel Type</span>
                  <span className="spec-value">{car.fuelType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-key">Condition</span>
                  <span className="spec-value">{car.condition}</span>
                </div>
                {car.specs?.map((spec) => (
                  <div className="spec-item" key={spec.id}>
                    <span className="spec-key">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
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
          height: 85vh;
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
          inset: 0;
          background: linear-gradient(to top, #050505 0%, transparent 60%, rgba(0,0,0,0.5) 100%);
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
          z-index: 100;
          transition: all 0.3s ease;
          background: rgba(0,0,0,0.5);
          padding: 10px 20px;
          border-radius: 30px;
          backdrop-filter: blur(5px);
          font-size: 13px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .back-link:hover {
          transform: translateX(-5px);
          background: var(--accent, #ff3e3e);
          border-color: var(--accent, #ff3e3e);
        }

        .brand-badge {
          color: var(--accent, #ff3e3e);
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .hero-content h1 {
          font-size: clamp(36px, 8vw, 90px);
          font-weight: 900;
          margin-bottom: 10px;
          line-height: 0.95;
          letter-spacing: -1px;
        }

        .price {
          font-size: 24px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .specs-summary {
          background: #050505;
          padding: 40px 0;
          margin-top: -60px;
          position: relative;
          z-index: 50;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          overflow: hidden;
        }

        .spec-card {
          background: #0c0c10;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .spec-card .icon {
          color: var(--accent, #ff3e3e);
          margin-bottom: 15px;
        }

        .spec-card .value {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 5px;
        }

        .spec-card .label {
          font-size: 11px;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .gallery-section {
          padding: 80px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-header {
          text-align: center;
          margin-bottom: 45px;
        }

        .section-header h2 {
          font-size: 32px;
          color: #fff;
          font-weight: 900;
        }

        .section-header span {
          color: var(--accent, #ff3e3e);
        }

        .section-header p {
          color: #71717a;
          margin-top: 8px;
          font-size: 14px;
        }

        .gallery-main {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .main-image-container {
          width: 100%;
          height: 550px;
          border-radius: 8px;
          overflow: hidden;
          background: #09090c;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }

        .thumb {
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          opacity: 0.4;
          transition: all 0.25s ease;
          border: 1.5px solid transparent;
          height: 65px;
        }

        .thumb.active, .thumb:hover {
          opacity: 1;
          border-color: var(--accent, #ff3e3e);
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-section {
          padding: 100px 0;
          background: #09090c;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        .description h2 {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 25px;
        }

        .description h2 span {
          color: var(--accent, #ff3e3e);
        }

        .desc-paragraph {
          font-size: 16px;
          color: #a1a1aa;
          line-height: 1.8;
          margin-bottom: 35px;
        }

        .primary-btn {
          padding: 15px 35px;
          background: var(--accent, #ff3e3e);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          background: #e63535;
          box-shadow: 0 5px 20px rgba(255, 62, 62, 0.25);
        }

        .sold-notice {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 20px;
          border-radius: 8px;
        }

        .shield-icon {
          color: #ef4444;
          margin-top: 2px;
        }

        .sold-notice h4 {
          color: #fff;
          font-size: 15px;
          font-weight: 700;
        }

        .sold-notice p {
          color: #a1a1aa;
          font-size: 13px;
          line-height: 1.5;
          margin-top: 4px;
        }

        .full-specs h3 {
          font-size: 20px;
          color: #fff;
          margin-bottom: 25px;
          font-weight: 700;
          border-bottom: 2px solid var(--accent, #ff3e3e);
          padding-bottom: 8px;
          display: inline-block;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
        }

        .spec-key {
          color: #71717a;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .spec-value {
          color: #f4f4f5;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }
          .main-image-container {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .back-link {
            top: 40px;
            left: 20px;
          }
          .hero-section {
            height: 70vh;
          }
        }
      `}</style>
    </div>
  );
}
