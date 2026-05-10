'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, User, Phone, Mail, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../../../lib/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  status: 'new' | 'contacted' | 'interested' | 'negotiating' | 'closed' | 'lost';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  followUpDate?: string;
}

const COLUMNS: { key: Lead['status']; label: string; color: string }[] = [
  { key: 'new', label: 'NEW INQUIRY', color: '#3b82f6' },
  { key: 'contacted', label: 'CONTACTED', color: '#8b5cf6' },
  { key: 'interested', label: 'INTERESTED', color: '#eab308' },
  { key: 'negotiating', label: 'NEGOTIATING', color: '#f97316' },
  { key: 'closed', label: 'CLOSED/WON', color: '#10b981' },
  { key: 'lost', label: 'LOST', color: '#ef4444' },
];

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Query leads database list
  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await api.get('/leads');
      return response.data?.data?.leads || response.data?.leads || [];
    },
  });

  // Consolidated Mutation to update Lead properties (status, priority, followUpDate)
  const updateLeadMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      priority, 
      followUpDate 
    }: { 
      id: string; 
      status?: Lead['status']; 
      priority?: Lead['priority']; 
      followUpDate?: string | null 
    }) => {
      const payload: any = {};
      if (status) payload.status = status;
      if (priority) payload.priority = priority;
      if (followUpDate !== undefined) payload.followUpDate = followUpDate;
      
      await api.put(`/leads/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const filteredLeads = leads
    ? leads.filter((lead) => priorityFilter === 'all' || lead.priority === priorityFilter)
    : [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Lead['status']) => {
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      updateLeadMutation.mutate({ id: leadId, status: targetStatus });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  // Helper: Calculate aging in days
  const getAgingDays = (createdAtStr: string) => {
    const createdDate = new Date(createdAtStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? 'New today' : `${diffDays}d aging`;
  };

  // Helper: Format priority text nicely (hot, warm, cold)
  const getPriorityLabel = (priority: Lead['priority']) => {
    if (priority === 'high') return 'HOT';
    if (priority === 'medium') return 'WARM';
    return 'COLD';
  };

  return (
    <div className="leads-container">
      <header className="leads-header">
        <div className="title-area">
          <h1>CRM PIPELINE & WORKFLOWS</h1>
          <p>Drag leads through columns to update customer states instantly. Manage follow-up calendars.</p>
        </div>
        <div className="filter-controls">
          <label>PRIORITY FILTER:</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">ALL INQUIRIES</option>
            <option value="high">🔥 HOT LEADS</option>
            <option value="medium">⚡ WARM LEADS</option>
            <option value="low">❄️ COLD LEADS</option>
          </select>
        </div>
      </header>

      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Syncing CRM pipelines...</p>
        </div>
      ) : (
        <div className="kanban-grid">
          {COLUMNS.map((col) => {
            const columnLeads = filteredLeads.filter((l) => l.status === col.key);

            return (
              <div
                key={col.key}
                className="kanban-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="column-header" style={{ borderTop: `3px solid ${col.color}` }}>
                  <h3>{col.label}</h3>
                  <span className="count-pill">{columnLeads.length}</span>
                </div>

                <div className="cards-wrapper">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`lead-card priority-${lead.priority}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                    >
                      <div className="card-top">
                        <span className="source-tag">{lead.source || 'SHOWROOM'}</span>
                        
                        {/* Rapid Priority Changer */}
                        <select 
                          className={`priority-select ${lead.priority}`}
                          value={lead.priority}
                          onChange={(e) => updateLeadMutation.mutate({ id: lead.id, priority: e.target.value as Lead['priority'] })}
                        >
                          <option value="high">🔥 HOT</option>
                          <option value="medium">⚡ WARM</option>
                          <option value="low">❄️ COLD</option>
                        </select>
                      </div>

                      <h4 className="client-name">{lead.name}</h4>
                      
                      <div className="meta-list">
                        <p className="client-meta"><Mail size={11} /> {lead.email}</p>
                        {lead.phone && <p className="client-meta"><Phone size={11} /> {lead.phone}</p>}
                      </div>

                      {lead.message && <p className="lead-msg">"{lead.message}"</p>}

                      {/* Aging & Follow-Up Section */}
                      <div className="card-scheduler border-t">
                        <div className="aging-row">
                          <Clock size={11} className="icon" />
                          <span>{getAgingDays(lead.createdAt)}</span>
                        </div>
                        
                        {/* Inline Follow-Up Scheduler */}
                        <div className="followup-row">
                          <Calendar size={11} className="icon" />
                          <input 
                            type="date" 
                            value={lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const selectedDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                              updateLeadMutation.mutate({ id: lead.id, followUpDate: selectedDate });
                            }}
                            className="followup-date-picker"
                            title="Set followup task date"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="column-empty">
                      <span>📭</span>
                      <p>Pipeline is clean.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .leads-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 24px;
          background: #030304;
          min-height: 100vh;
        }

        .leads-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #09090c;
          border-left: 4px solid #ff3e3e;
          padding: 1.5rem 2rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-left: 4px solid #ff3e3e;
        }

        .title-area h1 {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
          color: #fff;
        }

        .title-area p {
          color: #71717a;
          font-size: 0.8rem;
          margin: 0;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-controls label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #71717a;
          letter-spacing: 1px;
        }

        .filter-controls select {
          background: #09090c;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8rem 0;
          gap: 1.5rem;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 62, 62, 0.1);
          border-top-color: #ff3e3e;
          border-radius: 50%;
          animation: spin 0.8s infinite linear;
        }

        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.2rem;
          align-items: start;
        }

        .kanban-column {
          background: #09090c;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.01);
          border-radius: 10px 10px 0 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .column-header h3 {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin: 0;
          color: #71717a;
        }

        .count-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.6rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          color: #a1a1aa;
        }

        .cards-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem;
          flex: 1;
        }

        .lead-card {
          background: #0d0d12;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1rem;
          cursor: grab;
          transition: all 0.2s ease-in-out;
        }

        .lead-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 62, 62, 0.2);
          background: #111116;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .source-tag {
          font-size: 0.52rem;
          font-weight: 850;
          color: #ff3e3e;
          background: rgba(255, 62, 62, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 1px;
        }

        .priority-select {
          background: transparent;
          border: none;
          font-size: 0.58rem;
          font-weight: 850;
          cursor: pointer;
          outline: none;
        }

        .priority-select.high { color: #ef4444; }
        .priority-select.medium { color: #eab308; }
        .priority-select.low { color: #3b82f6; }

        .client-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .client-meta {
          font-size: 0.65rem;
          color: #71717a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          word-break: break-all;
        }

        .lead-msg {
          font-size: 0.68rem;
          color: #a1a1aa;
          background: rgba(255, 255, 255, 0.01);
          border-left: 2px solid rgba(255, 255, 255, 0.05);
          padding: 6px 8px;
          border-radius: 0 4px 4px 0;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .card-scheduler {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 0.75rem;
        }

        .border-t {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .aging-row, .followup-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.62rem;
          color: #52525b;
          font-weight: 600;
        }

        .aging-row .icon, .followup-row .icon {
          color: #3f3f46;
        }

        .followup-date-picker {
          background: transparent;
          border: none;
          color: #a1a1aa;
          font-family: inherit;
          font-size: 0.62rem;
          outline: none;
          cursor: pointer;
          width: 100%;
        }

        .followup-date-picker::-webkit-calendar-picker-indicator {
          filter: invert(1);
          font-size: 0.6rem;
          opacity: 0.3;
        }

        .followup-date-picker::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }

        .column-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          color: #52525b;
        }

        .column-empty span {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
          opacity: 0.4;
        }

        .column-empty p {
          font-size: 0.65rem;
          margin: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .kanban-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kanban-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
