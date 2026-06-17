import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell, BellOff } from 'lucide-react'
import type { Alert, SeverityLevel } from '../types'
import { formatTimestamp } from '../lib/utils'

interface Props {
  alerts: Alert[]
  onAcknowledge: (alertId: string) => void
  onCreateIncident: (alertIds: string[]) => void
}

const severityIcon: Record<SeverityLevel, typeof AlertTriangle> = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  ok: CheckCircle,
}

const severityColor: Record<SeverityLevel, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#38bdf8',
  ok: '#10b981',
}

export default function AlertPanel({ alerts, onAcknowledge, onCreateIncident }: Props) {
  const unacked = alerts.filter((a) => !a.acknowledged)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-gray-400 uppercase">Alerts</span>
          {unacked.length > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{unacked.length}</span>
          )}
        </div>
        {unacked.length > 1 && (
          <button
            onClick={() => onCreateIncident(unacked.slice(0, 5).map((a) => a.id))}
            className="font-mono text-[9px] px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors uppercase tracking-wider"
          >
            Create Incident
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-600">
            <BellOff className="h-5 w-5 mb-2" />
            <span className="font-mono text-[10px]">No alerts</span>
          </div>
        ) : (
          alerts.slice(0, 30).map((alert) => {
            const Icon = severityIcon[alert.severity]
            const color = severityColor[alert.severity]
            return (
              <div
                key={alert.id}
                className="flex items-start gap-2.5 px-3 py-2 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                style={{ opacity: alert.acknowledged ? 0.4 : 1 }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-gray-300 leading-tight">{alert.message}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[9px] text-gray-500">{alert.regionName}</span>
                    <span className="font-mono text-[9px] text-gray-600">{formatTimestamp(alert.timestamp)}</span>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-500 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors uppercase shrink-0"
                  >
                    ACK
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
