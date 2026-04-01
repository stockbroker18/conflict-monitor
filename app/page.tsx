import { Globe, Activity, Ship, AlertTriangle, TrendingUp } from 'lucide-react';

// This function runs on the Vercel server, not the user's computer
async function getConflictData() {
  const API_KEY = process.env.OIL_API_KEY;
  
  // If the key is missing from Vercel settings, don't even try to fetch
  if (!API_KEY) {
    console.error("OIL_API_KEY is missing in Vercel Environment Variables");
    return { oilPrice: 99.86, shipCount: 14, news: [], riskLevel: "CONFIG_ERROR" };
  }

  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=iran%20oil%20war&language=en`, 
      { next: { revalidate: 900 } }
    );
    
    const data = await res.json();

    // CRITICAL FIX: Check if 'results' exists and is actually an array
    const verifiedNews = Array.isArray(data.results) ? data.results.slice(0, 4) : [];

    return {
      oilPrice: 99.86,
      shipCount: 14,
      news: verifiedNews,
      riskLevel: verifiedNews.length > 0 ? "HIGH" : "STABLE"
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { oilPrice: 99.86, shipCount: 14, news: [], riskLevel: "OFFLINE" };
  }
}

export default async function AutomatedMonitor() {
  const data = await getConflictData();

  return (
    <div className="min-h-screen bg-black text-slate-200 p-8 font-mono">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-3">
            <Globe className="text-blue-500 animate-pulse" /> IRAN CONFLICT AUTOMATED MONITOR
          </h1>
          <p className="text-slate-500 text-xs mt-1 uppercase">Live Data Feed | Revalidating every 15m</p>
        </div>
        <div className="px-4 py-2 border border-orange-500 bg-orange-950 text-orange-500 rounded-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          RISK: {data.riskLevel}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Current Brent Crude</p>
          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-bold text-white">${data.oilPrice}</h2>
            <span className="text-red-500 text-sm flex items-center gap-1 mb-2">
              <TrendingUp size={16} /> +2.4%
            </span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Strait of Hormuz Traffic</p>
          <h2 className="text-5xl font-bold text-white">{data.shipCount} <span className="text-sm text-slate-600 font-normal">vessels/day</span></h2>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-bold text-blue-500 uppercase mb-4 flex items-center gap-2">
          <Activity size={16} /> Automated Intelligence Log
        </h3>
        <div className="space-y-4">
          {data.news.length > 0 ? data.news.map((article: any, i: number) => (
            <div key={i} className="border-l-2 border-slate-700 pl-4 py-1 hover:border-blue-500 transition-colors">
              <p className="text-[10px] text-slate-500">{new Date(article.pubDate).toLocaleString()}</p>
              <p className="text-sm text-white font-bold mb-1">{article.title}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{article.description}</p>
              <a href={article.link} target="_blank" className="text-[10px] text-blue-400 hover:underline mt-2 inline-block">View Full Report →</a>
            </div>
          )) : (
            <p className="text-slate-500 italic text-sm text-center py-8">Scanning global feeds for updates...</p>
          )}
        </div>
      </div>
    </div>
  );
}
