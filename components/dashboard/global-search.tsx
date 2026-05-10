'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Search, CarFront, Calendar, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

interface CarItem {
  id: string;
  brand: string;
  name: string;
  price: number;
}

interface BookingItem {
  id: string;
  name: string;
  email: string;
  carInterest: string;
}

interface LogItem {
  id: string;
  action: string;
  entity: string;
}

interface SearchResults {
  cars: CarItem[];
  bookings: BookingItem[];
  logs: LogItem[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ cars: [], bookings: [], logs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen to Cmd+K or Ctrl+K triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus the search input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults({ cars: [], bookings: [], logs: [] });
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Debounced api telemetry search handler
  useEffect(() => {
    if (query.trim() === '') {
      setResults({ cars: [], bookings: [], logs: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (err) {
        console.error('Telemetry search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const hasResults = results.cars.length > 0 || results.bookings.length > 0 || results.logs.length > 0;

  return (
    <div className="search-overlay">
      <div className="search-backdrop" onClick={() => setIsOpen(false)} />
      
      <div className="search-palette border border-zinc-800 bg-zinc-950/90 shadow-2xl rounded-2xl backdrop-blur-xl">
        {/* Search header input */}
        <div className="palette-input-wrapper border-b border-zinc-800">
          <Search className="h-5 w-5 search-icon text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search specifications, reservations, or system logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="palette-input text-zinc-100"
          />
          <span className="esc-badge border border-zinc-800 text-zinc-500 rounded bg-zinc-900">ESC</span>
        </div>

        {/* Results output frame */}
        <div className="palette-results">
          {isLoading ? (
            <div className="results-loading">
              <div className="spinner"></div>
              <p className="text-zinc-500 text-xs mt-3 font-semibold">EXECUTING SECURE QUERY SEARCH...</p>
            </div>
          ) : query === '' ? (
            <div className="results-empty">
              <Sparkles className="h-6 w-6 text-violet-400 mb-2 animate-bounce" />
              <p className="text-zinc-400 text-sm font-semibold">Unified Index Search</p>
              <p className="text-zinc-500 text-xs mt-1">Search through vehicles, VIP bookings, or backend action logs instantly.</p>
            </div>
          ) : !hasResults ? (
            <div className="results-empty">
              <ShieldAlert className="h-6 w-6 text-zinc-600 mb-2" />
              <p className="text-zinc-400 text-sm font-semibold">No Match Found</p>
              <p className="text-zinc-500 text-xs mt-1">No indices match the parameters: &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="results-scroll-container">
              {/* Category 1: Vehicles */}
              {results.cars.length > 0 && (
                <div className="results-category">
                  <h4 className="category-title text-zinc-500">🏎️ FLEET CATALOG VEHICLES</h4>
                  <div className="category-items">
                    {results.cars.map(c => (
                      <div key={c.id} onClick={() => navigateTo('/dashboard/cars')} className="result-item">
                        <CarFront className="h-4 w-4 text-violet-400" />
                        <div className="item-meta">
                          <span className="item-name">{c.brand} {c.name}</span>
                          <span className="item-detail text-zinc-500">${c.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: Reservations */}
              {results.bookings.length > 0 && (
                <div className="results-category">
                  <h4 className="category-title text-zinc-500">📅 VIP CONCIERGE SCHEDULER</h4>
                  <div className="category-items">
                    {results.bookings.map(b => (
                      <div key={b.id} onClick={() => navigateTo('/dashboard/bookings')} className="result-item">
                        <Calendar className="h-4 w-4 text-amber-400" />
                        <div className="item-meta">
                          <span className="item-name">{b.name}</span>
                          <span className="item-detail text-zinc-500">{b.email} — {b.carInterest || 'Standard Spec'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 3: System Logs */}
              {results.logs.length > 0 && (
                <div className="results-category">
                  <h4 className="category-title text-zinc-500">⚙️ CORE SYSTEM AUDIT LOGS</h4>
                  <div className="category-items">
                    {results.logs.map(l => (
                      <div key={l.id} className="result-item unclickable">
                        <Terminal className="h-4 w-4 text-rose-400" />
                        <div className="item-meta">
                          <span className="item-name">{l.action.toUpperCase()}</span>
                          <span className="item-detail text-zinc-500">Scope: {l.entity} (Audited Log)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Palette footer info */}
        <div className="palette-footer border-t border-zinc-800 text-zinc-500">
          <span>⌨️ Use ↑↓ to navigate</span>
          <span>↵ Enter to select</span>
          <span>Esc to exit</span>
        </div>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          font-family: 'Outfit', -apple-system, sans-serif;
        }

        .search-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }

        .search-palette {
          position: relative;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: scaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .palette-input-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
        }

        .search-icon {
          flex-shrink: 0;
        }

        .palette-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          font-size: 1rem;
          outline: none;
          font-weight: 500;
        }

        .esc-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 8px;
          letter-spacing: 0.5px;
        }

        .palette-results {
          min-height: 280px;
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .results-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4.5rem 0;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .results-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4.5rem 2rem;
          text-align: center;
        }

        .results-scroll-container {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .results-category {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-title {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin: 0 0.5rem;
        }

        .category-items {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .result-item:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: translateX(2px);
        }

        .result-item.unclickable {
          cursor: default;
        }

        .result-item.unclickable:hover {
          background: transparent;
          transform: none;
        }

        .item-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
        }

        .item-detail {
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .palette-footer {
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
