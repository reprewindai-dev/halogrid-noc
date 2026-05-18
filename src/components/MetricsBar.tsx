import { Leaf, Server, AlertTriangle, TrendingDown, Clock, Gauge } from 'lucide-react'
import type { NocMetrics } from '../types'

interface Props {
  metrics: NocMetrics
}

export default function MetricsBar({ metrics }: Props) {
  const cards = [
    { label: 'NODES', value: `${metrics.healthyNodes}/${metrics.totalNodes}`, icon: Server, color: '#10b981' },
    { label: 'CARBON AVG', value: `${metrics.avgCarbonIntensity}`, unit: 'gCO₂/kWh', icon: Leaf, color: metrics.avgCarbonIntensity < 200 ? '#10b981' : metrics.avgCarbonIntensity < 400 ? '#f59e0b' : '#ef4444' },
    { label: 'SAVINGS', value: `${metrics.totalSavingsKg}`, unit: 'kg CO₂', icon: TrendingDown, color: '#38bdf8' },
    { label: 'ALERTS', value: `${metrics.activeAlerts}`, icon: AlertTriangle, color: metrics.activeAlerts > 5 ? '#ef4444' : '#f59e0b' },
    { label: 'UPTIME', value: `${metrics.uptimePct}%`, icon: Clock, color: '#10b981' },
    { label: 'DEC/MIN', value: `${metrics.decisionsPerMinute}`, icon: Gauge, color: '#a78bfa' },
  ]

  return (
    <div className="grid grid-cols-6 gap-2 px-4 py-2 border-b border-gray-800 bg-[#0a1220]">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-gray-900/50 border border-gray-800/50">
          <c.icon className="h-3.5 w-3.5 shrink-0" style={{ color: c.color }} />
          <div className="min-w-0">
            <div className="font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">{c.label}</div>
            <div className="font-mono text-sm font-semibold tabular-nums" style={{ color: c.color }}>
              {c.value}
              {c.unit && <span className="text-[9px] text-gray-500 ml-1">{c.unit}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
