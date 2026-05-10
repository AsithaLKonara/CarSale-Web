'use strict';
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, User, Phone, Mail, Clock, ShieldAlert, Check, X, FileText, Bookmark, CalendarClock } from 'lucide-react';
import { api } from '../../../lib/api';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredDate: string;
  status: 'pending' | 'confirmed' | 'completed';
  carInterest?: string;
  notes?: string;
  assignedToId?: string;
  followUpDate?: string;
  createdAt: string;
}

const CONSULTANTS = [
  { id: 'asitha', name: 'Asitha L. Konara (Showroom Director)' },
  { id: 'sarah', name: 'Sarah Jenkins (Hypercar Specialist)' },
  { id: 'marcus', name: 'Marcus Vance (VIP Concierge)' },
  { id: 'elena', name: 'Elena Rostova (Track-day Liaison)' }
];

export default function BookingsManagerPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Tracking custom notes/assignee edits locally before committing
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [localNotes, setLocalNotes] = useState<string>('');
  const [localAssignee, setLocalAssignee] = useState<string>('');
  const [localFollowUp, setLocalFollowUp] = useState<string>('');

  // 1. Fetch VIP bookings stream
  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['bookings', filterStatus],
    queryFn: async () => {
      const response = await api.get('/bookings', {
        params: { status: filterStatus || undefined },
      });
      return response.data?.data?.bookings || response.data?.bookings || [];
    },
  });

  // 2. Mutation for status transition (pending -> confirmed -> completed)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Handle approve/reject/standard patches cleanly
      let endpoint = `/bookings/${id}`;
      if (status === 'confirmed') endpoint = `/bookings/${id}/approve`;
      else if (status === 'rejected') endpoint = `/bookings/${id}/reject`;
      
      const response = await api.patch(endpoint, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // 3. Mutation for scheduling deletion
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // 4. Advanced CRM followup & consultant assignment mutation
  const followupMutation = useMutation({
    mutationFn: async ({ id, notes, assignedToId, followUpDate }: { id: string; notes?: string; assignedToId?: string; followUpDate?: string | null }) => {
      const response = await api.patch(`/bookings/${id}/followup`, {
        notes,
        assignedToId,
        followUpDate: followUpDate || null
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setEditingBookingId(null);
    },
  });

  const handleStatusChange = (id: string, currentStatus: string) => {
    let nextStatus = 'confirmed';
    if (currentStatus === 'confirmed') {
      nextStatus = 'completed';
    } else if (currentStatus === 'completed') {
      nextStatus = 'pending';
    }
    statusMutation.mutate({ id, status: nextStatus });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you absolutely sure you want to revoke this VIP concierge record?')) {
      deleteMutation.mutate(id);
    }
  };

  const startEditing = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setLocalNotes(booking.notes || '');
    setLocalAssignee(booking.assignedToId || '');
    setLocalFollowUp(booking.followUpDate ? new Date(booking.followUpDate).toISOString().split('T')[0] : '');
  };

  const saveEdits = (id: string) => {
    followupMutation.mutate({
      id,
      notes: localNotes,
      assignedToId: localAssignee,
      followUpDate: localFollowUp ? new Date(localFollowUp).toISOString() : null
    });
  };

  return (
    <div className="bookings-container">
      {/* Header Panel */}
      <section className="section-header">
        <div className="header-meta">
          <h1>VIP CONCIERGE SCHEDULER</h1>
          <p>Review private track viewings, verify client profiles, schedule follow-ups, and assign consultants.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="filter-toolbar">
          <button
            onClick={() => setFilterStatus('')}
            className={`filter-btn ${filterStatus === '' ? 'active' : ''}`}
          >
            ALL SCHEDULES
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          >
            PENDING
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
          >
            CONFIRMED
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          >
            COMPLETED
          </button>
        </div>
      </section>

      {/* Main Stream Rendering */}
      {isLoading ? (
        <div className="view-loader">
          <span className="spinner"></span>
          <p>RETRIEVING SCHEDULER STREAMS...</p>
        </div>
      ) : error ? (
        <div className="error-card">
          <span>⚠️</span>
          <p>Failed to sync operational database: {(error as any).message}</p>
        </div>
      ) : bookingsData && bookingsData.length > 0 ? (
        <div className="bookings-grid">
          {bookingsData.map((booking: Booking) => {
            const isEditing = editingBookingId === booking.id;
            const assignedConsultant = CONSULTANTS.find(c => c.id === booking.assignedToId);

            return (
              <div key={booking.id} className={`booking-card glass-panel status-${booking.status}`}>
                <div className="card-top">
                  <div className="status-badge-container">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="delete-card-btn"
                    title="Revoke client request"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="client-identity">
                  <h3>{booking.name.toUpperCase()}</h3>
                  <span className="client-contact"><Mail size={11} /> {booking.email.toLowerCase()}</span>
                  {booking.phone && <span className="client-contact phone"><Phone size={11} /> {booking.phone}</span>}
                </div>

                <div className="viewing-specs">
                  <div className="spec-row">
                    <span className="spec-label">VEHICLE FOCUS</span>
                    <span className="spec-value text-accent">
                      {booking.carInterest?.toUpperCase() || 'GENERAL CONSULTATION'}
                    </span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">ALLOCATED DATE</span>
                    <span className="spec-value highlight">
                      {new Date(booking.preferredDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Inline CRM Follow-up & Assignment controls */}
                <div className="crm-workspace border-t">
                  {isEditing ? (
                    <div className="crm-edit-form">
                      <div className="form-group">
                        <label>ASSIGN CONSULTANT</label>
                        <select 
                          value={localAssignee}
                          onChange={(e) => setLocalAssignee(e.target.value)}
                          className="crm-select"
                        >
                          <option value="">Unassigned</option>
                          {CONSULTANTS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>NEXT FOLLOWUP TASK</label>
                        <input 
                          type="date"
                          value={localFollowUp}
                          onChange={(e) => setLocalFollowUp(e.target.value)}
                          className="crm-date"
                        />
                      </div>

                      <div className="form-group">
                        <label>VIP DOSSIER NOTES</label>
                        <textarea
                          rows={3}
                          value={localNotes}
                          onChange={(e) => setLocalNotes(e.target.value)}
                          className="crm-textarea"
                          placeholder="e.g. Client requests carbon track package options..."
                        />
                      </div>

                      <div className="form-actions-row">
                        <button 
                          onClick={() => saveEdits(booking.id)}
                          disabled={followupMutation.isPending}
                          className="crm-save-btn"
                        >
                          {followupMutation.isPending ? 'SAVING...' : 'SAVE CHANGES'}
                        </button>
                        <button 
                          onClick={() => setEditingBookingId(null)}
                          className="crm-cancel-btn"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="crm-static-view">
                      <div className="crm-meta-row">
                        <User size={12} className="meta-icon" />
                        <span>Consultant: <strong>{assignedConsultant ? assignedConsultant.name : 'Unassigned'}</strong></span>
                      </div>
                      
                      {booking.followUpDate && (
                        <div className="crm-meta-row">
                          <CalendarClock size={12} className="meta-icon text-yellow" />
                          <span>Followup: <strong className="text-yellow">{new Date(booking.followUpDate).toLocaleDateString()}</strong></span>
                        </div>
                      )}

                      {booking.notes ? (
                        <div className="client-notes">
                          <p className="notes-label">VIP DOSSIER / NOTES</p>
                          <p className="notes-content">"{booking.notes}"</p>
                        </div>
                      ) : (
                        <p className="empty-notes-prompt">No custom dossier logs captured yet.</p>
                      )}

                      <button 
                        onClick={() => startEditing(booking)}
                        className="crm-edit-trigger-btn"
                      >
                        <FileText size={12} /> UPDATE DOSSIER & ASSIGNMENT
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleStatusChange(booking.id, booking.status)}
                    disabled={statusMutation.isPending}
                    className={`status-toggle-btn ${booking.status}`}
                  >
                    {booking.status === 'pending' && 'CONFIRM BOOKING'}
                    {booking.status === 'confirmed' && 'MARK AS COMPLETED'}
                    {booking.status === 'completed' && 'RESET TO PENDING'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-scheduler glass-panel">
          <span>📅</span>
          <h3>SCHEDULER LOGS EMPTY</h3>
          <p>No VIP tracks are scheduled matching the chosen status.</p>
        </div>
      )}

      <style jsx>{`
        .bookings-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 24px;
          background: #030304;
          min-height: 100vh;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #09090c;
          border-left: 4px solid #ff3e3e;
          padding: 1.5rem 2rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-left: 4px solid #ff3e3e;
          gap: 2rem;
        }

        .header-meta h1 {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
          color: #fff;
        }

        .header-meta p {
          color: #71717a;
          font-size: 0.8rem;
          margin: 0;
        }

        .filter-toolbar {
          display: flex;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 8px;
          gap: 2px;
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: #71717a;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .filter-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }

        .filter-btn.active {
          color: #fff;
          background: rgba(255, 62, 62, 0.08);
          border: 1px solid rgba(255, 62, 62, 0.15);
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .booking-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #09090c;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          transition: all 0.2s ease-in-out;
        }

        .booking-card:hover {
          border-color: rgba(255, 62, 62, 0.2);
          box-shadow: 0 10px 30px -15px rgba(255, 62, 62, 0.1);
          transform: translateY(-2px);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          font-size: 0.55rem;
          font-weight: 850;
          letter-spacing: 1.5px;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .status-badge.confirmed {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .status-badge.completed {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .delete-card-btn {
          background: transparent;
          border: none;
          color: #52525b;
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-card-btn:hover {
          color: #ef4444;
        }

        .client-identity {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .client-identity h3 {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin: 0;
          color: #fff;
        }

        .client-contact {
          font-size: 0.7rem;
          color: #71717a;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .client-contact.phone {
          color: #52525b;
        }

        .viewing-specs {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.68rem;
        }

        .spec-label {
          color: #52525b;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .spec-value {
          font-weight: 800;
        }

        .spec-value.highlight {
          color: #fff;
        }

        .spec-value.text-accent {
          color: #ff3e3e;
          text-shadow: 0 0 10px rgba(255, 62, 62, 0.15);
        }

        .crm-workspace {
          padding-top: 1rem;
        }

        .border-t {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .crm-edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 6px;
        }

        .crm-edit-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .crm-edit-form .form-group label {
          font-size: 0.58rem;
          font-weight: 850;
          color: #52525b;
          letter-spacing: 1px;
        }

        .crm-select, .crm-date {
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 0.7rem;
          color: #fff;
          outline: none;
        }

        .crm-textarea {
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 8px 10px;
          font-size: 0.7rem;
          color: #fff;
          outline: none;
          resize: vertical;
        }

        .form-actions-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .crm-save-btn {
          flex: 2;
          background: #ff3e3e;
          border: none;
          color: #fff;
          font-size: 0.62rem;
          font-weight: 850;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .crm-cancel-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .crm-static-view {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .crm-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.65rem;
          color: #71717a;
        }

        .meta-icon {
          color: #52525b;
        }

        .text-yellow {
          color: #eab308;
        }

        .client-notes {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255, 255, 255, 0.01);
          border-left: 2px solid rgba(255, 255, 255, 0.05);
          padding-left: 8px;
          margin: 4px 0;
        }

        .notes-label {
          font-size: 0.58rem;
          font-weight: 800;
          color: #52525b;
          margin: 0;
        }

        .notes-content {
          font-size: 0.68rem;
          line-height: 1.4;
          color: #a1a1aa;
          margin: 0;
          font-style: italic;
        }

        .empty-notes-prompt {
          font-size: 0.65rem;
          color: #3f3f46;
          font-style: italic;
          margin: 4px 0;
        }

        .crm-edit-trigger-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          color: #71717a;
          font-size: 0.62rem;
          font-weight: 750;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .crm-edit-trigger-btn:hover {
          border-color: rgba(255, 62, 62, 0.15);
          color: #ff3e3e;
          background: rgba(255, 62, 62, 0.01);
        }

        .card-actions {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 1rem;
        }

        .status-toggle-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 1px;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .status-toggle-btn:hover {
          background: #ff3e3e;
          border-color: #ff3e3e;
          color: #fff;
          box-shadow: 0 5px 15px -5px rgba(255, 62, 62, 0.4);
        }

        .view-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 8rem;
          text-align: center;
        }

        .view-loader .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 62, 62, 0.1);
          border-top-color: #ff3e3e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .view-loader p {
          font-size: 0.75rem;
          letter-spacing: 3px;
          color: #52525b;
          font-weight: 750;
          margin: 0;
        }

        .error-card {
          background: rgba(255, 62, 62, 0.06);
          border: 1px solid rgba(255, 62, 62, 0.15);
          border-radius: 10px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .error-card span {
          font-size: 1.5rem;
        }

        .error-card p {
          font-size: 0.85rem;
          color: #ff8a8a;
          font-weight: 600;
          margin: 0;
        }

        .empty-scheduler {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .empty-scheduler span {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-scheduler h3 {
          font-size: 0.9rem;
          font-weight: 850;
          letter-spacing: 2px;
          margin: 0 0 0.5rem 0;
        }

        .empty-scheduler p {
          font-size: 0.75rem;
          color: #71717a;
          margin: 0;
          letter-spacing: 0.5px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
