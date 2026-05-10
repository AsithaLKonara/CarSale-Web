'use client';

import React, { useState } from 'react';

interface FiltersState {
  brand?: string;
  category?: string;
  transmission?: string;
  fuelType?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FiltersState) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilters({ onApplyFilters, onClearFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    brand: '',
    category: '',
    transmission: '',
    fuelType: '',
    yearMin: undefined,
    yearMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  const handleSelectChange = (field: keyof FiltersState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleInputChange = (field: keyof FiltersState, value: string) => {
    const numValue = value ? Number(value) : undefined;
    setFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetState = {
      brand: '',
      category: '',
      transmission: '',
      fuelType: '',
      yearMin: undefined,
      yearMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
    };
    setFilters(resetState);
    onClearFilters();
  };

  return (
    <div className="filters-card-wrapper">
      <div className="filters-header">
        <span className="sparkle">⚡</span>
        <h3>SHOWROOM ADVANCED FILTERS</h3>
      </div>

      <div className="filters-grid">
        {/* Row 1 */}
        <div className="filter-item">
          <label>BRAND/MANUFACTURER</label>
          <input
            type="text"
            placeholder="e.g. Ferrari, McLaren"
            value={filters.brand || ''}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value || undefined })}
          />
        </div>

        <div className="filter-item">
          <label>STABLE CLASS</label>
          <select value={filters.category || ''} onChange={(e) => handleSelectChange('category', e.target.value)}>
            <option value="">ALL CLASSES</option>
            <option value="hypercar">HYPERCAR</option>
            <option value="luxury">LUXURY CRUISER</option>
            <option value="track">TRACK SPECIALIST</option>
          </select>
        </div>

        <div className="filter-item">
          <label>TRANSMISSION</label>
          <select value={filters.transmission || ''} onChange={(e) => handleSelectChange('transmission', e.target.value)}>
            <option value="">ANY GEARBOX</option>
            <option value="automatic">F1 DUAL-CLUTCH</option>
            <option value="manual">6-SPEED MANUAL</option>
          </select>
        </div>

        <div className="filter-item">
          <label>PROPULSION ENGINE</label>
          <select value={filters.fuelType || ''} onChange={(e) => handleSelectChange('fuelType', e.target.value)}>
            <option value="">ANY POWERPLANT</option>
            <option value="petrol">V8 / V12 N/A PETROL</option>
            <option value="hybrid">HYBRID ASSISTED</option>
            <option value="electric">PURE ELECTRIC</option>
          </select>
        </div>

        {/* Row 2 Ranges */}
        <div className="filter-item range-item">
          <label>PRODUCTION YEARS</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min Year"
              value={filters.yearMin || ''}
              onChange={(e) => handleInputChange('yearMin', e.target.value)}
            />
            <span>To</span>
            <input
              type="number"
              placeholder="Max Year"
              value={filters.yearMax || ''}
              onChange={(e) => handleInputChange('yearMax', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-item range-item">
          <label>PRICE ESTIMATES ($)</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin || ''}
              onChange={(e) => handleInputChange('priceMin', e.target.value)}
            />
            <span>To</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax || ''}
              onChange={(e) => handleInputChange('priceMax', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filters-actions-footer">
        <button className="clear-filter-btn" onClick={handleReset}>
          RESET FILTERS
        </button>
        <button className="apply-filter-btn" onClick={handleApply}>
          REFINE FLEET
        </button>
      </div>

      <style jsx>{`
        .filters-card-wrapper {
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        .filters-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          padding-bottom: 0.8rem;
        }

        .sparkle {
          font-size: 0.85rem;
          color: #ff3e3e;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .filters-header h3 {
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: #fff;
          margin: 0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
        }

        @media (max-width: 1024px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-item label {
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 1.2px;
          color: #71717a;
        }

        .filter-item input, .filter-item select {
          background: #050505;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.6rem 0.8rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          outline: none;
          transition: all 0.2s;
        }

        .filter-item input:focus, .filter-item select:focus {
          border-color: #ff3e3e;
          box-shadow: 0 0 10px rgba(255, 62, 62, 0.05);
        }

        .range-item {
          grid-column: span 2;
        }

        @media (max-width: 640px) {
          .range-item {
            grid-column: span 1;
          }
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .range-inputs input {
          flex: 1;
        }

        .range-inputs span {
          font-size: 0.65rem;
          font-weight: 800;
          color: #52525b;
          letter-spacing: 0.5px;
        }

        .filters-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.02);
          padding-top: 1rem;
        }

        .clear-filter-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.03);
          color: #a1a1aa;
          padding: 0.6rem 1.4rem;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filter-btn:hover {
          background: rgba(255, 255, 255, 0.01);
          color: #fff;
        }

        .apply-filter-btn {
          background: #ff3e3e;
          border: none;
          color: #fff;
          padding: 0.6rem 1.6rem;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-filter-btn:hover {
          background: #e62222;
          box-shadow: 0 0 20px rgba(255, 62, 62, 0.2);
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
