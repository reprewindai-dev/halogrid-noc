# CO2-NOC — Network Operations Center

Real-time network operations center for CO2 Router infrastructure monitoring.

## Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Lucide React
- Recharts 2
- Framer Motion 11

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Features

- **Globe Map** — Equirectangular projection showing all CO2 Router nodes with real-time state (green/yellow/red), inter-region links, and selection
- **Region Table** — Sortable status table with carbon intensity, renewable %, load, water stress, and trend indicators
- **Alert Panel** — Live alert feed with severity levels (critical/warning/info/ok), acknowledge and batch incident creation
- **Decision Stream** — Real-time router decision feed showing SHIFT_REGION, DEFER_JOB, THROTTLE, HOLD, PASS actions with proof hashes
- **Incident Management** — Create, track, and resolve incidents from grouped alerts
- **Network Topology** — Inter-region link monitoring with latency, throughput, and status
- **Metrics Bar** — Top-level KPIs: healthy/degraded/critical nodes, carbon avg, savings, uptime, decisions/min

## Project Structure

```text
src/
├── components/   UI panels and views
├── hooks/        NOC state management
├── lib/          Simulation engine, utilities
├── types/        TypeScript interfaces
└── styles/       Global CSS + Tailwind
```
