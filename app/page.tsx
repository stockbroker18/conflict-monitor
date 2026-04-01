"use client"; // This is required in Next.js 14+ for interactive components

import React, { useState } from 'react';
import { AlertTriangle, Ship, Activity, TrendingDown, TrendingUp, Globe } from 'lucide-react';

// Define the shape of our data for TypeScript
interface MonitorData {
  oilPrice: number;
  shipCount: number;
  insurancePremium: number;
  riskLevel: "STABLE" | "HIGH" | "CRITICAL";
  lastUpdate: string;
}

export default function ConflictMonitor() {
  // Current 2026 State (Update these values manually to "live" update your site)
  const [data] = useState<MonitorData>({
    oilPrice: 99.86,
    shipCount: 14,
    insurancePremium: 3.5,
    riskLevel: "HIGH",
    lastUpdate: new Date().toLocaleTimeString()
  });

  const getStatusColor = (level: string) => {
    if (level === "CRITICAL") return "text-red-500 bg-red-950 border-red-500";
    if (level === "HIGH") return "text-orange-500 bg-orange-950 border-orange-500";
    return "text-green-500 bg-green-950 border-green-500";
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-white flex items-center gap-3">
            <Globe className="text-blue-500" /> GEOPOLITICAL MONITOR: IRAN 2026
          </h1>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">System Status: Active | Authorized Access Only</p>
        </div>
        <div className={`px-4 py-2 border rounded-sm font-bold text-sm ${getStatusColor(data.riskLevel)}`}>
          RISK LEVEL: {data.riskLevel}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric: Oil Price */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <Activity className="text-slate-400" />
            <span className="text-xs text-red-500 flex items-center gap-1">
              <TrendingDown size={14} /> -3.95%
            </span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Brent Crude (Spot)</p>
          <h2 className="text-4xl font-bold text-white">${data.oilPrice}</h2>
          <p className="text-[10px] text-slate-600 mt-4 italic">De-escalation Floor: $85.00</p>
        </div>

        {/* Metric: Shipping */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <Ship className="text-slate-400" />
            <span className="text-xs text-slate-500 uppercase">Strait of Hormuz</span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Daily Vessel Transits</p>
          <h2 className="text-4xl font-bold text-white">{data.shipCount}</h2>
          <p className="text-[10px] text-slate-600 mt-4 italic">Normal Flow: 130+ daily</p>
        </div>

        {/* Metric: Insurance */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg hover:border-slate-600 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <AlertTriangle className="text-orange-500" />
            <span className="text-xs text-orange-500 uppercase">War Surcharge</span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Insurance Premium</p>
          <h2 className="text-4xl font-bold text-white">{data.insurancePremium}%</h2>
          <p className="text-[10px] text-slate-600 mt-4 italic">Source: LMA Marine Committee</p>
        </div>
      </div>

      {/* Intelligence Log */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> 
          Active Intelligence Log (02 APR 2026)
        </h3>
        <div className="space-y-3 text-[13px]">
          <p className="text-slate-400 border-l-2 border-blue-500 pl-3"><span className="text-blue-500 font-bold">[04:12 GMT]</span> Reports of US Special Envoy arriving in Muscat for "unscheduled" meetings.</p>
          <p className="text-slate-400 border-l-2 border-slate-700 pl-3"><span className="text-blue-500 font-bold">[01:04 GMT]</span> White House confirms Presidential Address for 18:00 EST today.</p>
          <p className="text-slate-400 border-l-2 border-slate-700 pl-3"><span className="text-blue-500 font-bold">[22:15 GMT]</span> Kuwaiti officials report clean-up operations at airport fuel depot; flights resuming.</p>
        </div>
      </div>

      <footer className="mt-8 text-[10px] text-slate-700 flex justify-between uppercase tracking-tighter">
        <p>Last Sync: {data.lastUpdate}</p>
        <p>Encrypted Feed: 256-bit AES</p>
      </footer>
    </div>
  );
}