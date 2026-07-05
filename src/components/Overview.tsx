import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, Layers, Sprout, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const mockData = [
  { month: 'Nov', SA: 0.42, Zambia: 0.28, Tanzania: 0.35 },
  { month: 'Dec', SA: 0.45, Zambia: 0.35, Tanzania: 0.40 },
  { month: 'Jan', SA: 0.49, Zambia: 0.48, Tanzania: 0.46 },
  { month: 'Feb', SA: 0.52, Zambia: 0.58, Tanzania: 0.52 },
  { month: 'Mar', SA: 0.55, Zambia: 0.60, Tanzania: 0.55 },
  { month: 'Apr', SA: 0.50, Zambia: 0.52, Tanzania: 0.48 },
  { month: 'May', SA: 0.44, Zambia: 0.44, Tanzania: 0.42 },
  { month: 'Jun', SA: 0.38, Zambia: 0.36, Tanzania: 0.37 },
  { month: 'Jul', SA: 0.34, Zambia: 0.30, Tanzania: 0.32 },
  { month: 'Aug', SA: 0.31, Zambia: 0.26, Tanzania: 0.29 },
  { month: 'Sep', SA: 0.30, Zambia: 0.23, Tanzania: 0.27 },
  { month: 'Oct', SA: 0.32, Zambia: 0.24, Tanzania: 0.28 },
];

export default function Overview({ onNavigateToZambia }: { onNavigateToZambia: () => void }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Continental Crop Overview</h2>
        <p className="text-sm text-text-secondary mt-1">
          High-level agricultural indices and telemetry computed on the Cloudflare Edge network via Digital Earth Africa.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total Monitored Area</span>
            <h3 className="text-2xl font-bold text-white mt-1">142,500 Ha</h3>
            <span className="text-xs text-brand-primary flex items-center gap-1 mt-2">
              <ArrowUpRight size={14} /> +4.2% YoY growth
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <Layers size={24} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Continental EVI Avg</span>
            <h3 className="text-2xl font-bold text-white mt-1">0.452</h3>
            <span className="text-xs text-brand-primary flex items-center gap-1 mt-2">
              <CheckCircle2 size={14} /> Stable Vegetative Health
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary border border-brand-secondary/20">
            <Sprout size={24} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Active Risk Zones</span>
            <h3 className="text-2xl font-bold text-white mt-1">1 Warning</h3>
            <span className="text-xs text-red-500 flex items-center gap-1 mt-2">
              <ShieldAlert size={14} /> Southern Province Drought
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <ShieldAlert size={24} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Cloud Masking Status</span>
            <h3 className="text-2xl font-bold text-white mt-1">Active SCL</h3>
            <span className="text-xs text-brand-primary flex items-center gap-1 mt-2">
              <CheckCircle2 size={14} /> 99.8% Cloud Cover Filtered
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts & Risk Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white">Comparative Vegetation Health (EVI)</h4>
              <p className="text-xs text-text-secondary">EVI trend cycle comparison across major monitored regional targets</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>Zambia</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-secondary"></span>SA</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-accent"></span>Tanzania</span>
            </div>
          </div>
          
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorZambia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTanzania" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2E43" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[0.1, 0.8]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151D2A', borderColor: '#1F2E43', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Zambia" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorZambia)" />
                <Area type="monotone" dataKey="SA" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSA)" />
                <Area type="monotone" dataKey="Tanzania" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorTanzania)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info & Side Callouts Card */}
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Strategic Resilience Alerts</h4>
            <p className="text-xs text-text-secondary mt-1">Key anomalies flagged by Earth Observation (EO) data</p>
            
            <div className="mt-5 space-y-4">
              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="flex gap-2.5">
                  <ShieldAlert className="text-red-500 shrink-0" size={18} />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Southern Province Drought warning</h5>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      Sentinel-2 EVI values indicate a 20% decline below the 5-year baseline in Southern Zambia due to early seasonal rainfall deficit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg">
                <div className="flex gap-2.5">
                  <Sprout className="text-brand-primary shrink-0" size={18} />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Mkushi Farm Block Growth</h5>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      Commercial soy and maize show steady vegetative biomass index matching optimistic historical averages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onNavigateToZambia}
            className="w-full mt-6 py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-colors duration-200"
          >
            Launch Zambia Deep-Dive
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
