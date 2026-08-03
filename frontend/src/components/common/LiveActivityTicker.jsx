import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Clock, Zap } from 'lucide-react';

export const LiveActivityTicker = ({ incidents = [] }) => {
  const [ticks, setTicks] = useState(incidents);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    setTicks(incidents);
  }, [incidents]);

  // Simulate continuous real-time hospital heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-xs text-slate-200 tracking-wider uppercase">Live Hospital Activity Ticker</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Refreshed: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <div className="space-y-2">
        {ticks.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">Monitoring active operational channels...</div>
        ) : (
          ticks.map(item => (
            <div key={item.id} className="flex items-start gap-2.5 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              {item.type === 'CRITICAL' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : item.type === 'ALERT' ? (
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-slate-400 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
