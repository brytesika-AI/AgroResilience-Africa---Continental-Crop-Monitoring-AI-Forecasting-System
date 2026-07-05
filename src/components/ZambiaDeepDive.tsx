import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Info, ArrowUpRight, Compass, ShieldAlert } from 'lucide-react';

interface FarmData {
  id: string;
  name: string;
  type: string;
  coords: [number, number];
  bbox: [[number, number], [number, number]];
  evi: number;
  status: 'Healthy' | 'Moderate' | 'Stressed';
  crop: string;
  details: string;
}

const FARMS: FarmData[] = [
  {
    id: 'mkushi',
    name: 'Mkushi Farm Block (Commercial)',
    type: 'Commercial',
    coords: [-14.05, 29.25],
    bbox: [[-14.3, 29.0], [-13.8, 29.5]],
    evi: 0.62,
    status: 'Healthy',
    crop: 'Maize & Soybeans',
    details: 'Commercial grain hub with center-pivot irrigation. Crop canopy index shows healthy vegetative growth.'
  },
  {
    id: 'southern',
    name: 'Southern Province Smallholders',
    type: 'Smallholder',
    coords: [-16.5, 27.0],
    bbox: [[-17.5, 26.5], [-15.5, 27.5]],
    evi: 0.32,
    status: 'Stressed',
    crop: 'Rain-fed Maize',
    details: 'Vulnerable smallholder farming clusters. Severely impacted by erratic rainfall distribution and El Niño weather anomalies.'
  }
];

const chartDataMock = {
  mkushi: [
    { month: 'Nov', current: 0.32, hist: 0.30 },
    { month: 'Dec', current: 0.42, hist: 0.40 },
    { month: 'Jan', current: 0.54, hist: 0.52 },
    { month: 'Feb', current: 0.62, hist: 0.60 },
    { month: 'Mar', current: 0.65, hist: 0.62 },
    { month: 'Apr', current: 0.55, hist: 0.53 },
    { month: 'May', current: 0.45, hist: 0.44 },
    { month: 'Jun', current: 0.38, hist: 0.38 },
  ],
  southern: [
    { month: 'Nov', current: 0.28, hist: 0.30 },
    { month: 'Dec', current: 0.31, hist: 0.38 },
    { month: 'Jan', current: 0.34, hist: 0.48 },
    { month: 'Feb', current: 0.32, hist: 0.55 },
    { month: 'Mar', current: 0.30, hist: 0.52 },
    { month: 'Apr', current: 0.28, hist: 0.45 },
    { month: 'May', current: 0.25, hist: 0.38 },
    { month: 'Jun', current: 0.22, hist: 0.32 },
  ]
};

export default function ZambiaDeepDive() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmData>(FARMS[0]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centering on Zambia
    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false // Custom placement later
    }).setView([-15.0, 28.5], 6.5);

    // Dark Cardo-tile layer matching premium UI aesthetics
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; Digital Earth Africa'
    }).addTo(mapRef.current);

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    const layerGroup = L.layerGroup().addTo(mapRef.current);

    // Plot farm bounding boxes
    FARMS.forEach((farm) => {
      const isHealthy = farm.status === 'Healthy';
      const color = isHealthy ? '#10B981' : '#EF4444'; // emerald vs red

      // Add Rectangle bounding box representation
      const rect = L.rectangle(farm.bbox, {
        color: color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.15,
        dashArray: '4, 4'
      }).addTo(layerGroup);

      // Add center circle marker
      const circle = L.circleMarker(farm.coords, {
        radius: 8,
        color: '#FFFFFF',
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.9
      }).addTo(layerGroup);

      // Click handles zoom & select
      const handleClick = () => {
        setSelectedFarm(farm);
        mapRef.current?.setView(farm.coords, 7.5);
      };

      rect.on('click', handleClick);
      circle.on('click', handleClick);

      // Bind simple popup
      circle.bindTooltip(`<strong>${farm.name}</strong><br/>EVI: ${farm.evi}`, {
        direction: 'top',
        className: 'bg-card text-white text-xs rounded border border-border p-1.5'
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle zoom centering from card clicks
  const panToFarm = (farm: FarmData) => {
    setSelectedFarm(farm);
    if (mapRef.current) {
      mapRef.current.setView(farm.coords, 7.5);
    }
  };

  const chartData = chartDataMock[selectedFarm.id as keyof typeof chartDataMock] || chartDataMock.mkushi;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Zambia Deep-Dive Hub</h2>
        <p className="text-sm text-text-secondary mt-1">
          High-resolution regional monitoring in commercial farm blocks and critical smallholder zones.
        </p>
      </div>

      {/* Grid Layout: Map + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Block */}
        <div className="lg:col-span-2 relative h-[450px] rounded-xl overflow-hidden border border-border glass-card">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Helper */}
          <div className="absolute top-4 left-4 z-20 bg-card/85 backdrop-blur-md border border-border px-3 py-2 rounded-lg pointer-events-none">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass size={14} className="text-brand-primary animate-spin" />
              Zambia Monitoring Grid
            </h4>
            <p className="text-[10px] text-text-secondary mt-0.5">Sentinel-2 Layer active</p>
          </div>
        </div>

        {/* Selected Zone Analysis Card */}
        <div className="flex flex-col gap-4">
          {/* Selector list */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Select Observation Area</h4>
            <div className="space-y-2">
              {FARMS.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => panToFarm(farm)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left border transition-all duration-200
                    ${selectedFarm.id === farm.id 
                      ? 'bg-brand-primary/5 border-brand-primary text-white' 
                      : 'border-border bg-background/40 hover:bg-border/20 text-text-secondary'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className={selectedFarm.id === farm.id ? 'text-brand-primary' : 'text-text-muted'} />
                    <div>
                      <span className="text-xs font-semibold block">{farm.name}</span>
                      <span className="text-[10px] text-text-muted">{farm.crop}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    farm.status === 'Healthy' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {farm.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Yield Profile Card */}
          <div className="glass-card rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{selectedFarm.name}</h4>
                <span className="text-xs text-text-muted font-bold uppercase">{selectedFarm.type}</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                {selectedFarm.details}
              </p>

              {/* Status Alert if stressed */}
              {selectedFarm.status === 'Stressed' && (
                <div className="mt-3 p-2 bg-red-500/5 border border-red-500/10 rounded flex gap-2">
                  <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-red-400">
                    EVI baseline dropped below threshold. Action recommended in AI Insights tab.
                  </p>
                </div>
              )}
            </div>

            {/* Micro EVI Trend */}
            <div className="mt-4 pt-4 border-t border-border/40">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">EVI Growth Cycle Progress</h5>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEvi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2E43" vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={9} domain={[0.1, 0.8]} tickLine={false} />
                    <Area type="monotone" name="EVI" dataKey="current" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEvi)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
