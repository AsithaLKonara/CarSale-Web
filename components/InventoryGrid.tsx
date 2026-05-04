'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cars = [
  {
    name: 'Koenigsegg Jesko',
    slug: 'koenigsegg-jesko',
    price: '$3,000,000',
    stats: { speed: '300+ MPH', power: '1600 HP' },
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Lamborghini Revuelto',
    slug: 'lamborghini-revuelto',
    price: '$608,000',
    stats: { speed: '217 MPH', power: '1001 HP' },
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'McLaren 750S',
    slug: 'mclaren-750s',
    price: '$324,000',
    stats: { speed: '206 MPH', power: '740 HP' },
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Ford Mustang Dark Horse',
    slug: 'mustang-dark-horse',
    price: '$60,000',
    stats: { speed: '168 MPH', power: '500 HP' },
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'BMW M8 Competition',
    slug: 'bmw-m8',
    price: '$138,000',
    stats: { speed: '190 MPH', power: '617 HP' },
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Audi R8 V10',
    slug: 'audi-r8',
    price: '$209,000',
    stats: { speed: '205 MPH', power: '602 HP' },
    image: 'https://images.unsplash.com/photo-1606148664166-7967a42ad5ad?auto=format&fit=crop&q=80&w=800'
  }
];

const InventoryGrid = () => {
  return (
    <section className="inventory">
      <div className="container">
        <div className="header">
          <h2>AVAILABLE <span>INVENTORY</span></h2>
          <div className="filters">
            <button className="active">All Models</button>
            <button>Track Focused</button>
            <button>Daily Drivers</button>
            <button>Limited Edition</button>
          </div>
        </div>

        <div className="grid">
          {cars.map((car, index) => (
            <div className="car-card" key={index}>
              <div className="img-container">
                <img src={car.image} alt={car.name} />
                <div className="badge">New Arrival</div>
              </div>
              <div className="details">
                <div className="top">
                  <h3>{car.name}</h3>
                  <span className="price">{car.price}</span>
                </div>
                <div className="specs">
                  <div className="spec">
                    <span className="label">Top Speed</span>
                    <span className="value">{car.stats.speed}</span>
                  </div>
                  <div className="spec">
                    <span className="label">Power</span>
                    <span className="value">{car.stats.power}</span>
                  </div>
                </div>
                <Link href={`/cars/${car.slug}`} className="view-link">
                  <button className="view-btn">
                    View Details <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .inventory {
          padding: 100px 0;
          background: #0a0a0a;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
        }

        h2 {
          font-size: 40px;
          font-weight: 900;
          color: #fff;
        }

        h2 span {
          color: var(--accent, #ff3e3e);
        }

        .filters {
          display: flex;
          gap: 15px;
        }

        .filters button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          padding: 8px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .filters button.active, .filters button:hover {
          background: var(--accent, #ff3e3e);
          color: #fff;
          border-color: var(--accent, #ff3e3e);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 30px;
        }

        .car-card {
          background: #111;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s ease;
        }

        .car-card:hover {
          transform: scale(1.02);
        }

        .img-container {
          position: relative;
          height: 250px;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: var(--accent, #ff3e3e);
          color: #fff;
          padding: 4px 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 4px;
        }

        .details {
          padding: 24px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .price {
          color: var(--accent, #ff3e3e);
          font-weight: 700;
        }

        .specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .spec {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 11px;
          color: #71717a;
          text-transform: uppercase;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .view-link {
          width: 100%;
          text-decoration: none;
        }

        .view-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default InventoryGrid;
