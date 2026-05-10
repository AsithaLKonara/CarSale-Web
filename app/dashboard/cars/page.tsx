'use strict';
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';

interface CarImage {
  url: string;
  type: string;
}

interface CarSpec {
  label: string;
  value: string;
}

interface Car {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  zeroTo100: number;
  price?: string;
  category: string;
  isFeatured: boolean;
  status: string;
  images: CarImage[];
  specs: CarSpec[];
}

export default function CarsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [activeStatusDropdownCarId, setActiveStatusDropdownCarId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [horsepower, setHorsepower] = useState<number>(1000);
  const [torque, setTorque] = useState<number>(1000);
  const [topSpeed, setTopSpeed] = useState<number>(350);
  const [zeroTo100, setZeroTo100] = useState<number>(2.5);
  const [price, setPrice] = useState('POA');
  const [category, setCategory] = useState('hypercar');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<CarImage[]>([]);
  const [specs, setSpecs] = useState<CarSpec[]>([
    { label: 'Engine', value: '' },
    { label: 'Transmission', value: '' },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // 1. Fetch Showroom Vehicles
  const { data: carsData, isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await api.get('/cars', { params: { limit: 100 } });
      return response.data.cars as Car[];
    },
  });

  // 2. Mutation to register new vehicle
  const createMutation = useMutation({
    mutationFn: async (newCar: any) => {
      const response = await api.post('/cars', newCar);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      resetForm();
      setView('list');
    },
  });

  // 3. Mutation to update status (2-click action pills)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put(`/cars/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setActiveStatusDropdownCarId(null);
    },
  });

  // 4. Mutation to delete vehicle
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });

  const resetForm = () => {
    setName('');
    setSlug('');
    setBrand('');
    setDescription('');
    setHorsepower(1000);
    setTorque(1000);
    setTopSpeed(350);
    setZeroTo100(2.5);
    setPrice('POA');
    setCategory('hypercar');
    setIsFeatured(false);
    setImages([]);
    setSpecs([
      { label: 'Engine', value: '' },
      { label: 'Transmission', value: '' },
    ]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { url } = response.data.data;
      // First uploaded image becomes hero, others become gallery
      const type = images.length === 0 ? 'hero' : 'gallery';
      setImages((prev) => [...prev, { url, type }]);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSpecField = () => {
    setSpecs((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpecField = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    setSpecs((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out blank custom fields
    const activeSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand,
      description,
      horsepower: Number(horsepower),
      torque: Number(torque),
      topSpeed: Number(topSpeed),
      zeroTo100: Number(zeroTo100),
      price,
      category,
      isFeatured,
      images,
      specs: activeSpecs,
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id: string, carName: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete the specifications for ${carName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="showroom-container">
      {/* Dynamic Header Controls */}
      <section className="showroom-header">
        <div className="header-meta">
          <h1>SHOWROOM VEHICLES</h1>
          <p>Register new hypercar specs, upload cinematics, and update showroom inventory lists.</p>
        </div>

        <div>
          {view === 'list' ? (
            <button onClick={() => setView('create')} className="view-toggle-btn active">
              ➕ REGISTER NEW VEHICLE
            </button>
          ) : (
            <button onClick={() => { setView('list'); resetForm(); }} className="view-toggle-btn">
              ⬅️ CANCEL REGISTRATION
            </button>
          )}
        </div>
      </section>

      {/* Render View Mode */}
      {view === 'list' ? (
        isLoading ? (
          <div className="section-loader">
            <span className="spinner"></span>
            <p>SYNCING SHOWROOM CATALOGUE...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <span>⚠️</span>
            <p>Database synchronization failed: {(error as any).message}</p>
          </div>
        ) : carsData && carsData.length > 0 ? (
          <div className="cars-grid">
            {carsData.map((car) => (
              <div key={car.id} className="car-card glass-panel">
                <div className="car-thumbnail">
                  {car.images.find((img) => img.type === 'hero')?.url ? (
                    <img
                      src={car.images.find((img) => img.type === 'hero')?.url}
                      alt={car.name}
                      className="car-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>🏎️</span>
                    </div>
                  )}
                  <span className="category-pill">{car.category.toUpperCase()}</span>
                  {car.isFeatured && <span className="featured-pill">FEATURED</span>}
                </div>

                <div className="car-body">
                  <div className="brand-header">
                    <span className="car-brand">{car.brand.toUpperCase()}</span>

                    {/* 2-Click Rapid Status Pill Controls */}
                    <div className="status-dropdown-wrapper">
                      <button 
                        className={`status-pill-btn ${(car.status || 'draft').toLowerCase()}`}
                        onClick={() => setActiveStatusDropdownCarId(activeStatusDropdownCarId === car.id ? null : car.id)}
                        type="button"
                        title="Click to toggle status options"
                      >
                        {(car.status || 'draft').toUpperCase()}
                      </button>
                      
                      {activeStatusDropdownCarId === car.id && (
                        <div className="status-popover glass-panel">
                          {['draft', 'review', 'published', 'reserved', 'sold', 'archived'].map((statusOption) => (
                            <button
                              key={statusOption}
                              type="button"
                              className={`status-option-btn ${statusOption}`}
                              onClick={() => {
                                updateStatusMutation.mutate({ id: car.id, status: statusOption });
                              }}
                            >
                              {statusOption.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(car.id, car.name)}
                      className="delete-icon-btn"
                      title="Decompile vehicle specs"
                    >
                      🗑️
                    </button>
                  </div>
                  <h3 className="car-title">{car.name.toUpperCase()}</h3>
                  <p className="car-desc">{car.description}</p>

                  <div className="specs-row">
                    <div className="stat-pill">
                      <span className="stat-label">POWER</span>
                      <span className="stat-val">{car.horsepower} HP</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">V-MAX</span>
                      <span className="stat-val">{car.topSpeed} KM/H</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">0-100</span>
                      <span className="stat-val">{car.zeroTo100} SEC</span>
                    </div>
                  </div>

                  <div className="price-footer">
                    <span className="price-label">INVESTMENT BOUND</span>
                    <span className="price-val">{car.price || 'POA'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-catalog glass-panel">
            <span>🏎️</span>
            <h3>SHOWROOM INVENTORY EMPTY</h3>
            <p>There are no supercars cataloged in the active showroom database.</p>
          </div>
        )
      ) : (
        /* Create View: Highly Descriptive Multistep Form */
        <div className="create-form-wrapper glass-panel">
          <div className="form-title-banner">
            <h2>NEW SPECIFICATION FILES</h2>
            <p>Provide verified engine parameters and upload cinematic asset streams.</p>
          </div>

          <form onSubmit={handleCreateSubmit} className="specification-form">
            <div className="form-section-grid">
              {/* Left Column: Basic Details */}
              <div className="form-column">
                <h3 className="column-title">1. BASIC SPECIFICATIONS</h3>
                
                <div className="form-group">
                  <label htmlFor="name">VEHICLE TITLE</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Jesko Absolut"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="slug">UNIQUE IDENTIFIER / SLUG</label>
                  <input
                    type="text"
                    id="slug"
                    placeholder="e.g. koenigsegg-jesko-absolut"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="brand">MANUFACTURING BRAND</label>
                  <input
                    type="text"
                    id="brand"
                    required
                    placeholder="e.g. Koenigsegg"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="desc">VEHICLE PROFILE DESCRIPTION</label>
                  <textarea
                    id="desc"
                    required
                    rows={4}
                    placeholder="Provide detailed description of downforce, carbon monocoque, and active aerodynamics..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <div className="split-form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="price">PRICE BOUND</label>
                    <input
                      type="text"
                      id="price"
                      placeholder="e.g. POA or $3,000,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="category">CATEGORY</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-input"
                    >
                      <option value="hypercar">HYPERCAR</option>
                      <option value="track">TRACK SPECIAL</option>
                      <option value="luxury">LUXURY GT</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="featured">FLAG AS SHOWROOM HERO / FEATURED</label>
                </div>
              </div>

              {/* Right Column: Engine Parameters & Media Uploads */}
              <div className="form-column">
                <h3 className="column-title">2. ENGINE BENCHMARKS</h3>

                <div className="split-form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="hp">HORSEPOWER (HP)</label>
                    <input
                      type="number"
                      id="hp"
                      required
                      value={horsepower}
                      onChange={(e) => setHorsepower(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="torque">TORQUE (NM)</label>
                    <input
                      type="number"
                      id="torque"
                      required
                      value={torque}
                      onChange={(e) => setTorque(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="split-form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="speed">V-MAX (KM/H)</label>
                    <input
                      type="number"
                      id="speed"
                      required
                      value={topSpeed}
                      onChange={(e) => setTopSpeed(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="zero">0-100 (SEC)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="zero"
                      required
                      value={zeroTo100}
                      onChange={(e) => setZeroTo100(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <h3 className="column-title mt-4">3. SHOWROOM CINEMATIC MEDIA</h3>

                {/* File Uploader */}
                <div className="file-uploader-box">
                  <span className="upload-icon">📷</span>
                  <p>DRAG & DROP OR SELECT MEDIA FILE</p>
                  <span className="upload-desc">Max 100MB. Supported: PNG, JPG, WebP, MP4</span>
                  
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden-file-input"
                  />
                  <label htmlFor="file-input" className="file-input-label">
                    {isUploading ? 'SYNCHING FILE STREAM...' : 'CHOOSE FILE'}
                  </label>
                </div>

                {uploadError && <p className="upload-error">{uploadError}</p>}

                {/* Uploaded Thumbnails Preview */}
                {images.length > 0 && (
                  <div className="thumbnails-preview">
                    {images.map((img, i) => (
                      <div key={i} className="preview-item">
                        <img src={img.url} alt="Uploaded Spec" />
                        <span className={`preview-badge ${img.type}`}>{img.type.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="spec-fields-header">
                  <h3 className="column-title">4. CUSTOM ENGINE SPECS</h3>
                  <button type="button" onClick={handleAddSpecField} className="add-field-btn">
                    ➕ ADD SPEC
                  </button>
                </div>

                {specs.map((spec, i) => (
                  <div key={i} className="spec-input-row">
                    <input
                      type="text"
                      placeholder="Spec label (e.g. Engine)"
                      value={spec.label}
                      onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                      className="form-input flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Spec value (e.g. 5.0L Twin-Turbo V8)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                      className="form-input flex-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecField(i)}
                      className="remove-spec-btn"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-submit-footer">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="form-submit-btn"
              >
                {createMutation.isPending ? 'DEPLOYING SPECIFICATION FILES...' : 'DEPLOY VEHICLE SPECIFICATION'}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .showroom-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .showroom-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #141414;
          padding-bottom: 1.5rem;
          gap: 2rem;
        }

        .header-meta h1 {
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 0.5rem;
        }

        .header-meta p {
          color: #71717a;
          font-size: 0.82rem;
          letter-spacing: 1px;
          margin: 0;
        }

        .view-toggle-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 1.5px;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .view-toggle-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .view-toggle-btn.active {
          background: #ff3e3e;
          border-color: #ff3e3e;
          color: #fff;
          box-shadow: 0 5px 15px -5px rgba(255, 62, 62, 0.5);
        }

        .cars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .car-card {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease-in-out;
        }

        .car-card:hover {
          border-color: rgba(255, 62, 62, 0.15);
          box-shadow: 0 15px 35px -15px rgba(0, 0, 0, 0.8);
          transform: translateY(-4px);
        }

        .car-thumbnail {
          height: 220px;
          width: 100%;
          position: relative;
          background: #000;
          overflow: hidden;
        }

        .car-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease-in-out;
        }

        .car-card:hover .car-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080808;
          font-size: 2.5rem;
        }

        .category-pill {
          position: absolute;
          bottom: 12px;
          left: 12px;
          font-size: 0.55rem;
          font-weight: 850;
          letter-spacing: 1.5px;
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #fff;
          backdrop-filter: blur(5px);
        }

        .featured-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          padding: 3px 8px;
          background: #ff3e3e;
          border-radius: 4px;
          color: #fff;
          box-shadow: 0 0 10px rgba(255, 62, 62, 0.5);
        }

        .car-body {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-grow: 1;
        }

        .brand-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .car-brand {
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 2px;
          color: #ff3e3e;
        }

        .delete-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          opacity: 0;
          transition: all 0.2s;
        }

        .car-card:hover .delete-icon-btn {
          opacity: 0.5;
        }

        .delete-icon-btn:hover {
          opacity: 1 !important;
        }

        .car-title {
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin: 0;
          color: #fff;
        }

        .car-desc {
          font-size: 0.75rem;
          line-height: 1.5;
          color: #71717a;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          min-height: 50px;
        }

        .specs-row {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .stat-pill {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #52525b;
        }

        .stat-val {
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .price-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        .price-label {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #52525b;
        }

        .price-val {
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .create-form-wrapper {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .form-title-banner h2 {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: 2.5px;
          margin: 0 0 0.5rem 0;
        }

        .form-title-banner p {
          color: #71717a;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .specification-form {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .form-section-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .column-title {
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: #71717a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding-bottom: 0.5rem;
          margin: 0 0 0.5rem 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #a1a1aa;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.85rem;
          color: #fff;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: rgba(255, 62, 62, 0.4);
          box-shadow: 0 0 0 4px rgba(255, 62, 62, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .form-textarea {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.85rem;
          color: #fff;
          outline: none;
          resize: vertical;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-textarea:focus {
          border-color: rgba(255, 62, 62, 0.4);
          box-shadow: 0 0 0 4px rgba(255, 62, 62, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .split-form-row {
          display: flex;
          gap: 1.5rem;
        }

        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .hidden-file-input { display: none; }
        .mt-4 { margin-top: 1.5rem; }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .form-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #ff3e3e;
          cursor: pointer;
        }

        .checkbox-group label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #a1a1aa;
          cursor: pointer;
        }

        .file-uploader-box {
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          transition: all 0.2s;
        }

        .file-uploader-box:hover {
          border-color: rgba(255, 62, 62, 0.3);
          background: rgba(255, 62, 62, 0.01);
        }

        .upload-icon {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
          opacity: 0.6;
        }

        .file-uploader-box p {
          font-size: 0.75rem;
          font-weight: 850;
          letter-spacing: 1.5px;
          margin: 0;
        }

        .upload-desc {
          font-size: 0.65rem;
          color: #52525b;
          font-weight: 600;
        }

        .file-input-label {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 1px;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.2s;
        }

        .file-input-label:hover {
          background: #fff;
          color: #000;
        }

        .upload-error {
          font-size: 0.75rem;
          color: #ff8a8a;
          margin: 0;
          font-weight: 600;
        }

        .thumbnails-preview {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1rem;
        }

        .preview-item {
          width: 70px;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-badge {
          position: absolute;
          bottom: 2px;
          left: 2px;
          right: 2px;
          font-size: 0.45rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          padding: 2px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 2px;
          text-align: center;
        }

        .preview-badge.hero {
          color: #ff3e3e;
        }

        .preview-badge.gallery {
          color: #a1a1aa;
        }

        .spec-fields-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding-bottom: 0.5rem;
        }

        .spec-fields-header .column-title {
          border-bottom: none;
          margin: 0;
          padding: 0;
        }

        .add-field-btn {
          background: transparent;
          border: none;
          color: #ff3e3e;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .spec-input-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .remove-spec-btn {
          background: rgba(255, 62, 62, 0.05);
          border: 1px solid rgba(255, 62, 62, 0.15);
          color: #ff3e3e;
          border-radius: 6px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .remove-spec-btn:hover {
          background: #ff3e3e;
          color: #fff;
        }

        .form-submit-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }

        .form-submit-btn {
          background: #ff3e3e;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 1.2rem 2.5rem;
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .form-submit-btn:hover:not(:disabled) {
          background: #e02f2f;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(255, 62, 62, 0.5);
        }

        .section-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 8rem;
          text-align: center;
        }

        .section-loader .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 62, 62, 0.1);
          border-top-color: #ff3e3e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .section-loader p {
          font-size: 0.75rem;
          letter-spacing: 3px;
          color: #52525b;
          font-weight: 750;
          margin: 0;
        }

        .empty-catalog {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .empty-catalog span {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-catalog h3 {
          font-size: 0.9rem;
          font-weight: 850;
          letter-spacing: 2px;
          margin: 0 0 0.5rem 0;
        }

        .empty-catalog p {
          font-size: 0.75rem;
          color: #71717a;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .status-dropdown-wrapper {
          position: relative;
          display: inline-block;
        }

        .status-pill-btn {
          font-size: 0.55rem;
          font-weight: 850;
          letter-spacing: 1.5px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.4);
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }

        .status-pill-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.05);
        }

        .status-pill-btn.draft { color: #94a3b8; border-color: rgba(148, 163, 184, 0.25); background: rgba(148, 163, 184, 0.05); }
        .status-pill-btn.review { color: #f59e0b; border-color: rgba(245, 158, 11, 0.25); background: rgba(245, 158, 11, 0.05); }
        .status-pill-btn.published { color: #10b981; border-color: rgba(16, 185, 129, 0.25); background: rgba(16, 185, 129, 0.05); }
        .status-pill-btn.reserved { color: #ec4899; border-color: rgba(236, 72, 153, 0.25); background: rgba(236, 72, 153, 0.05); }
        .status-pill-btn.sold { color: #ef4444; border-color: rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.05); }
        .status-pill-btn.archived { color: #71717a; border-color: rgba(113, 113, 122, 0.25); background: rgba(113, 113, 122, 0.05); }

        .status-popover {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 6px;
          border-radius: 8px;
          background: #09090c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.9);
          min-width: 110px;
        }

        .status-option-btn {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 6px 10px;
          border-radius: 4px;
          border: none;
          background: transparent;
          color: #a1a1aa;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .status-option-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
        }

        .status-option-btn.draft:hover { color: #94a3b8; background: rgba(148, 163, 184, 0.08); }
        .status-option-btn.review:hover { color: #f59e0b; background: rgba(245, 158, 11, 0.08); }
        .status-option-btn.published:hover { color: #10b981; background: rgba(16, 185, 129, 0.08); }
        .status-option-btn.reserved:hover { color: #ec4899; background: rgba(236, 72, 153, 0.08); }
        .status-option-btn.sold:hover { color: #ef4444; background: rgba(239, 68, 68, 0.08); }
        .status-option-btn.archived:hover { color: #71717a; background: rgba(113, 113, 122, 0.08); }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
