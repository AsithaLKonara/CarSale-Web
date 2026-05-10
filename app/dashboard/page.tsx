'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';
import ErrorBoundary from '../../components/ErrorBoundary';

interface Booking {
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  status: 'pending' | 'confirmed' | 'completed';
  carInterest?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function OverviewPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  // 1. Query Real Dealership Overview Metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const response = await api.get('/analytics/overview');
      return response.data?.data || response.data;
    },
    refetchInterval: 10000, // Fast refreshing operational telemetry stream
  });

  // 2. Query VIP Concierge Bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get('/bookings');
      return response.data?.data?.bookings || response.data?.bookings || [];
    },
  });

  // 3. Query Recent CRM Leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await api.get('/leads', { params: { limit: 5 } });
      return response.data?.data?.leads || response.data?.leads || [];
    },
  });

  const isDataLoading = metricsLoading || bookingsLoading || leadsLoading;

  // Render Formatted Monetary Sums nicely
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="overview-container">
      {/* SECTION 1: Welcome Greetings & Context Banner */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <h1>ULTRA<span>DRIVE</span> CRM OVERVIEW</h1>
          <p>Real-time vehicle lifecycle status, customer inquiries, and sales conversions.</p>
        </div>
        <div className="banner-date">
          <Calendar size={15} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </section>

      {/* SECTION 2: 6 Real Dealership KPIs Grid */}
      <section className="stats-grid">
        {/* Metric 1: Total Active Inventory */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">ACTIVE SHOWROOM INVENTORY</span>
            <div className="icon-wrapper accent"><Car size={18} /></div>
          </div>
          <div className="card-value">
            {metricsLoading ? <span className="skeleton-line w-12"></span> : metrics?.activeInventoryCount ?? 0}
          </div>
          <p className="card-footer">Published showroom vehicles</p>
        </div>

        {/* Metric 2: Estimated Revenue */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">ESTIMATED REVENUE</span>
            <div className="icon-wrapper success"><DollarSign size={18} /></div>
          </div>
          <div className="card-value font-mono">
            {metricsLoading ? <span className="skeleton-line w-24"></span> : formatCurrency(metrics?.estimatedRevenue ?? 0)}
          </div>
          <p className="card-footer">Sum value of sold units</p>
        </div>

        {/* Metric 3: Total CRM Leads */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">TOTAL REGISTERED LEADS</span>
            <div className="icon-wrapper info"><Users size={18} /></div>
          </div>
          <div className="card-value">
            {metricsLoading ? <span className="skeleton-line w-12"></span> : metrics?.totalLeadsCount ?? 0}
          </div>
          <p className="card-footer">In-pipeline prospective clients</p>
        </div>

        {/* Metric 4: Lead Conversion Rate */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">DEALER CONVERSION RATE</span>
            <div className="icon-wrapper warning"><TrendingUp size={18} /></div>
          </div>
          <div className="card-value font-mono text-glow">
            {metricsLoading ? <span className="skeleton-line w-16"></span> : `${metrics?.leadConversionRate ?? '0.00'}%`}
          </div>
          <p className="card-footer">Leads converted to sales</p>
        </div>

        {/* Metric 5: Cars Sold This Month */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">CARS SOLD (30 DAYS)</span>
            <div className="icon-wrapper reward"><Award size={18} /></div>
          </div>
          <div className="card-value">
            {metricsLoading ? <span className="skeleton-line w-12"></span> : metrics?.carsSoldThisMonth ?? 0}
          </div>
          <p className="card-footer">Deals completed this month</p>
        </div>

        {/* Metric 6: Pending VIP Bookings */}
        <div className="stat-card">
          <div className="card-header">
            <span className="card-title">PENDING TEST-DRIVES</span>
            <div className="icon-wrapper wait"><Clock size={18} /></div>
          </div>
          <div className="card-value text-amber-500">
            {metricsLoading ? <span className="skeleton-line w-12"></span> : metrics?.pendingBookingsCount ?? 0}
          </div>
          <p className="card-footer">Awaiting concierge confirmation</p>
        </div>
      </section>

      {/* SECTION 3: Recent Activity Split */}
      <section className="split-layout">
        {/* Left Hand: Recent Bookings Stream */}
        <div className="table-wrapper glass-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Calendar size={16} className="panel-icon" />
              <h2>RECENT VIP VIEWING SLOTS</h2>
            </div>
            <Link href="/dashboard/bookings" className="panel-action">VIEW SCHEDULE <ChevronRight size={14} /></Link>
          </div>

          {bookingsLoading ? (
            <div className="table-loader">
              <span className="spinner"></span>
              <p>Syncing booking ledger...</p>
            </div>
          ) : bookingsData && bookingsData.length > 0 ? (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>VIP Client</th>
                    <th>Vehicle Interest</th>
                    <th>Preferred Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsData.slice(0, 5).map((booking: Booking) => (
                    <tr key={booking.id}>
                      <td className="font-bold">{booking.name}</td>
                      <td>{booking.carInterest || 'Luxury Specification'}</td>
                      <td>{new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <span className={`status-pill ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span>📅</span>
              <p>No active showroom bookings scheduled.</p>
            </div>
          )}
        </div>

        {/* Right Hand: CRM Pipeline Activity Table */}
        <div className="table-wrapper glass-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Users size={16} className="panel-icon" />
              <h2>LEADS STREAM</h2>
            </div>
            <Link href="/dashboard/leads" className="panel-action">CRM PIPELINE <ChevronRight size={14} /></Link>
          </div>

          {leadsLoading ? (
            <div className="table-loader">
              <span className="spinner"></span>
              <p>Syncing pipeline events...</p>
            </div>
          ) : leadsData && leadsData.length > 0 ? (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Prospect</th>
                    <th>Inquiry Date</th>
                    <th>Pipeline Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsData.slice(0, 5).map((lead: Lead) => (
                    <tr key={lead.id}>
                      <td className="font-bold">{lead.name}</td>
                      <td>{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td>
                        <span className={`stage-badge ${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span>🔥</span>
              <p>Pipeline is currently empty. Direct customers to the catalog.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Quick Action Desk & Operations Dashboard */}
      <section className="operations-panel glass-panel">
        <div className="panel-header border-b">
          <div className="panel-title-group">
            <Activity size={16} className="panel-icon text-red" />
            <h2>DEALER CONTROLS & DESPATCH</h2>
          </div>
        </div>
        
        <div className="controls-grid">
          <Link href="/dashboard/cars" className="control-card">
            <div className="control-icon accent"><Plus size={20} /></div>
            <div className="control-meta">
              <h4>Load Spec Sheet</h4>
              <p>List new vehicle inventory including performance metrics and photo assets.</p>
            </div>
            <ArrowUpRight size={18} className="arrow-icon" />
          </Link>

          <Link href="/dashboard/bookings" className="control-card">
            <div className="control-icon warning"><Calendar size={20} /></div>
            <div className="control-meta">
              <h4>Track Schedule</h4>
              <p>Confirm test-drives, assign consultants, and finalize viewing details.</p>
            </div>
            <ArrowUpRight size={18} className="arrow-icon" />
          </Link>

          <a href="/#showroom" target="_blank" className="control-card">
            <div className="control-icon success"><Car size={20} /></div>
            <div className="control-meta">
              <h4>View Live Showroom</h4>
              <p>Audit visual changes on public digital catalogs instantly.</p>
            </div>
            <ArrowUpRight size={18} className="arrow-icon" />
          </a>
        </div>
      </section>

      <style jsx>{`
        .overview-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 24px;
          background: #030304;
          min-height: 100vh;
        }

        .welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #09090c;
          border-left: 4px solid var(--accent, #ff3e3e);
          padding: 1.5rem 2rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-left: 4px solid var(--accent, #ff3e3e);
        }

        .welcome-text h1 {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
          color: #fff;
        }

        .welcome-text h1 span {
          color: var(--accent, #ff3e3e);
        }

        .welcome-text p {
          color: #71717a;
          font-size: 0.8rem;
          margin: 0;
        }

        .banner-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #a1a1aa;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .glass-panel {
          background: #09090c;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }

        .stat-card {
          background: #09090c;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.2s ease-in-out;
        }

        .stat-card:hover {
          border-color: rgba(255, 62, 62, 0.2);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #71717a;
        }

        .icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper.accent { background: rgba(255, 62, 62, 0.08); color: #ff3e3e; }
        .icon-wrapper.success { background: rgba(16, 185, 129, 0.08); color: #10b981; }
        .icon-wrapper.info { background: rgba(59, 130, 246, 0.08); color: #3b82f6; }
        .icon-wrapper.warning { background: rgba(139, 92, 246, 0.08); color: #8b5cf6; }
        .icon-wrapper.reward { background: rgba(236, 72, 153, 0.08); color: #ec4899; }
        .icon-wrapper.wait { background: rgba(245, 158, 11, 0.08); color: #f59e0b; }

        .card-value {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
          min-height: 40px;
          display: flex;
          align-items: center;
        }

        .text-glow {
          text-shadow: 0 0 15px rgba(139, 92, 246, 0.25);
        }

        .card-footer {
          font-size: 0.7rem;
          color: #52525b;
          margin: 0;
          font-weight: 500;
        }

        .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .table-wrapper {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-icon {
          color: var(--accent, #ff3e3e);
        }

        .panel-icon.text-red {
          color: #ef4444;
        }

        .panel-header h2 {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin: 0;
          color: #fff;
        }

        .panel-action {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--accent, #ff3e3e);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .custom-table-container {
          overflow-x: auto;
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .custom-table th {
          padding: 0.75rem 1rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #52525b;
          border-bottom: 1px solid #141418;
          text-transform: uppercase;
        }

        .custom-table td {
          padding: 1rem;
          font-size: 0.75rem;
          border-bottom: 1px solid #141418;
          color: #a1a1aa;
        }

        .font-bold {
          font-weight: 600;
          color: #fff;
        }

        .status-pill {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          text-transform: uppercase;
        }

        .status-pill.pending {
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .status-pill.confirmed {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .status-pill.completed {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .stage-badge {
          font-size: 0.6rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stage-badge.new { color: #3b82f6; background: rgba(59, 130, 246, 0.05); border-color: rgba(59, 130, 246, 0.15); }
        .stage-badge.contacted { color: #f59e0b; background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.15); }
        .stage-badge.negotiation { color: #8b5cf6; background: rgba(139, 92, 246, 0.05); border-color: rgba(139, 92, 246, 0.15); }
        .stage-badge.won { color: #10b981; background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.15); }
        .stage-badge.lost { color: #ef4444; background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.15); }

        .operations-panel {
          display: flex;
          flex-direction: column;
        }

        .border-b {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1.2rem 1.5rem;
        }

        .controls-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255, 255, 255, 0.03);
        }

        .control-card {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 1.5rem;
          background: #09090c;
          transition: all 0.2s ease-in-out;
          position: relative;
        }

        .control-card:hover {
          background: rgba(255, 255, 255, 0.01);
        }

        .control-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .control-icon.accent { color: #ff3e3e; background: rgba(255, 62, 62, 0.05); }
        .control-icon.warning { color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
        .control-icon.success { color: #10b981; background: rgba(16, 185, 129, 0.05); }

        .control-meta h4 {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }

        .control-meta p {
          color: #71717a;
          font-size: 0.7rem;
          margin: 0;
          line-height: 1.4;
          max-width: 250px;
        }

        .arrow-icon {
          position: absolute;
          right: 1.5rem;
          top: 1.5rem;
          color: #3f3f46;
          transition: all 0.2s;
        }

        .control-card:hover .arrow-icon {
          color: var(--accent, #ff3e3e);
          transform: translate(2px, -2px);
        }

        .table-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 3rem;
        }

        .table-loader .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 62, 62, 0.05);
          border-top-color: var(--accent, #ff3e3e);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .table-loader p {
          font-size: 0.7rem;
          color: #52525b;
          margin: 0;
          letter-spacing: 1px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem;
          gap: 10px;
        }

        .empty-state span {
          font-size: 1.5rem;
        }

        .empty-state p {
          font-size: 0.75rem;
          color: #52525b;
          margin: 0;
        }

        .skeleton-line {
          height: 24px;
          background: #141418;
          border-radius: 4px;
          display: inline-block;
          animation: pulseShimmer 1.5s infinite;
        }

        .w-12 { width: 50px; }
        .w-16 { width: 70px; }
        .w-24 { width: 110px; }

        @keyframes pulseShimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .split-layout {
            grid-template-columns: 1fr;
          }
          .controls-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
