import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          ULTRA<span>DRIVE</span>
        </Link>
        
        <div className="nav-links">
          <Link href="/inventory">Inventory</Link>
          <Link href="/performance">Performance</Link>
          <Link href="/technology">Technology</Link>
          <Link href="/about">About</Link>
        </div>

        <div className="nav-actions">
          <button className="icon-btn"><User size={20} /></button>
          <button className="icon-btn"><ShoppingCart size={20} /></button>
          <button className="menu-btn"><Menu size={20} /></button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          background: rgba(5, 5, 5, 0.5);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1000;
        }

        .nav-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #fff;
          text-decoration: none;
        }

        .logo span {
          color: var(--accent, #ff3e3e);
        }

        .nav-links {
          display: flex;
          gap: 40px;
        }

        .nav-links a {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .nav-actions {
          display: flex;
          gap: 20px;
        }

        .icon-btn, .menu-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .icon-btn:hover {
          transform: scale(1.1);
        }

        .menu-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
          .menu-btn {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
