'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Calendar, ShieldCheck, 
  CarFront, Percent, Layers, ArrowUpRight 
} from 'lucide-react';

interface MetricOverview {
  totalCars: number;
  totalBookings: number;
  totalEvents: number;
  pageViews: number;
  conversionRate: number;
  distribution: Array<{ name: string; bookings: number; views: number }>;
}

interface CarVisits {
  name: string;
  visits: number;
}

interface BookingStatus {
  status: string;
  count: number;
}

export default function AnalyticsDashboard() {
  // Fetch overview telemetry data
  const { data: overview, isLoading: isOverviewLoading } = useQuery<MetricOverview>({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const res = await api.get('/analytics/overview');
      return res.data.data;
    },
  });

  // Fetch individual car telemetry views
  const { data: carsMetrics, isLoading: isCarsLoading } = useQuery<CarVisits[]>({
    queryKey: ['analytics-cars'],
    queryFn: async () => {
      const res = await api.get('/analytics/cars');
      return res.data.data;
    },
  });

  // Fetch status categories groupings
  const { data: statusMetrics, isLoading: isStatusLoading } = useQuery<BookingStatus[]>({
    queryKey: ['analytics-bookings'],
    queryFn: async () => {
      const res = await api.get('/analytics/bookings');
      return res.data.data;
    },
  });

  const isLoading = isOverviewLoading || isCarsLoading || isStatusLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 col-span-2 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
          <div className="h-96 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 text-zinc-100">
      {/* Title block */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-500">
          <TrendingUp className="h-4 w-4" /> Telemetry Intelligence Core
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Platform Analytics</h1>
        <p className="text-zinc-400">Review real-time conversion rates, visitor trends, and fleet engagement logs.</p>
      </div>

      {/* Metric counters grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Unique Page Views</span>
            <span className="rounded-full bg-zinc-800 p-2 text-zinc-300">
              <Users className="h-4 w-4 text-violet-400" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{overview?.pageViews.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="h-3.5 w-3.5" /> +14.2%
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">Telemetry count from last 30 days</div>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Total VIP Bookings</span>
            <span className="rounded-full bg-zinc-800 p-2 text-zinc-300">
              <Calendar className="h-4 w-4 text-amber-400" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{overview?.totalBookings.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="h-3.5 w-3.5" /> +8.5%
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">All registered VIP reservations</div>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Conversion Rate</span>
            <span className="rounded-full bg-zinc-800 p-2 text-zinc-300">
              <Percent className="h-4 w-4 text-rose-400" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{overview?.conversionRate}%</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="h-3.5 w-3.5" /> +0.9%
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">Bookings per unique visitors ratio</div>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Fleet Spec Sheets</span>
            <span className="rounded-full bg-zinc-800 p-2 text-zinc-300">
              <CarFront className="h-4 w-4 text-emerald-400" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{overview?.totalCars.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="h-3.5 w-3.5" /> +2 new
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">Active models inside global catalogs</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area chart - traffic trends */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-lg font-bold">Showroom Engagement & Reservation Trends</h2>
            <p className="text-sm text-zinc-400">Synchronized charts showing visitors views versus successful VIP filings.</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview?.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="views" name="Impressions (x10)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="bookings" name="Bookings Filed" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status distribution progress logs */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Bookings Lifecycle Sync</h2>
            <p className="text-sm text-zinc-400 mb-6">Aggregate counts grouped by status phase tags.</p>
            <div className="flex flex-col gap-5">
              {statusMetrics?.map((m) => {
                const total = statusMetrics.reduce((acc, curr) => acc + curr.count, 0) || 1;
                const percentage = Math.round((m.count / total) * 100);
                const barColor = m.status === 'Completed' 
                  ? 'bg-emerald-500' 
                  : m.status === 'Confirmed' 
                  ? 'bg-violet-500' 
                  : 'bg-amber-500';

                return (
                  <div key={m.status} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-zinc-300">{m.status}</span>
                      <span className="text-zinc-400">{m.count} logs ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-zinc-900 border border-zinc-800 p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Security Check:</span> All booking cycles are tracked by audit registries to prevent unauthorized modifications.
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Engagement Analytics row */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg font-bold">Fleet Spec Sheet Engagement Rankings</h2>
          <p className="text-sm text-zinc-400">Visits registered on each supercar detail page (tracked via click interaction logs).</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={carsMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
              />
              <Bar dataKey="visits" name="Individual Detail Page Clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
