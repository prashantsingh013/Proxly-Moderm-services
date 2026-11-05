import React from 'react';
import { Clock, Home, Cpu, Wrench, Shield, CheckCircle } from 'lucide-react';

export const ServiceTimeline = ({ timelineTree = {}, historyList = [] }) => {
  if (!historyList || historyList.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center border border-slate-800 text-slate-400">
        <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-300">No Service Records Yet</p>
        <p className="text-xs text-slate-400 mt-1">Completed appliance repairs automatically build your verified maintenance timeline here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(timelineTree).map(([locationLabel, appliances]) => (
        <div key={locationLabel} className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
            <Home className="w-4 h-4" />
            <span>Property Location: {locationLabel}</span>
          </div>

          <div className="space-y-4 pl-2 border-l-2 border-slate-800 ml-2">
            {Object.entries(appliances).map(([applianceName, data]) => (
              <div key={applianceName} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-display font-bold text-sm text-white">{applianceName}</h4>
                    {data.brand && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {data.brand}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {data.events.length} Lifetime Service{data.events.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Event Timeline list */}
                <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/60">
                  {data.events.map((event, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200">
                            {event.repairType ? event.repairType.replace('_', ' ').toUpperCase() : 'SERVICE CHECK'}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                            ₹{event.cost}
                          </span>
                        </div>
                        {event.notes && (
                          <p className="text-[11px] text-slate-400">{event.notes}</p>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
