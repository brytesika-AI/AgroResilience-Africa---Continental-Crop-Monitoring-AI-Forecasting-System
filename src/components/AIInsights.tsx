import React, { useState } from 'react';
import { BrainCircuit, Sprout, ShieldAlert, Cpu, CheckCircle2, Play, Loader2 } from 'lucide-react';

interface ForecastResult {
  yieldForecast: {
    optimistic: string;
    baseline: string;
    pessimistic: string;
  };
  riskAssessment: {
    droughtLevel: string;
    vegetationStatus: string;
    description: string;
  };
  mitigationStrategies: string[];
}

export default function AIInsights() {
  const [selectedRegion, setSelectedRegion] = useState('mkushi');
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [weatherAnomaly, setWeatherAnomaly] = useState('Normal Rainfall');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);

  const handleRunForecast = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Fetch EVI values first to send in AI context
      const eviResp = await fetch(`/api/evi?region=${selectedRegion}&season=${selectedSeason}`);
      let seriesData = [];
      if (eviResp.ok) {
        const eviJson = await eviResp.json();
        seriesData = eviJson.series || [];
      }

      // Query Workers AI Forecast endpoint
      const response = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion,
          season: selectedSeason,
          series: seriesData,
          weatherAnomaly: weatherAnomaly
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error("AI forecast query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">AI Forecasting & Strategic Resilience</h2>
        <p className="text-sm text-text-secondary mt-1">
          Trigger edge-computed predictive forecasts and mitigation plans using Cloudflare Workers AI.
        </p>
      </div>

      {/* Grid Layout: Config + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Forecast Configuration */}
        <div className="glass-card rounded-xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-border/40 pb-3">
            <Cpu size={18} className="text-brand-primary" /> Forecast Parameters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Target Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-background border border-border text-white text-xs rounded-lg p-2.5 focus:border-brand-primary outline-none"
              >
                <option value="mkushi">Mkushi Farm Block (Zambia)</option>
                <option value="southern">Southern Province (Zambia)</option>
                <option value="sua">Sokoine University (Tanzania)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Crop Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full bg-background border border-border text-white text-xs rounded-lg p-2.5 focus:border-brand-primary outline-none"
              >
                <option value="2024-2025">2024 - 2025 (Current)</option>
                <option value="2023-2024">2023 - 2024 (El Niño Drought)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Environmental Anomaly</label>
              <select
                value={weatherAnomaly}
                onChange={(e) => setWeatherAnomaly(e.target.value)}
                className="w-full bg-background border border-border text-white text-xs rounded-lg p-2.5 focus:border-brand-primary outline-none"
              >
                <option value="Normal Rainfall">Normal Rainfall</option>
                <option value="El Niño Drought anomaly">El Niño Drought anomaly</option>
                <option value="La Niña Surplus precipitation">La Niña Surplus precipitation</option>
                <option value="Delayed onset of rain cycle">Delayed onset of rain cycle</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunForecast}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/95 disabled:bg-brand-primary/50 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-colors duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Generating Edge Forecast...
              </>
            ) : (
              <>
                <Play size={14} /> Run AI Inference
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Reports */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center min-h-[350px]">
              <BrainCircuit className="animate-pulse text-brand-primary mb-4" size={48} />
              <h4 className="text-base font-bold text-white mb-2">Querying Workers AI Edge Model</h4>
              <p className="text-xs text-text-secondary max-w-sm text-center">
                Feeding Sentinel-2 EVI values, region profiles, and meteorological anomalies into Llama 3 for crop yield forecasting...
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center min-h-[350px] text-text-secondary">
              <BrainCircuit className="text-text-muted mb-4" size={48} />
              <h4 className="text-base font-bold text-white mb-2">No Active Forecast</h4>
              <p className="text-xs text-center max-w-sm">
                Select your parameters on the left panel and click "Run AI Inference" to generate strategic yield forecasts and agricultural resilience strategies.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-fade-in">
              {/* Yield Forecast card */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Yield Projections</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-background/50 border border-border/60 rounded-lg text-center">
                    <span className="text-[10px] text-brand-primary font-semibold uppercase">Optimistic</span>
                    <h5 className="text-xl font-bold text-white mt-1">{result.yieldForecast.optimistic}</h5>
                  </div>
                  <div className="p-4 bg-background/50 border border-brand-primary/20 rounded-lg text-center">
                    <span className="text-[10px] text-brand-secondary font-semibold uppercase">Baseline</span>
                    <h5 className="text-xl font-bold text-white mt-1">{result.yieldForecast.baseline}</h5>
                  </div>
                  <div className="p-4 bg-background/50 border border-border/60 rounded-lg text-center">
                    <span className="text-[10px] text-red-400 font-semibold uppercase">Pessimistic</span>
                    <h5 className="text-xl font-bold text-white mt-1">{result.yieldForecast.pessimistic}</h5>
                  </div>
                </div>
              </div>

              {/* Risk Assessment card */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Productivity Risk Assessment</h4>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
                    <span className="text-text-secondary">Drought Level:</span>
                    <span className={`font-semibold uppercase ${
                      result.riskAssessment.droughtLevel === 'Severe' ? 'text-red-500' : 'text-brand-primary'
                    }`}>{result.riskAssessment.droughtLevel}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
                    <span className="text-text-secondary">Vegetation Health:</span>
                    <span className={`font-semibold uppercase ${
                      result.riskAssessment.vegetationStatus === 'Stressed' ? 'text-red-500' : 'text-brand-primary'
                    }`}>{result.riskAssessment.vegetationStatus}</span>
                  </div>
                </div>

                <div className="p-4 bg-background/30 border border-border/40 rounded-lg flex gap-3">
                  <ShieldAlert className="text-brand-primary shrink-0" size={18} />
                  <div>
                    <h5 className="text-xs font-bold text-white">Edge AI Diagnostic Commentary</h5>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {result.riskAssessment.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mitigation Strategies card */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Strategic Mitigation Actions</h4>
                
                <div className="space-y-3">
                  {result.mitigationStrategies.map((strategy, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-background/20 border border-border/40 rounded-lg hover:border-brand-primary/20 transition-all duration-200">
                      <CheckCircle2 className="text-brand-primary shrink-0 mt-0.5" size={16} />
                      <span className="text-xs text-text-primary leading-relaxed">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
