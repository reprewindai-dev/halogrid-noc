import { Network } from 'lucide-react'
import type { NodeLink } from '../types'

interface Props {
  links: NodeLink[]
}

const statusStyle: Record<string, { color: string; label: string }> = {
  active: { color: '#10b981', label: 'ACTIVE' },
  degraded: { color: '#f59e0b', label: 'DEGRADED' },
  down: { color: '#ef4444', label: 'DOWN' },
}

export default function NetworkTopology({ links }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <Network className="h-3.5 w-3.5 text-sky-400" />
        <span className="font-mono text-[10px] tracking-[0.15em] text-gray-400 uppercase">Network Links</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {links.map((link) => {
          const s = statusStyle[link.status]
          return (
            <div key={`${link.source}-${link.target}`} className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] text-gray-400">
                  <span className="text-gray-300">{link.source}</span>
                  <span className="text-gray-600 mx-1.5">→</span>
                  <span className="text-gray-300">{link.target}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[9px] tabular-nums text-gray-500">{Math.round(link.latencyMs)}ms</span>
                <span className="font-mono text-[9px] tabular-nums text-gray-500">{Math.round(link.throughputMbps)} Mbps</span>
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color: s.color, background: `${s.color}15` }}>
                  {s.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
