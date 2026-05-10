'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { Bell, Calendar, CarFront, AlertCircle, CheckCircle, CheckCheck } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'inventory' | 'alert';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch alerts from backend
  const { data, isLoading } = useQuery<{ notifications: NotificationItem[] }>({
    queryKey: ['notifications-list'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=25');
      return res.data.data;
    },
  });

  const list = data?.notifications || [];
  const unreadCount = list.filter(item => !item.isRead).length;

  // Mutation to mark individual alert read
  const readMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
    },
  });

  // Mutation to mark all alerts read
  const readAllMutation = useMutation({
    mutationFn: async () => {
      await api.post('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
      // Sync across other socket rooms
      const s = getSocket();
      if (s) s.emit('notification:read_all');
    },
  });

  // Attach socket triggers for real-time live dispatches
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handleNewNotification = (notice: NotificationItem) => {
      console.log('🔔 Real-time notification received:', notice);
      // Prepend or refresh lists
      queryClient.setQueryData(['notifications-list'], (oldData: any) => {
        if (!oldData) return { notifications: [notice] };
        return {
          notifications: [notice, ...oldData.notifications],
        };
      });

      // Show beautiful HTML5 alert banner if browser permissions granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notice.title, { body: notice.message });
      }
    };

    s.on('notification:created', handleNewNotification);
    
    s.on('notification:synced_read_all', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
    });

    return () => {
      s.off('notification:created', handleNewNotification);
      s.off('notification:synced_read_all');
    };
  }, [queryClient]);

  // Request native permission triggers
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Close dropdown on clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div className="notifications-container" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`bell-trigger ${isOpen ? 'active' : ''}`}
        aria-label="Alerts"
      >
        <Bell className="h-5 w-5 icon-bell" />
        {unreadCount > 0 && (
          <span className="unread-badge animate-pulse">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="alerts-dropdown border border-zinc-800 bg-zinc-950 shadow-2xl rounded-xl">
          <div className="dropdown-header border-b border-zinc-800">
            <h3 className="header-title">Alert Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => readAllMutation.mutate()} 
                className="dismiss-all-btn text-xs font-semibold hover:text-violet-400"
              >
                <CheckCheck className="h-3.5 w-3.5" /> MARK READ
              </button>
            )}
          </div>

          <div className="dropdown-list">
            {isLoading ? (
              <div className="list-loading-state">
                <div className="spinner-mini"></div>
              </div>
            ) : list.length === 0 ? (
              <div className="list-empty-state">
                <CheckCircle className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="text-zinc-400 text-sm font-semibold">Clean Sheet</p>
                <p className="text-zinc-500 text-xs text-center px-4 mt-0.5">All notifications have been cleared.</p>
              </div>
            ) : (
              list.map((item) => {
                const Icon = item.type === 'booking' 
                  ? Calendar 
                  : item.type === 'inventory' 
                  ? CarFront 
                  : AlertCircle;

                const themeColor = item.type === 'booking' 
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                  : item.type === 'inventory' 
                  ? 'text-violet-400 bg-violet-500/10 border-violet-500/20' 
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <div 
                    key={item.id} 
                    onClick={() => !item.isRead && readMutation.mutate(item.id)}
                    className={`dropdown-item border-b border-zinc-900 ${item.isRead ? 'read' : 'unread'}`}
                  >
                    <div className={`item-icon border ${themeColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="item-content">
                      <p className="item-title">{item.title}</p>
                      <p className="item-message">{item.message}</p>
                      <span className="item-time">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!item.isRead && (
                      <span className="unread-dot bg-violet-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notifications-container {
          position: relative;
          display: inline-block;
          font-family: 'Outfit', sans-serif;
        }

        .bell-trigger {
          position: relative;
          background: transparent;
          border: none;
          color: #71717a;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bell-trigger:hover, .bell-trigger.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .unread-badge {
          position: absolute;
          top: 3px;
          right: 3px;
          background: #8b5cf6;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          height: 16px;
          min-width: 16px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
        }

        .alerts-dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 360px;
          max-height: 480px;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
        }

        .header-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .dismiss-all-btn {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s;
        }

        .dropdown-list {
          overflow-y: auto;
          flex-grow: 1;
          max-height: 400px;
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .dropdown-item.unread {
          background: rgba(139, 92, 246, 0.02);
        }

        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .item-message {
          font-size: 0.75rem;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .item-time {
          font-size: 0.65rem;
          color: #52525b;
          font-weight: 600;
          margin-top: 4px;
        }

        .unread-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          right: 1.25rem;
          top: 1.5rem;
          box-shadow: 0 0 6px rgba(139, 92, 246, 0.6);
        }

        .list-loading-state {
          padding: 3rem 0;
          display: flex;
          justify-content: center;
        }

        .spinner-mini {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .list-empty-state {
          padding: 3.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
