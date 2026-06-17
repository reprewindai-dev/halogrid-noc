import { Shield, CheckCircle, AlertOctagon, Clock } from 'lucide-react'
import type { Incident, IncidentStatus } from '../types'
import { formatTimestamp, formatDuration } from '../lib/utils'

interface Props {
  incidents: Incident[]
  onResolve: (incidentId: string) => void
}

const statusConfig: Record<IncidentStatus, { icon: typeof Shield; color: string; label: string }> = {
  active: { icon: AlertOctagon, color: '#ef4444', label: 'ACTIVE' },
  acknowledged: { icon: Clock, color: '#f59e0b', label: 'ACK' },
  resolved: { icon: CheckCircle, color: '#10b981', label: 'RESOLVED' },
}

export default function IncidentPanel({ incidents, onResolve }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <Shield className="h-3.5 w-3.5 text-red-400" />
        <span className="font-mono text-[10px] tracking-[0.15em] text-gray-400 uppercase">Incidents</span>
        {incidents.filter((i) => i.status === 'active').length > 0 && (
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
            {incidents.filter((i) => i.status === 'active').length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-600">
            <Shield className="h-5 w-5 mb-2 opacity-30" />
            <span className="font-mono text-[10px]">No incidents</span>
          </div>
        ) : (
          incidents.map((inc) => {
            const cfg = statusConfig[inc.status]
            const Icon = cfg.icon
            return (
              <div key={inc.id} className="px-3 py-2 border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                    <span className="font-mono text-[10px] font-medium text-gray-300">{inc.title}</span>
                  </div>
                  <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: `${cfg.color}15` }}>
                    {cfg.label}
                  </span>
                </div>
                <div className="font-mono text-[9px] text-gray-500 mt-1 truncate">{inc.description}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-gray-600">{formatTimestamp(inc.createdAt)}</span>
                    <span className="font-mono text-[8px] text-gray-700">TTR: {formatDuration(inc.updatedAt - inc.createdAt)}</span>
                  </div>
                  {inc.status === 'active' && (
                    <button
                      onClick={() => onResolve(inc.id)}
                      className="font-mono text-[8px] px-2 py-0.5 rounded border border-gray-700 text-gray-500 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors uppercase"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
