// app/page.tsx
import { Globe, Activity, Ship, AlertTriangle } from 'lucide-react';

async function getConflictData() {
  // Replace with your actual API keys
  const OIL_API_KEY = "YOUR_NEWSDATA_KEY";
  
  // Example: Fetching Oil News & Sentiment
  const oilRes = await fetch(`https://newsdata.io/api/1/news?apikey=${OIL_API_KEY}&q=brent%20crude%20iran`, { 
    next: { revalidate: 900 } // Refresh every 15 minutes
  });
  const oilData = await oilRes.json();

  // For this example, we'll return a mix of API data and calculated risk
  return {
    oilPrice: 99.86, // In a full build, parse this from a Commodities API
    shipCount: 14,
    news: oilData.results?.slice(0, 3) || []
  };
}

export default async function AutomatedMonitor() {
  const data = await getConflictData();
  
  return (
    <div className="min-h-screen bg-black text-slate-200 p-8 font-mono">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Globe className="text-blue-500" /> LIVE INTELLIGENCE FEED
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards - Now linked to 'data' object */}
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-lg text-center">
          <Activity className="mx-auto mb-2 text-slate-500" />
          <p className="text-xs uppercase text-slate-500">Brent Crude</p>
          <p className="text-4xl font-bold">${data.oilPrice}</p>
        </div>
        {/* ... (Repeat for Ship Count) */}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-sm font-bold text-blue-500 uppercase mb-4 tracking-widest">
          Automated Intelligence Log (via GDELT/NewsData)
        </h3>
        <div className="space-y-4">
          {data.news.map((article: any, i: number) => (
            <div key={i} className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="text-xs text-slate-500 uppercase">{new Date(article.pubDate).toLocaleTimeString()}</p>
              <p className="text-sm text-white font-semibold">{article.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{article.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
