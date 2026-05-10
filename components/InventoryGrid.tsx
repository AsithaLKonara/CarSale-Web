'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';

interface CarSpec {
  label: string;
  value: string;
}

interface CarImage {
  url: string;
  type: string;
}

interface CarType {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: string;
  category: string;
  status: string;
  images: CarImage[];
  specs: CarSpec[];
}

const InventoryGrid = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch from live database API
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 12,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeCategory) params.category = activeCategory;

        const response = await api.get('/cars', { params });
        if (response.data?.cars) {
          setCars(response.data.cars);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error('Failed to load active catalog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [debouncedSearch, activeCategory, page]);

  const categories = [
    { label: 'All Models', value: '' },
    { label: 'Track Focused', value: 'track' },
    { label: 'Daily Drivers', value: 'daily' },
    { label: 'Luxury & Hypercars', value: 'luxury' },
  ];

  return (
    <section className="inventory" id="showroom">
      <div className="container">
        <div className="header-bar">
          <div className="title-area">
            <h2>AVAILABLE <span>INVENTORY</span></h2>
            <p className="subtitle">Explore our curated selection of premium race-track and hypercar models</p>
          </div>

          <div className="controls">
            {/* Search Box */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search specs, brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter Chips */}
            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className={activeCategory === cat.value ? 'active' : ''}
                  onClick={() => {
                    setActiveCategory(cat.value);
                    setPage(1);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shimmering Skeleton Loader Screen */}
        {loading ? (
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="car-card skeleton" key={i}>
                <div className="shimmer img-shimmer"></div>
                <div className="details">
                  <div className="top">
                    <div className="shimmer line title-line"></div>
                    <div className="shimmer line price-line"></div>
                  </div>
                  <div className="specs-shimmer">
                    <div className="shimmer line spec-line"></div>
                    <div className="shimmer line spec-line"></div>
                  </div>
                  <div className="shimmer line btn-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <p>No high-performance vehicles match your active search terms.</p>
            <button className="reset-btn" onClick={() => { setSearch(''); setActiveCategory(''); setPage(1); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid">
              {cars.map((car) => {
                const isSold = car.status === 'sold';
                const heroImage = car.images?.find(img => img.type === 'hero')?.url || 
                                  car.images?.[0]?.url || 
                                  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800';

                // Find top speed and power specs
                const speedSpec = car.specs?.find(s => s.label.toLowerCase().includes('speed'))?.value || 
                                  (car as any).topSpeed ? `${(car as any).topSpeed} MPH` : 'N/A';
                const powerSpec = car.specs?.find(s => s.label.toLowerCase().includes('power') || s.label.toLowerCase().includes('horsepower'))?.value || 
                                  (car as any).horsepower ? `${(car as any).horsepower} HP` : 'N/A';

                return (
                  <div className={`car-card ${isSold ? 'sold-out' : ''}`} key={car.id}>
                    <div className="img-container">
                      <img src={heroImage} alt={car.name} />
                      {isSold ? (
                        <div className="sold-overlay">
                          <span className="sold-badge">SOLD</span>
                        </div>
                      ) : car.status === 'reserved' ? (
                        <div className="badge reserved">RESERVED</div>
                      ) : (
                        <div className="badge">AVAILABLE</div>
                      )}
                    </div>
                    <div className="details">
                      <div className="top">
                        <div className="title-group">
                          <span className="brand-label">{car.brand}</span>
                          <h3>{car.name}</h3>
                        </div>
                        <span className="price">{isSold ? 'SOLD / ARCHIVED' : car.price || 'Inquire'}</span>
                      </div>
                      <div className="specs">
                        <div className="spec">
                          <span className="label">Top Speed</span>
                          <span className="value">{speedSpec}</span>
                        </div>
                        <div className="spec">
                          <span className="label">Output</span>
                          <span className="value">{powerSpec}</span>
                        </div>
                      </div>
                      <Link href={`/cars/${car.slug}`} className="view-link">
                        <button className="view-btn">
                          {isSold ? 'View Spec Sheet' : 'Explore Specifications'} <ArrowRight size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="pag-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="pag-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="pag-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .inventory {
          padding: 120px 0;
          background: #060608;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 30px;
        }

        .title-area h2 {
          font-size: 36px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .title-area h2 span {
          color: var(--accent, #ff3e3e);
        }

        .subtitle {
          color: #71717a;
          font-size: 14px;
          margin-top: 8px;
        }

        .controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
        }

        .search-box {
          position: relative;
          width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
        }

        .search-box input {
          width: 100%;
          background: #111115;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 10px 12px 10px 38px;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          border-color: var(--accent, #ff3e3e);
          box-shadow: 0 0 10px rgba(255, 62, 62, 0.15);
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .filters button {
          background: #111115;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          padding: 8px 18px;
          border-radius: 40px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.25s ease;
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
          background: #0e0e12;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .car-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 62, 62, 0.3);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
        }

        .car-card.sold-out {
          opacity: 0.65;
        }

        .img-container {
          position: relative;
          height: 240px;
          background: #050507;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .car-card:hover .img-container img {
          transform: scale(1.04);
        }

        .sold-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sold-badge {
          background: transparent;
          color: #ef4444;
          border: 3px solid #ef4444;
          padding: 8px 24px;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 4px;
          border-radius: 6px;
          transform: rotate(-10deg);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
        }

        .badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #10b981;
          color: #fff;
          padding: 4px 12px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .badge.reserved {
          background: #f59e0b;
        }

        .details {
          padding: 24px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .brand-label {
          color: #71717a;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
        }

        h3 {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-top: 3px;
        }

        .price {
          color: var(--accent, #ff3e3e);
          font-weight: 800;
          font-size: 15px;
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
          color: #52525b;
          text-transform: uppercase;
          font-weight: 600;
        }

        .value {
          font-size: 15px;
          font-weight: 600;
          color: #e4e4e7;
          margin-top: 2px;
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
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 50px;
        }

        .pag-btn {
          background: #111115;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pag-btn:hover:not(:disabled) {
          border-color: var(--accent, #ff3e3e);
          color: var(--accent, #ff3e3e);
        }

        .pag-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pag-info {
          font-size: 13px;
          color: #a1a1aa;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #0e0e12;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .empty-state p {
          color: #a1a1aa;
          font-size: 15px;
        }

        .reset-btn {
          margin-top: 20px;
          background: var(--accent, #ff3e3e);
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .reset-btn:hover {
          opacity: 0.9;
        }

        /* Shimmering Loading Effects */
        .shimmer {
          background: linear-gradient(
            90deg,
            #141418 25%,
            #22222a 50%,
            #141418 75%
          );
          background-size: 200% 100%;
          animation: loadingShimmer 1.5s infinite;
        }

        @keyframes loadingShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .skeleton {
          border-color: rgba(255, 255, 255, 0.03) !important;
          pointer-events: none;
        }

        .img-shimmer {
          height: 240px;
          width: 100%;
        }

        .line {
          height: 14px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .title-line {
          width: 140px;
          height: 18px;
        }

        .price-line {
          width: 80px;
          height: 18px;
        }

        .specs-shimmer {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding: 15px 0;
          margin: 15px 0;
        }

        .spec-line {
          width: 90%;
          height: 12px;
          margin-bottom: 10px;
        }

        .btn-shimmer {
          width: 100%;
          height: 38px;
          border-radius: 6px;
        }

        @media (max-width: 992px) {
          .header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .controls {
            align-items: flex-start;
            width: 100%;
          }
          .search-box {
            width: 100%;
          }
          .filters {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 5px;
          }
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default InventoryGrid;
