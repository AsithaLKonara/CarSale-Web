'use client';

import React, { useEffect, useState } from 'react';

interface TelemetryPoint {
  id: string;
  x: number;
  y: number;
  city: string;
  vehicle: string;
  type: 'booking' | 'view' | 'inquiry';
  time: string;
}

export const TelemetryMap: React.FC = () => {
  const [points, setPoints] = useState<TelemetryPoint[]>([
    { id: '1', x: 220, y: 140, city: 'London Showroom', vehicle: 'Jesko Absolut', type: 'booking', time: 'Just Now' },
    { id: '2', x: 420, y: 180, city: 'Dubai Marina', vehicle: 'Chiron Super Sport', type: 'inquiry', time: '2 mins ago' },
    { id: '3', x: 120, y: 220, city: 'New York Concierge', vehicle: 'Valour Coupe', type: 'view', time: '5 mins ago' },
    { id: '4', x: 550, y: 290, city: 'Tokyo Ginza', vehicle: 'Nevera hypercar', type: 'booking', time: '10 mins ago' },
  ]);

  // Simulate active real-time booking triggers popping up on our global operations map
  useEffect(() => {
    const vehicles = ['Nevera', 'Jesko Absolut', 'SF90 XX Spider', 'Revuelto V12', 'Valour Coupe', 'Utopia Roadster'];
    const cities = ['Los Angeles', 'Monaco Harbour', 'Singapore Central', 'Zurich Alpine', 'Hong Kong Peak', 'Sydney Cove'];
    const types: ('booking' | 'view' | 'inquiry')[] = ['booking', 'view', 'inquiry'];

    const interval = setInterval(() => {
      const newPoint: TelemetryPoint = {
        id: Math.random().toString(),
        x: Math.floor(Math.random() * 500) + 80,
        y: Math.floor(Math.random() * 200) + 80,
        city: cities[Math.floor(Math.random() * cities.length)],
        vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        type: types[Math.floor(Math.random() * types.length)],
        time: 'Just Now',
      };

      setPoints((prev) => [newPoint, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Live Operations Telemetry Map</h3>
          </div>
          <p className="text-xs text-zinc-500">Active real-time user engagement, concierge appointments, and specification queries.</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono bg-zinc-900/60 border border-zinc-800 p-1.5 px-3 rounded-lg">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Booking
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Inquiry
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> View
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2.5/1] rounded-xl bg-zinc-900/20 border border-zinc-800/40 p-1 overflow-hidden">
        {/* Glassmorphic grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <svg viewBox="0 0 800 350" className="w-full h-full text-zinc-800 opacity-80">
          {/* Abstract global continent silhouettes */}
          <path
            d="M150,120 Q180,90 220,100 T300,150 T380,120 T480,180 T600,130 T720,170 T750,220 L720,290 L600,310 L500,280 L400,290 L320,260 L200,280 L130,220 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="text-zinc-800/60"
          />
          <path
            d="M320,250 Q360,220 400,230 T480,270 T540,240 T620,290 L590,340 L450,330 L380,310 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 4"
            className="text-zinc-800/40"
          />

          {/* Glowing routes */}
          {points.map((p, idx) => (
            <line
              key={`route-${p.id}`}
              x1="400"
              y1="175"
              x2={p.x}
              y2={p.y}
              stroke="url(#route-grad)"
              strokeWidth="0.8"
              strokeDasharray="5 5"
              className="animate-[dash_20s_linear_infinite]"
            />
          ))}

          {/* Gradients definitions */}
          <defs>
            <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Real-Time pulsing beacons */}
          {points.map((p) => {
            const colorClass = 
              p.type === 'booking' ? '#10b981' : 
              p.type === 'inquiry' ? '#f59e0b' : '#3b82f6';
            return (
              <g key={p.id} className="cursor-pointer group">
                <circle cx={p.x} cy={p.y} r="16" fill={colorClass} fillOpacity="0.08" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx={p.x} cy={p.y} r="8" fill={colorClass} fillOpacity="0.15" />
                <circle cx={p.x} cy={p.y} r="4" fill={colorClass} className="shadow-lg" />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Telemetric log feed overlay */}
        <div className="absolute bottom-3 left-3 max-w-[280px] bg-zinc-950/90 border border-zinc-800/80 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 border-b border-zinc-800/60 pb-1">Operational Event Stream</h4>
          <div className="flex flex-col gap-1.5 max-h-[80px] overflow-hidden">
            {points.map((p) => (
              <div key={`feed-${p.id}`} className="flex items-center justify-between gap-2 text-[9px] font-mono leading-none animate-[fadeIn_0.5s_ease-out]">
                <span className="text-zinc-300 truncate w-[140px]">{p.city}: {p.vehicle}</span>
                <span className={`text-[8px] px-1 py-0.5 rounded ${
                  p.type === 'booking' ? 'bg-emerald-500/10 text-emerald-400' :
                  p.type === 'inquiry' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>{p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TelemetryMap;
