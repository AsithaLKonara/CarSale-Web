'use client';

import React from 'react';
import { Mail, Phone, Calendar, Clock, MapPin } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="page-wrapper">
      <section className="booking-header">
        <div className="container">
          <h1>SECURE YOUR <span>EXPERIENCE</span></h1>
          <p>Book a private viewing or test drive with our luxury automotive specialists.</p>
        </div>
      </section>

      <section className="booking-form-section">
        <div className="container">
          <div className="form-grid">
            <div className="contact-info">
              <div className="info-card">
                <h3>Private Concierge</h3>
                <p>Our specialists are available 24/7 to assist with your inquiries and coordinate logistics.</p>
                
                <div className="items">
                  <div className="item">
                    <Phone size={20} className="icon" />
                    <div>
                      <span>Direct Line</span>
                      <p>+1 (555) 000-SUPER</p>
                    </div>
                  </div>
                  <div className="item">
                    <Mail size={20} className="icon" />
                    <div>
                      <span>Email</span>
                      <p>concierge@ultradrive.com</p>
                    </div>
                  </div>
                  <div className="item">
                    <MapPin size={20} className="icon" />
                    <div>
                      <span>Showroom</span>
                      <p>123 Supercar Drive, Los Angeles, CA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container">
              <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Preferred Date</label>
                    <div className="input-with-icon">
                      <Calendar size={18} />
                      <input type="date" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Preferred Time</label>
                    <div className="input-with-icon">
                      <Clock size={18} />
                      <input type="time" />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>Model of Interest</label>
                  <select>
                    <option>Select a Model</option>
                    <option>Koenigsegg Jesko</option>
                    <option>Lamborghini Revuelto</option>
                    <option>McLaren 750S</option>
                    <option>Ford Mustang Dark Horse</option>
                    <option>BMW M8 Competition</option>
                    <option>Audi R8 V10</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Additional Notes</label>
                  <textarea placeholder="Special requirements, pickup logistics, etc."></textarea>
                </div>
                <button type="submit" className="submit-btn">Request Booking</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-wrapper {
          padding-top: 80px;
          background: #050505;
          min-height: 100vh;
        }

        .booking-header {
          padding: 100px 0 60px;
          text-align: center;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        h1 {
          font-size: 60px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 24px;
        }

        h1 span {
          color: var(--accent, #ff3e3e);
        }

        p {
          font-size: 18px;
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto;
        }

        .booking-form-section {
          padding-bottom: 100px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 80px;
          align-items: flex-start;
        }

        .info-card {
          background: #111;
          padding: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-card h3 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 15px;
        }

        .info-card > p {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 40px;
          text-align: left;
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .item {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .icon {
          color: var(--accent, #ff3e3e);
        }

        .item span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          color: #71717a;
          letter-spacing: 1px;
        }

        .item p {
          color: #fff;
          font-weight: 600;
          font-size: 16px;
        }

        .form-container {
          background: #0a0a0a;
          padding: 50px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          font-size: 12px;
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        input, select, textarea {
          background: #151515;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          color: #fff;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
          border-color: var(--accent, #ff3e3e);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon :global(svg) {
          position: absolute;
          left: 12px;
          color: #71717a;
        }

        .input-with-icon input {
          padding-left: 40px;
          width: 100%;
        }

        textarea {
          height: 120px;
          resize: none;
        }

        .submit-btn {
          margin-top: 20px;
          padding: 18px;
          background: var(--accent, #ff3e3e);
          color: #fff;
          border: none;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .submit-btn:hover {
          background: #e63535;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .input-row {
            grid-template-columns: 1fr;
          }
          h1 {
            font-size: 40px;
          }
          .form-container {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
}
