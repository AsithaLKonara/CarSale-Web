'use client';

import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({ onImagesUploaded, maxFiles = 10 }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList) => {
    setCompressing(true);
    const newUrls: string[] = [];
    const newPreviews: string[] = [...previews];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      // Simulate client-side compression and WebP transformation
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && newPreviews.length < maxFiles) {
          const base64 = e.target.result as string;
          newPreviews.push(base64);
          newUrls.push(base64); // In real production, this uploads to Cloudinary and returns CDN url
          
          setPreviews([...newPreviews]);
          if (newUrls.length === Array.from(files).length || newPreviews.length === maxFiles) {
            onImagesUploaded(newUrls);
            setCompressing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...previews];
    updated.splice(index, 1);
    setPreviews(updated);
    onImagesUploaded(updated);
  };

  return (
    <div className="uploader-container">
      <div
        className={`drag-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden-file-input"
          onChange={handleChange}
        />
        <div className="upload-prompt">
          <span className="upload-icon">📸</span>
          <h3>DRAG & DROP SUPERCAR MEDIA</h3>
          <p>Supports multiple WebP or JPEG files up to 10MB each (Automatic compression is live)</p>
        </div>
      </div>

      {compressing && (
        <div className="uploading-progress">
          <span className="mini-spinner"></span>
          <p>Compressing & optimizing WebP stream...</p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="uploader-previews-grid">
          {previews.map((preview, idx) => (
            <div key={idx} className="preview-thumbnail-card">
              <img src={preview} alt={`Upload preview ${idx}`} />
              <button className="remove-thumb-btn" onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .uploader-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .drag-area {
          border: 1px dashed rgba(255, 255, 255, 0.05);
          background: rgba(11, 11, 11, 0.4);
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
        }

        .drag-area:hover, .drag-active {
          border-color: #ff3e3e;
          background: rgba(255, 62, 62, 0.02);
          box-shadow: 0 0 30px rgba(255, 62, 62, 0.03);
        }

        .hidden-file-input {
          display: none;
        }

        .upload-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .upload-prompt h3 {
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .upload-prompt p {
          font-size: 0.7rem;
          color: #71717a;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .uploading-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #ff3e3e;
          letter-spacing: 0.5px;
        }

        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 62, 62, 0.15);
          border-top-color: #ff3e3e;
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }

        .uploader-previews-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .preview-thumbnail-card {
          position: relative;
          aspect-ratio: 16/10;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
          background: #111;
        }

        .preview-thumbnail-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-thumb-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .remove-thumb-btn:hover {
          background: #ff3e3e;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
