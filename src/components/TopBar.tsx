import { useState, useEffect } from 'react'
import { Radio, Pause, Play, AlertTriangle, Activity, Zap } from 'lucide-react'
import type { NocMetrics } from '../types'

interface Props {
  metrics: NocMetrics
  paused: boolean
  onToggle: () => void
}

export default function TopBar({ metrics, paused, onToggle }: Props) {
  const [time, setTime] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setTime(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const utc = new Date(time).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#070e1a]">
      <div className="flex items-center gap-3">
        <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="font-mono text-sm font-semibold tracking-wider text-gray-100">CO2-NOC</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase">Network Operations Center</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="h-3 w-3" />
            {metrics.healthyNodes} OK
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            {metrics.degradedNodes} WARN
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <Zap className="h-3 w-3" />
            {metrics.criticalNodes} CRIT
          </span>
        </div>

        <div className="font-mono text-[10px] text-gray-500 tabular-nums">{utc}</div>

        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-gray-700 hover:border-gray-500 transition-colors"
          style={{ color: paused ? '#f59e0b' : '#10b981' }}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? 'Resume' : 'Live'}
        </button>
      </div>
    </header>
  )
}
