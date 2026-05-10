'use client';

import React, { useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface SortableGalleryProps {
  initialItems: MediaItem[];
  onChange: (updated: MediaItem[]) => void;
}

export default function SortableGallery({ initialItems, onChange }: SortableGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    // Rearrange locally
    const current = [...items];
    const draggedItem = current[draggedIdx];
    current.splice(draggedIdx, 1);
    current.splice(idx, 0, draggedItem);

    setDraggedIdx(idx);
    setItems(current);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    onChange(items);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onChange(updated);
  };

  return (
    <div className="gallery-layout">
      <div className="gallery-header">
        <h4>SORTABLE STABLE GALLERY</h4>
        <p>Drag tiles to customize visual display order inside showroom cards.</p>
      </div>

      <div className="sortable-grid">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`gallery-tile ${draggedIdx === idx ? 'tile-dragged' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
          >
            <img src={item.url} alt={`Gallery vehicle preview ${idx}`} />
            <div className="tile-badge">
              <span>{idx === 0 ? 'HERO' : `#${idx + 1}`}</span>
            </div>
            <button className="delete-tile-btn" onClick={() => handleDelete(item.id)}>
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="gallery-empty-frame">
            <span>🖼️</span>
            <p>No specifications files mounted yet</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .gallery-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .gallery-header h4 {
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #fff;
          margin: 0 0 0.2rem 0;
        }

        .gallery-header p {
          font-size: 0.68rem;
          color: #71717a;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .sortable-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .gallery-tile {
          position: relative;
          aspect-ratio: 16/10;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          overflow: hidden;
          cursor: grab;
          transition: border-color 0.2s, transform 0.2s;
        }

        .gallery-tile:active {
          cursor: grabbing;
        }

        .gallery-tile:hover {
          border-color: #ff3e3e;
        }

        .tile-dragged {
          opacity: 0.4;
          transform: scale(0.95);
          border-color: #ff3e3e;
        }

        .gallery-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tile-badge {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 2px 6px;
        }

        .tile-badge span {
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .delete-tile-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .delete-tile-btn:hover {
          background: #ff3e3e;
        }

        .gallery-empty-frame {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          border: 1px dashed rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          color: #52525b;
        }

        .gallery-empty-frame span {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .gallery-empty-frame p {
          font-size: 0.7rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
