# 🌍 AgroResilience Africa: Continental Crop Monitoring & AI Forecasting System

An enterprise-grade, edge-computed geospatial platform designed to track crop health, estimate yields, and forecast agricultural productivity across Africa. Powered by **Digital Earth Africa's Open Data Cube (STAC API)** and deployed entirely on the **Cloudflare Edge Network** with integrated **Workers AI**.

![Dashboard Mockup](https://via.placeholder.com/800x400.png?text=AgroResilience+Africa+Dashboard+Interface)

## 🚀 Key Capabilities
- **Continental Scaling with Granular Filters:** Seamless navigation from a pan-African overview down to specific national fields (e.g., Zambia's Mkushi Farm Block).
- **Edge Geospatial Compute:** Real-time computation of the **Enhanced Vegetation Index (EVI)** directly inside Cloudflare Workers using Sentinel-2 Surface Reflectance data, completely bypassing heavy GIS server overhead.
- **Robust Cloud Masking:** Automated processing of the Scene Classification Layer (SCL) to remove cloud interference, matching real-world data science practices.
- **Edge AI Insights:** Utilizes Cloudflare Workers AI (`Llama-3`) to run inference on time-series vegetation analytics to produce descriptive yield forecasts and strategic resilience recommendations.

## 🛠️ Architecture & Tech Stack

```text
[User Interface: React + Tailwind + Leaflet]
               │ (JSON API via HTTPS)
               ▼
   [Edge Layer: Cloudflare Workers + Pages]
               │
               ├─► [AI Inference: Cloudflare Workers AI (Llama-3)]
               ├─► [Cache / Metadata: Cloudflare KV Store]
               └─► [Geospatial Core: Digital Earth Africa STAC API]
```

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Recharts, Leaflet.
- **Backend:** Cloudflare Pages Functions, Hono Framework.
- **Geospatial Engine:** Digital Earth Africa STAC API & AWS Sentinel-2 Level-2A Catalogs.
- **Artificial Intelligence:** Cloudflare Workers AI Engine (`@cf/meta/llama-3-8b-instruct`).
- **Database/Caching:** Cloudflare KV Namespace (`CROP_CACHE`).

## 📊 Grounded Regional Use Cases (Zambia & Tanzania)
Inspired by real-world Earth Observation initiatives:
1. **Mkushi Farm Block (Zambia):** Multi-spectral analysis monitoring large-scale commercial maize production stability.
2. **Southern Province (Zambia):** Drought early-warning tracking for smallholder farming communities vulnerable to climate anomalies.
3. **Sokoine University of Agriculture (SUA, Tanzania):** Open EO tools implementation model for academic and field-level yield validation.

## 🛠️ Local Development & Deployment

### Prerequisites
- Node.js v18+
- Cloudflare Wrangler CLI configured (`wrangler login`)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/1projectsPortifolio.git
cd "1projectsPortifolio/AgroResilience Africa - Continental Crop Monitoring & AI Forecasting System"

# Install dependencies
npm install

# Start local server (starts Vite dev server)
npm run dev
```

### Configuration (`wrangler.toml`)
Create or edit `wrangler.toml` inside the root:
```toml
name = "agro-resilience-africa"
pages_build_output_dir = "./dist"
compatibility_date = "2026-07-05"

[vars]
DE_AFRICA_STAC_URL = "https://stac.digitalearth.africa"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "CROP_CACHE"
id = "xxxxxx..."
```

## 📜 Scientific References & Acknowledgments

* **Digital Earth Africa:** For providing open-access, cloud-optimized satellite observations enabling sustainable development across the continent.
* **Crop Health EVI Methodology:** Derived from the open-source DE Africa Sandbox notebook pipelines using the standardized formulation:

$$\text{EVI} = 2.5 \times \frac{\text{NIR} - \text{Red}}{\text{NIR} + 6 \times \text{Red} - 7.5 \times \text{Blue} + 1}$$
