'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside React Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="error-boundary-screen">
          <div className="error-card">
            <AlertOctagon size={48} className="icon" />
            <h2>Interactive Panel Interrupted</h2>
            <p className="message">
              {this.state.error?.message || 'A lightweight view state issue occurred while rendering this module.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="retry-btn"
            >
              Reload Interface
            </button>
          </div>
          <style jsx>{`
            .error-boundary-screen {
              min-height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #09090b;
              color: #fff;
              padding: 40px;
              border-radius: 8px;
              border: 1px solid rgba(255, 62, 62, 0.15);
            }
            .error-card {
              text-align: center;
              max-width: 420px;
            }
            .icon {
              color: #ff3e3e;
              margin-bottom: 20px;
              animation: pulse 2s infinite;
            }
            h2 {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            .message {
              color: #71717a;
              font-size: 13px;
              line-height: 1.5;
              margin-bottom: 24px;
            }
            .retry-btn {
              background: #ff3e3e;
              color: #fff;
              border: none;
              padding: 10px 24px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s;
              font-size: 13px;
            }
            .retry-btn:hover {
              opacity: 0.9;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
