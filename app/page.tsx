import React from 'react';
import { Globe, Activity, Ship, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';

async function getLiveIntelligence() {
  const NEWS_KEY = process.env.OIL_API_KEY;
  const FRED_KEY = process.env.FRED_API_KEY;
  if (!NEWS_KEY || !FRED_KEY) return { oilPrice: "CONFIG ERROR", shipCount: "KEY MISSING", insurance: "AUTH FAILED", news: [], riskLevel: "OFFLINE", lastUpdate: new Date().toLocaleTimeString() };

  try {
    const [oilRes, newsRes] = await Promise.all([
      fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=DCOILBRENTEU&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=1`, { next: { revalidate: 900 } }),
      fetch(`https://newsdata.io/api/1/news?apikey=${NEWS_KEY}&q=Hormuz%20tanker%20attack%20iran&language=en`, { next: { revalidate: 900 } })
    ]);
    const oilData = await oilRes.json();
    const newsData = await newsRes.json();
    const liveOilValue = oilData.observations?.[0]?.value;
    const newsArticles = Array.isArray(newsData.results) ? newsData.results : [];
    const newsString = JSON.stringify(newsArticles).toLowerCase();
    const oilPriceNum = parseFloat(liveOilValue);
    const isEscalating = /attack|seized|missile|explosion|closed|strike/i.test(newsString);
    
    return {
      oilPrice: !isNaN(oilPriceNum) ? `$${oilPriceNum.toFixed(2)}` : "DATA STALE",
      shipCount: isEscalating ? "< 5 (BLOCKADE)" : "12-18 (RESTRICTED)",
      insurance: isEscalating ? "8.5% - 15.0%" : "3.5% - 6.0%",
      news: newsArticles.slice(0, 5),
      riskLevel: (oilPriceNum > 110 || isEscalating) ? "CRITICAL" : "HIGH",
      lastUpdate: new Date().toLocaleTimeString()
    };
  } catch (error) {
    return { oilPrice: "SYNC FAILED", shipCount: "ERROR", insurance: "ERROR", news: [], riskLevel: "OFFLINE", lastUpdate: "RETRYING..." };
  }
}

export default async function GeopoliticalMonitor() {
  const data = await getLiveIntelligence();
  const riskColor = data.riskLevel === "CRITICAL" ? "text-red-500 border-red-500 bg-red-950/30" : "text-orange-500 border-orange-500 bg-orange-950/30";

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-12 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Globe className={`h-6 w-6 ${data.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-blue-400'}`} />
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Hormuz Monitor 2026</h1>
          </div>
          <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
            <span><Clock className="inline mr-1" size={12}/> {data.lastUpdate}</span>
            <span><ShieldAlert className="inline mr-1" size={12}/> SECURE FEED</span>
          </div>
        </div>
        <div className={`px-8 py-3 border-2 rounded-md font-black text-xl tracking-widest ${riskColor}`}>STATUS: {data.riskLevel}</div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard label="Brent Crude" value={data.oilPrice} icon={<Activity size={18} />} footer="FRED API" />
        <StatCard label="Transit Density" value={data.shipCount} icon={<Ship size={18} />} footer="Satellite Proxy" />
        <StatCard label="War Surcharge" value={data.insurance} icon={<AlertTriangle size={18} />} footer="LMA Estimation" />
      </div>

      <div className="max-w-7xl mx-auto bg-slate-900/30 border border-white/5 rounded-xl p-8">
        <h3 className="text-xs font-bold text-blue-500 uppercase mb-8 tracking-[0.4em]">Raw Intelligence Stream</h3>
        <div className="space-y-8">
          {data.news.map((item: any, i: number) => (
            <div key={i} className="group relative border-l border-white/10 pl-8 transition-all hover:border-blue-500/50">
              <p className="text-[10px] text-slate-600 mb-2">{new Date(item.pubDate).toLocaleString()}</p>
              <h4 className="text-white font-bold text-sm mb-2 group-hover:text-blue-400">{item.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-[9px] text-blue-500 font-bold uppercase tracking-widest hover:underline">Full Report &gt;&gt;</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, footer }: any) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-2xl group hover:bg-slate-900/60 transition-all">
      <div className="flex justify-between items-center mb-6 text-slate-500"><span className="text-[10px] uppercase tracking-widest font-bold">{label}</span><div>{icon}</div></div>
      <h2 className="text-4xl font-black tracking-tighter text-white">{value}</h2>
      <p className="text-[8px] text-slate-700 mt-8 font-bold uppercase tracking-widest">{footer}</p>
    </div>
  );
}
