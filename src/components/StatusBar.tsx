import type { NocMetrics } from '../types'

interface Props {
  metrics: NocMetrics
  paused: boolean
}

export default function StatusBar({ metrics, paused }: Props) {
  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-gray-800 bg-[#070e1a]">
      <div className="flex items-center gap-4 font-mono text-[9px] text-gray-600">
        <span>
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: paused ? '#f59e0b' : '#10b981' }} />
          {paused ? 'PAUSED' : 'LIVE'}
        </span>
        <span>SIM v0.1.0</span>
        <span>TICK 2s</span>
      </div>
      <div className="flex items-center gap-4 font-mono text-[9px] text-gray-600">
        <span>NODES {metrics.totalNodes}</span>
        <span>ALERTS {metrics.activeAlerts}</span>
        <span>INCIDENTS {metrics.activeIncidents}</span>
        <span>UPTIME {metrics.uptimePct}%</span>
      </div>
    </footer>
  )
}
