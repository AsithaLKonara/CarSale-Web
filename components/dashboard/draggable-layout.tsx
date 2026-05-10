'use client';

import React, { useState, useEffect } from 'react';

interface Widget {
  id: string;
  title: string;
  value: string | number;
  sub: string;
  icon: string;
  color: string;
  visible: boolean;
}

export const DraggableLayout: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', title: 'Showroom Fleet', value: '14 Active', sub: '+3 this month', icon: '🏎️', color: 'text-violet-500', visible: true },
    { id: '2', title: 'System Throughput', value: '99.98%', sub: 'Healthy Redis layer', icon: '⚡', color: 'text-emerald-500', visible: true },
    { id: '3', title: 'Average Response Time', value: '18ms', sub: 'Payload GZIP active', icon: '⏱️', color: 'text-blue-500', visible: true },
    { id: '4', title: 'Concierge Conversions', value: '42.3%', sub: '+8.1% AI scoring', icon: '🎯', color: 'text-amber-500', visible: true },
  ]);

  // Load user layout order from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('ultradrive_layout_config');
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse layout preferences', e);
      }
    }
  }, []);

  const saveLayout = (updated: Widget[]) => {
    setWidgets(updated);
    localStorage.setItem('ultradrive_layout_config', JSON.stringify(updated));
  };

  const shiftLeft = (index: number) => {
    if (index === 0) return;
    const temp = [...widgets];
    const item = temp[index];
    temp[index] = temp[index - 1];
    temp[index - 1] = item;
    saveLayout(temp);
  };

  const shiftRight = (index: number) => {
    if (index === widgets.length - 1) return;
    const temp = [...widgets];
    const item = temp[index];
    temp[index] = temp[index + 1];
    temp[index + 1] = item;
    saveLayout(temp);
  };

  const toggleVisibility = (id: string) => {
    const temp = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    saveLayout(temp);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/60 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Dealership Command Console</h2>
          <p className="text-xs text-zinc-400">Rearrange telemetry widgets by clicking controls or toggle widget state filters below.</p>
        </div>
        
        {/* Toggle Controls Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {widgets.map((w) => (
            <button
              key={`toggle-${w.id}`}
              onClick={() => toggleVisibility(w.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-mono transition-all duration-300 ${
                w.visible 
                  ? 'border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20' 
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:bg-zinc-900/80'
              }`}
            >
              <span>{w.icon}</span>
              <span>{w.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, idx) => {
          if (!w.visible) return null;
          return (
            <div
              key={w.id}
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:shadow-2xl"
            >
              {/* Rearrange Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => shiftLeft(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Left"
                >
                  ◀
                </button>
                <button
                  onClick={() => shiftRight(idx)}
                  disabled={idx === widgets.length - 1}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Right"
                >
                  ▶
                </button>
              </div>

              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{w.title}</span>
                <span className={`text-xl ${w.color}`}>{w.icon}</span>
              </div>

              <div>
                <div className="text-3xl font-bold tracking-tight text-white mb-1 font-mono">{w.value}</div>
                <div className="text-[10px] text-zinc-500 font-medium">{w.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DraggableLayout;
