'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '../../hooks/use-auth';
import { QueryProvider } from '../../lib/query-client';
import NotificationsDrawer from '../../components/dashboard/notifications-drawer';
import GlobalSearch from '../../components/dashboard/global-search';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  // If we are on the login page, render the child page cleanly without the sidebar
  if (pathname === '/dashboard/login') {
    return <>{children}</>;
  }

  // Handle global authentication loader
  if (isLoading) {
    return (
      <div className="layout-loader">
        <div className="loader-box">
          <div className="spinner"></div>
          <p className="loader-text">SECURE CLIENT HANDSHAKE...</p>
        </div>
        <style jsx>{`
          .layout-loader {
            min-height: 100vh;
            width: 100vw;
            background: #050505;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', -apple-system, sans-serif;
          }
          .loader-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .spinner {
            width: 28px;
            height: 28px;
            border: 2px solid rgba(255, 62, 62, 0.2);
            border-top-color: #ff3e3e;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          .loader-text {
            font-size: 0.75rem;
            letter-spacing: 3px;
            color: #71717a;
            font-weight: 700;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If the hook redirected or user is absent, safeguard the render tree
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-grid">
      <GlobalSearch />
      {/* Premium Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link href="/dashboard" className="brand-link">
            <span className="brand-ultra">ULTRA</span>
            <span className="brand-drive">DRIVE</span>
          </Link>
        </div>

        <div className="user-profile-section">
          <div className="user-avatar">
            {user.email[0].toUpperCase()}
          </div>
          <div className="user-meta">
            <p className="user-email">{user.email.split('@')[0].toUpperCase()}</p>
            <span className={`role-badge ${user.role}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        <nav className="nav-links">
          <Link
            href="/dashboard"
            className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">OVERVIEW</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`nav-item ${pathname.startsWith('/dashboard/analytics') ? 'active' : ''}`}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">TELEMETRY STATS</span>
          </Link>
          <Link
            href="/dashboard/cars"
            className={`nav-item ${pathname.startsWith('/dashboard/cars') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏎️</span>
            <span className="nav-label">SHOWROOM MANAGE</span>
          </Link>
          <Link
            href="/dashboard/bookings"
            className={`nav-item ${pathname.startsWith('/dashboard/bookings') ? 'active' : ''}`}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">VIP SCHEDULER</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <span className="btn-icon">🚪</span>
            <span>CLOSE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <main className="main-viewport">
        <header className="viewport-header">
          <div className="header-breadcrumbs">
            <span className="crumb-parent">DASHBOARD</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-child">
              {pathname === '/dashboard' ? 'OVERVIEW' : pathname.split('/').slice(2).join(' / ').toUpperCase()}
            </span>
          </div>

          <div className="header-controls">
            <NotificationsDrawer />
            <div className="server-status">
              <span className="status-indicator"></span>
              <span className="status-text">SECURE CORE ONLINE</span>
            </div>
          </div>
        </header>

        <div className="viewport-content">
          {children}
        </div>
      </main>

      <style jsx global>{`
        /* Global CSS configurations for the Dashboard UI scope */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #050505;
          color: #fff;
          font-family: 'Outfit', -apple-system, sans-serif;
        }

        .sidebar {
          background: #0b0b0b;
          border-right: 1px solid #141414;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar-brand {
          margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .brand-link {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 4px;
          display: flex;
          gap: 2px;
        }

        .brand-ultra {
          color: #fff;
        }

        .brand-drive {
          color: #ff3e3e;
        }

        .user-profile-section {
          background: #111111;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          background: #ff3e3e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 62, 62, 0.2);
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .user-email {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }

        .role-badge {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }

        .role-badge.admin {
          background: rgba(255, 62, 62, 0.15);
          color: #ff3e3e;
          border: 1px solid rgba(255, 62, 62, 0.3);
        }

        .role-badge.editor {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .role-badge.viewer {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #71717a;
          transition: all 0.2s ease-in-out;
        }

        .nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }

        .nav-item.active {
          color: #fff;
          background: rgba(255, 62, 62, 0.08);
          border: 1px solid rgba(255, 62, 62, 0.15);
        }

        .nav-item.active .nav-icon {
          filter: drop-shadow(0 0 8px rgba(255, 62, 62, 0.5));
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid #141414;
        }

        .logout-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          border-radius: 8px;
          padding: 0.9rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .logout-btn:hover {
          background: rgba(255, 62, 62, 0.08);
          border-color: rgba(255, 62, 62, 0.2);
          color: #ff3e3e;
        }

        .main-viewport {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
        }

        .viewport-header {
          background: #080808;
          border-bottom: 1px solid #141414;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .crumb-parent {
          color: #71717a;
        }

        .crumb-separator {
          color: #3f3f46;
        }

        .crumb-child {
          color: #ff3e3e;
          text-shadow: 0 0 10px rgba(255, 62, 62, 0.1);
        }

        .server-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.15);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }

        .status-text {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #10b981;
        }

        .viewport-content {
          padding: 3rem;
          flex-grow: 1;
          background: #050505;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </AuthProvider>
    </QueryProvider>
  );
}
