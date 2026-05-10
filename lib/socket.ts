'use strict';

import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') {
    return null; // Bypass initialization during Next.js SSR phase
  }

  if (!socket) {
    const token = localStorage.getItem('accessToken');
    
    socket = io(API_BASE_URL, {
      auth: {
        token: token || undefined,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    console.log('📡 Socket.IO client connection initialized to:', API_BASE_URL);
  }

  return socket;
};

// Explicit connector to reset authentication variables (e.g. after successful logins)
export const connectSocketWithToken = (token: string): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (socket) {
    socket.disconnect();
  }

  socket = io(API_BASE_URL, {
    auth: {
      token,
    },
    autoConnect: true,
  });

  return socket;
};

// Explicit disconnector (e.g. on user logouts)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
