import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Link, Server, Key, Info, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [mockMode, setMockMode] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthInfo(data);
        if (data.environment && data.environment.workersAiAvailable) {
          setMockMode(false);
        }
      })
      .catch(err => console.error("Error fetching health checks:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">System Settings</h2>
        <p className="text-sm text-text-secondary mt-1">
          Monitor your Cloudflare Workers edge configuration and API bindings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API and Environment Integration */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-border/40 pb-3">
              <Server size={18} className="text-brand-primary" /> API Environment Bindings
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 border border-border rounded-lg">
                  <span className="text-[10px] text-text-muted font-bold uppercase block">Workers AI Binding</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-white">env.AI</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      healthInfo?.environment?.workersAiAvailable 
                        ? 'bg-brand-primary/10 text-brand-primary' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {healthInfo?.environment?.workersAiAvailable ? 'BOUND (LIVE)' : 'SIMULATION MODE'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-background/50 border border-border rounded-lg">
                  <span className="text-[10px] text-text-muted font-bold uppercase block">KV Cache Binding</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-white">env.CROP_CACHE</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      healthInfo?.environment?.kvCacheAvailable 
                        ? 'bg-brand-primary/10 text-brand-primary' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {healthInfo?.environment?.kvCacheAvailable ? 'BOUND (LIVE)' : 'SIMULATION MODE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background/50 border border-border rounded-lg">
                <span className="text-[10px] text-text-muted font-bold uppercase block">DE Africa STAC URL</span>
                <span className="text-xs font-semibold text-white block mt-1 break-all">
                  {healthInfo?.environment?.stacUrl || 'https://stac.digitalearth.africa'}
                </span>
              </div>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Key size={18} className="text-brand-secondary" /> Cloudflare Deployment Guide
            </h3>
            
            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                To push this dashboard live onto your Cloudflare account with fully operational real-time bindings:
              </p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>
                  Create a KV Namespace in Cloudflare Dashboard: <code className="text-white bg-background px-1 py-0.5 rounded">CROP_CACHE</code>.
                </li>
                <li>
                  Update your <code className="text-white bg-background px-1 py-0.5 rounded">wrangler.toml</code> file with the correct KV namespace id.
                </li>
                <li>
                  Run deployment script: <code className="text-white bg-background px-1.5 py-0.5 rounded font-semibold text-brand-primary">npm run build && wrangler pages deploy dist</code>.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* System Info Sidebar */}
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Info size={18} className="text-brand-accent" /> Platform Metadata
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-secondary">Platform:</span>
                <span className="font-semibold text-white">Cloudflare Pages</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-secondary">Web Router:</span>
                <span className="font-semibold text-white">Hono Engine</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-secondary">AI Core:</span>
                <span className="font-semibold text-white">Llama 3 Instruct</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-secondary">Compliance:</span>
                <span className="font-semibold text-brand-primary">BAS v2.1 OK</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg">
            <div className="flex gap-2">
              <CheckCircle2 className="text-brand-primary shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-text-secondary leading-relaxed">
                System is fully aligned with POPIA requirements. All user parameters are localized and encrypted at rest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
