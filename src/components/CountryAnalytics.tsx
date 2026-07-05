import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sprout, Cloud, ArrowDownRight, ArrowUpRight, ShieldCheck, Loader2 } from 'lucide-react';

interface CropDataPoint {
  month: string;
  evi: number;
  historicalAverage: number;
  cloudCoverPct: number;
}

export default function CountryAnalytics() {
  const [selectedCountry, setSelectedCountry] = useState('zambia');
  const [selectedRegion, setSelectedRegion] = useState('mkushi');
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [loading, setLoading] = useState(false);
  const [seriesData, setSeriesData] = useState<CropDataPoint[]>([]);

  // Update default region when country changes
  useEffect(() => {
    if (selectedCountry === 'zambia') {
      setSelectedRegion('mkushi');
    } else if (selectedCountry === 'tanzania') {
      setSelectedRegion('sua');
    } else {
      setSelectedRegion('southern'); // South Africa proxy region or Southern Province
    }
  }, [selectedCountry]);

  // Fetch EVI series from backend
  useEffect(() => {
    const fetchEviData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/evi?region=${selectedRegion}&season=${selectedSeason}`);
        if (response.ok) {
          const res = await response.json();
          setSeriesData(res.series || []);
        }
      } catch (err) {
        console.error("Error fetching EVI data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEviData();
  }, [selectedRegion, selectedSeason]);

  // Compute summary stats
  const eviValues = seriesData.map(d => d.evi);
  const maxEvi = eviValues.length ? Math.max(...eviValues) : 0;
  const avgEvi = eviValues.length ? parseFloat((eviValues.reduce((a, b) => a + b, 0) / eviValues.length).toFixed(3)) : 0;
  const avgHist = seriesData.length ? parseFloat((seriesData.map(d => d.historicalAverage).reduce((a, b) => a + b, 0) / seriesData.length).toFixed(3)) : 0;
  
  const pctChange = avgHist ? parseFloat((((avgEvi - avgHist) / avgHist) * 100).toFixed(1)) : 0;
  const avgCloudCover = seriesData.length ? parseFloat((seriesData.map(d => d.cloudCoverPct).reduce((a, b) => a + b, 0) / seriesData.length).toFixed(1)) : 0;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Regional Crop Health Analytics</h2>
          <p className="text-sm text-text-secondary mt-1">
            Compare crop vegetative growth curves and identify deviations from historical baselines.
          </p>
        </div>

        {/* Global Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-card border border-border p-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase px-1 mb-1">Country</span>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-background border border-border text-white text-xs rounded-lg px-3 py-1.5 focus:border-brand-primary outline-none"
            >
              <option value="zambia">Zambia</option>
              <option value="tanzania">Tanzania</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase px-1 mb-1">Observation Zone</span>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-background border border-border text-white text-xs rounded-lg px-3 py-1.5 focus:border-brand-primary outline-none"
            >
              {selectedCountry === 'zambia' ? (
                <>
                  <option value="mkushi">Mkushi Farm Block (Maize/Soy)</option>
                  <option value="southern">Southern Province (Smallholders)</option>
                </>
              ) : (
                <option value="sua">SUA Experimental Farms (Tanzania)</option>
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase px-1 mb-1">Crop Season</span>
            <select 
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-background border border-border text-white text-xs rounded-lg px-3 py-1.5 focus:border-brand-primary outline-none"
            >
              <option value="2024-2025">2024 - 2025 (Current)</option>
              <option value="2023-2024">2023 - 2024 (El Niño Drought)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Overview and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Season Statistics</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Sprout size={16} className="text-brand-primary" /> Max EVI Recorded
                </span>
                <span className="text-base font-bold text-white">{maxEvi || '--'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Sprout size={16} className="text-brand-secondary" /> Average EVI
                </span>
                <span className="text-base font-bold text-white">{avgEvi || '--'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Sprout size={16} className="text-brand-accent" /> Deviation from Baseline
                </span>
                <span className={`text-sm font-bold flex items-center gap-0.5 ${pctChange >= 0 ? 'text-brand-primary' : 'text-red-500'}`}>
                  {pctChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {pctChange}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary flex items-center gap-2">
                  <Cloud size={16} className="text-text-muted" /> Cloud Interference (SCL)
                </span>
                <span className="text-base font-bold text-white">{avgCloudCover}%</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Data Integrity Check</h4>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="text-brand-primary shrink-0" size={18} />
              <div>
                <h5 className="text-xs font-semibold text-white">Sentinel-2 Surface Reflectance</h5>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Calculated dynamically from Sentinel-2 Level-2A. Bad pixels masked out using Scene Classification Layer (SCL) cloud/shadow values (classes 3, 8, 9, 10).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2 flex flex-col justify-center min-h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white">EVI Temporal Dynamics</h4>
              <p className="text-xs text-text-secondary">Comparing selected season EVI against the 5-year historical baseline</p>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
              <Loader2 className="animate-spin text-brand-primary mb-2" size={32} />
              <p className="text-xs">Computing EVI values from STAC bands...</p>
            </div>
          ) : (
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2E43" vertical={false} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} domain={[0.1, 0.8]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151D2A', borderColor: '#1F2E43', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line 
                    type="monotone" 
                    name="Selected Season EVI" 
                    dataKey="evi" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    name="5-Year Historical Baseline" 
                    dataKey="historicalAverage" 
                    stroke="#4B5563" 
                    strokeDasharray="4 4" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
