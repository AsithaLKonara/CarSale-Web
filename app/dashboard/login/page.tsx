'use strict';
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || 
        'Handshake failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-brand">
          <span className="brand-ultra">ULTRA</span>
          <span className="brand-drive">DRIVE</span>
        </div>
        <p className="card-subtitle">ADMINISTRATIVE ACCESS HANDSHAKE</p>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p className="error-text">{errorMsg}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              required
              placeholder="e.g. admin@ultradrive.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSPHRASE</label>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? (
              <span className="spinner-container">
                <span className="spinner"></span>
                ESTABLISHING CONNECTION...
              </span>
            ) : (
              'INITIATE AUTHENTICATION'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #110505 0%, #050505 100%);
          font-family: 'Outfit', -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: -20%;
          left: -10%;
          width: 50%;
          height: 60%;
          background: radial-gradient(circle, rgba(255, 62, 62, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-container::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 50%;
          height: 60%;
          background: radial-gradient(circle, rgba(255, 62, 62, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 2;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #ff3e3e, #800000);
          border-radius: 16px 16px 0 0;
        }

        .card-brand {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 4px;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .brand-ultra {
          color: #fff;
        }

        .brand-drive {
          color: #ff3e3e;
        }

        .card-subtitle {
          font-size: 0.75rem;
          letter-spacing: 3px;
          color: #71717a;
          text-align: center;
          margin-bottom: 2.5rem;
          font-weight: 600;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-banner {
          background: rgba(255, 62, 62, 0.08);
          border: 1px solid rgba(255, 62, 62, 0.2);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .error-icon {
          font-size: 1rem;
        }

        .error-text {
          font-size: 0.85rem;
          color: #ff8a8a;
          line-height: 1.4;
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #a1a1aa;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          font-size: 0.95rem;
          color: #fff;
          outline: none;
          transition: all 0.2s ease-in-out;
        }

        .form-input:focus {
          border-color: rgba(255, 62, 62, 0.5);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 0 0 4px rgba(255, 62, 62, 0.1);
        }

        .form-input::placeholder {
          color: #3f3f46;
        }

        .submit-button {
          background: #ff3e3e;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 1.1rem;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .submit-button:hover:not(:disabled) {
          background: #e02f2f;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(255, 62, 62, 0.5);
        }

        .submit-button:disabled {
          background: #551a1a;
          color: #a1a1aa;
          cursor: not-allowed;
        }

        .spinner-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
