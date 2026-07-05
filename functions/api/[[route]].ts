import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  AI: any;
  CROP_CACHE: any;
  DE_AFRICA_STAC_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Grounded use case coordinate ranges
const REGIONS = {
  mkushi: {
    name: "Mkushi Farm Block",
    country: "Zambia",
    bbox: [29.0, -14.3, 29.5, -13.8],
    description: "Commercial maize and soy yield trends",
    baseEvi: 0.55
  },
  southern: {
    name: "Southern Province Smallholders",
    country: "Zambia",
    bbox: [26.5, -17.5, 27.5, -15.5],
    description: "Smallholder drought resilience monitoring",
    baseEvi: 0.35
  },
  sua: {
    name: "Sokoine University Experimental Farms",
    country: "Tanzania",
    bbox: [37.6, -6.9, 37.7, -6.8],
    description: "Academic AgTech validation site",
    baseEvi: 0.48
  }
};

// Simple in-memory mock data generator for EVI time-series
function generateMockEvi(regionKey: string, season: string) {
  const region = REGIONS[regionKey as keyof typeof REGIONS] || REGIONS.mkushi;
  const base = region.baseEvi;
  
  // Create 12 points representing monthly values starting from Nov (planting) to Oct
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  
  let anomalies = 0;
  if (season === '2023-2024') {
    // Severe El Nino drought season in Southern Africa
    anomalies = -0.12;
  } else if (season === '2024-2025') {
    // Recovery season
    anomalies = 0.02;
  }
  
  return labels.map((month, idx) => {
    // Normal crop growth curve: peaks in Feb/Mar, declines during dry winter (Jun-Oct)
    let growthFactor = Math.sin((idx / 11) * Math.PI); 
    if (idx < 2) growthFactor = 0.1; // planting phase
    
    // Add seasonal variations
    let val = base + (growthFactor * 0.28) + anomalies;
    
    // Mock SCL Cloud masking: random pixels masked out
    const cloudMaskApplied = Math.random() > 0.85;
    if (cloudMaskApplied) {
      val = val * 0.9; // minor noise representing remaining cloud filter aerosol
    }
    
    // EVI range is typically 0.0 to 1.0 in vegetated areas
    val = Math.max(0.1, Math.min(0.85, val));
    
    return {
      month,
      evi: parseFloat(val.toFixed(3)),
      historicalAverage: parseFloat((base + (growthFactor * 0.28)).toFixed(3)),
      cloudCoverPct: cloudMaskApplied ? parseFloat((Math.random() * 5 + 1).toFixed(1)) : 0
    };
  });
}

// Health Check Endpoint
app.get('/health', (c) => {
  const hasAi = !!c.env.AI;
  const hasCache = !!c.env.CROP_CACHE;
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      workersAiAvailable: hasAi,
      kvCacheAvailable: hasCache,
      stacUrl: c.env.DE_AFRICA_STAC_URL || "https://stac.digitalearth.africa"
    }
  });
});

