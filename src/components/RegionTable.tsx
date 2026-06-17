import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Region } from '../types'

interface Props {
  regions: Region[]
  selectedRegionId: string | null
  onRegionClick: (regionId: string) => void
}

const stateLabel: Record<string, { text: string; color: string; bg: string }> = {
  green: { text: 'OK', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  yellow: { text: 'WARN', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  red: { text: 'CRIT', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-400" />
  if (trend === 'down') return <TrendingDown className="h-3 w-3 text-emerald-400" />
  return <Minus className="h-3 w-3 text-gray-600" />
}

export default function RegionTable({ regions, selectedRegionId, onRegionClick }: Props) {
  const sorted = [...regions].sort((a, b) => b.carbon - a.carbon)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <span className="font-mono text-[10px] tracking-[0.15em] text-gray-400 uppercase">Region Status</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['Region', 'Status', 'Carbon', 'Renew', 'Load', 'Water', 'Trend'].map((h) => (
                <th key={h} className="font-mono text-[8px] text-gray-600 uppercase tracking-wider px-2 py-1.5 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const s = stateLabel[r.state]
              const isSelected = r.id === selectedRegionId
              return (
                <tr
                  key={r.id}
                  onClick={() => onRegionClick(r.id)}
                  className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  style={{ background: isSelected ? 'rgba(56,189,248,0.05)' : undefined }}
                >
                  <td className="px-2 py-1.5">
                    <div className="font-mono text-[10px] text-gray-300">{r.code}</div>
                    <div className="font-mono text-[8px] text-gray-600">{r.name}</div>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
                      {s.text}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10px] tabular-nums" style={{ color: r.carbon < 200 ? '#10b981' : r.carbon < 400 ? '#f59e0b' : '#ef4444' }}>
                    {r.carbon}
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10px] tabular-nums text-gray-400">{r.renewable}%</td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${r.load}%`,
                            background: r.load > 80 ? '#ef4444' : r.load > 60 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-gray-500 tabular-nums">{r.load}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10px] tabular-nums" style={{ color: r.waterStress > 0.7 ? '#ef4444' : r.waterStress > 0.4 ? '#f59e0b' : '#10b981' }}>
                    {r.waterStress.toFixed(1)}
                  </td>
                  <td className="px-2 py-1.5">
                    <TrendIcon trend={r.trend} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