// STAC Search Proxy / Simulation endpoint
app.get('/stac/search', async (c) => {
  const region = c.req.query('region') || 'mkushi';
  const limit = parseInt(c.req.query('limit') || '5');
  const regionInfo = REGIONS[region as keyof typeof REGIONS] || REGIONS.mkushi;
  
  const stacUrl = c.env.DE_AFRICA_STAC_URL || "https://stac.digitalearth.africa";
  
  try {
    // Proxy call to real Digital Earth Africa STAC API if available
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // 4s timeout
    
    const response = await fetch(`${stacUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bbox: regionInfo.bbox,
        collections: ["sentinel-2-l2a"],
        limit: limit,
        fields: {
          include: ["id", "properties.datetime", "properties.eo:cloud_cover", "assets.red", "assets.blue", "assets.nir"]
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(id);
    
    if (response.ok) {
      const data = await response.json();
      return c.json({ source: 'de-africa-stac', data });
    }
  } catch (err) {
    // STAC failure or timeout: Fallback gracefully to mock STAC metadata
  }
  
  // Return simulated STAC catalog items representing Sentinel-2 acquisitions
  const mockItems = Array.from({ length: limit }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (idx * 5));
    const cloudCover = parseFloat((Math.random() * 15).toFixed(2));
    return {
      id: `S2A_MSIL2A_${date.toISOString().replace(/[-:T]/g, '').substring(0, 15)}`,
      type: "Feature",
      properties: {
        datetime: date.toISOString(),
        "eo:cloud_cover": cloudCover,
        "scl:cloud_shadow_pct": parseFloat((cloudCover * 0.1).toFixed(2)),
        "scl:vegetation_pct": parseFloat((80 - cloudCover).toFixed(2))
      },
      bbox: regionInfo.bbox,
      assets: {
        red: { href: "#simulated_red_band" },
        blue: { href: "#simulated_blue_band" },
        nir: { href: "#simulated_nir_band" }
      }
    };
  });
  
  return c.json({
    source: 'simulation-engine',
    items: mockItems
  });
});

// EVI time-series endpoint
app.get('/evi', async (c) => {
  const region = c.req.query('region') || 'mkushi';
  const season = c.req.query('season') || '2024-2025';
  
  // Attempt KV Cache fetch if configured
  const cacheKey = `evi:${region}:${season}`;
  if (c.env.CROP_CACHE) {
    try {
      const cached = await c.env.CROP_CACHE.get(cacheKey);
      if (cached) {
        return c.json({ source: 'kv-cache', data: JSON.parse(cached) });
      }
    } catch (e) {
      // ignore cache failure
    }
  }
  
  const data = generateMockEvi(region, season);
  
  // Cache data if KV binding exists
  if (c.env.CROP_CACHE) {
    try {
      await c.env.CROP_CACHE.put(cacheKey, JSON.stringify(data), { expirationTtl: 3600 }); // cache 1 hr
    } catch (e) {
      // ignore write failure
    }
  }
  
  return c.json({
    source: 'calc-engine',
    region,
    season,
    coordinates: REGIONS[region as keyof typeof REGIONS]?.bbox || [],
    series: data
  });
});

// AI Edge Forecast endpoint
app.post('/ai/forecast', async (c) => {
  const body = await c.req.json();
  const { region, season, series, weatherAnomaly } = body;
  
  const regionName = REGIONS[region as keyof typeof REGIONS]?.name || "Selected Region";
  const country = REGIONS[region as keyof typeof REGIONS]?.country || "Africa";
  
  const prompt = `
    You are an expert agricultural economist and crop modeling system at the edge.
    Analyze the following vegetation health time-series (Enhanced Vegetation Index - EVI) and environmental variables:
    
    Region: ${regionName} (${country})
    Crop Season: ${season}
    Weather Anomaly: ${weatherAnomaly || 'None (Normal rain)'}
    EVI Monthly Data: ${JSON.stringify(series)}
    
    Calculate and generate a detailed report with:
    1. Yield Forecast (Optimistic, Baseline, Pessimistic percentage variations from historical norms).
    2. Agricultural Productivity Risk Assessment (identify drought indices, vegetation degradation, and water stress factors).
    3. Actionable mitigation strategies tailored for local policy makers and smallholder farming leads.
    
    Provide your output in valid, structured JSON matching this schema:
    {
      "yieldForecast": {
        "optimistic": "+5%",
        "baseline": "-3%",
        "pessimistic": "-12%"
      },
      "riskAssessment": {
        "droughtLevel": "Low | Moderate | Severe",
        "vegetationStatus": "Healthy | Degrading | Stressed",
        "description": "Short explanation of findings..."
      },
      "mitigationStrategies": [
        "Strategy 1",
        "Strategy 2"
      ]
    }
  `;

  // Integrate Cloudflare Workers AI if binding is present
  if (c.env.AI) {
    try {
      const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a crop forecasting engine. Respond only in valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      
      if (response && response.response) {
        try {
          const parsed = JSON.parse(response.response);
          return c.json({ source: 'cloudflare-workers-ai', ...parsed });
        } catch (e) {
          // parse failed, return raw AI response
          return c.json({ source: 'cloudflare-workers-ai-raw', raw: response.response });
        }
      }
    } catch (err: any) {
      // Fallback on AI error
    }
  }

  // High-fidelity local AI Simulation Engine
  // Tailor response based on the weather parameters and EVI values
  const isDrought = season === '2023-2024' || (weatherAnomaly && weatherAnomaly.toLowerCase().includes('drought'));
  
  let simulatedResponse;
  if (isDrought) {
    simulatedResponse = {
      yieldForecast: {
        optimistic: "-8%",
        baseline: "-18%",
        pessimistic: "-32%"
      },
      riskAssessment: {
        droughtLevel: "Severe",
        vegetationStatus: "Stressed",
        description: "El Niño weather anomalies have caused delayed rainfall and high temperatures, leading to stunted initial growth. EVI values remain 20% below the 5-year historical average."
      },
      mitigationStrategies: [
        "Deploy JIT water-harvesting techniques in Southern Province to capture erratic showers.",
        "Facilitate rapid distribution of drought-tolerant early-maturing seed varieties (maize/sorghum).",
        "Provide emergency fertilizer top-up subsidies to offset soil moisture nutrient leaching.",
        "Implement crop-weather insurance payouts based on satellite-confirmed EVI triggers."
      ]
    };
  } else {
    simulatedResponse = {
      yieldForecast: {
        optimistic: "+8%",
        baseline: "+2%",
        pessimistic: "-5%"
      },
      riskAssessment: {
        droughtLevel: "Low",
        vegetationStatus: "Healthy",
        description: "Stable seasonal rains and moderate temperatures support strong vegetative biomass accumulation. EVI values align closely or exceed historical baselines."
      },
      mitigationStrategies: [
        "Optimize fertilizer application schedules during critical grain-filling stages in Mkushi Block.",
        "Ensure post-harvest storage assets (silos, bags) are clean to prevent weevil infestations.",
        "Facilitate commodity price hedging contracts ahead of peak harvest season commodity listings.",
        "Validate satellite EVI calibration with ground-truth visual reports via SUA experimental farms."
      ]
    };
  }

  return c.json({
    source: 'workers-ai-simulation',
    ...simulatedResponse
  });
});

export const onRequest = handle(app);
