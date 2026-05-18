import { useMemo } from 'react'
import type { Region, NodeLink } from '../types'

interface Props {
  regions: Region[]
  links: NodeLink[]
  selectedRegionId: string | null
  onRegionClick: (regionId: string) => void
}

const W = 900
const H = 450
const PAD = 40

function project(lat: number, lng: number): [number, number] {
  const x = PAD + ((lng + 180) / 360) * (W - PAD * 2)
  const y = PAD + ((90 - lat) / 180) * (H - PAD * 2)
  return [x, y]
}

const stateColor: Record<string, string> = {
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
}

const linkStatusColor: Record<string, string> = {
  active: 'rgba(56,189,248,0.15)',
  degraded: 'rgba(245,158,11,0.25)',
  down: 'rgba(239,68,68,0.3)',
}

export default function GlobeMap({ regions, links, selectedRegionId, onRegionClick }: Props) {
  const regionsById = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions])

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56,189,248,0.03) 0%, transparent 70%)',
        }}
      />

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full max-w-[900px]" style={{ filter: 'drop-shadow(0 0 40px rgba(56,189,248,0.05))' }}>
        {/* Grid lines */}
        {Array.from({ length: 7 }, (_, i) => {
          const lng = -180 + i * 60
          const [x] = project(0, lng)
          return <line key={`lng-${i}`} x1={x} y1={PAD} x2={x} y2={H - PAD} stroke="rgba(56,189,248,0.06)" strokeWidth={0.5} />
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const lat = -60 + i * 30
          const [, y] = project(lat, 0)
          return <line key={`lat-${i}`} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(56,189,248,0.06)" strokeWidth={0.5} />
        })}

        {/* Equator */}
        {(() => {
          const [, eqY] = project(0, 0)
          return <line x1={PAD} y1={eqY} x2={W - PAD} y2={eqY} stroke="rgba(56,189,248,0.1)" strokeWidth={0.5} strokeDasharray="4 4" />
        })()}

        {/* Links */}
        {links.map((link) => {
          const src = regionsById.get(link.source)
          const tgt = regionsById.get(link.target)
          if (!src || !tgt) return null
          const [x1, y1] = project(src.lat, src.lng)
          const [x2, y2] = project(tgt.lat, tgt.lng)
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={linkStatusColor[link.status]}
              strokeWidth={link.status === 'down' ? 2 : 1}
              strokeDasharray={link.status === 'down' ? '4 4' : undefined}
            />
          )
        })}

        {/* Region nodes */}
        {regions.map((r) => {
          const [cx, cy] = project(r.lat, r.lng)
          const isSelected = r.id === selectedRegionId
          const color = stateColor[r.state]
          return (
            <g key={r.id} onClick={() => onRegionClick(r.id)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring */}
              {r.state === 'red' && (
                <circle cx={cx} cy={cy} r={14} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3}>
                  <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Selection ring */}
              {isSelected && (
                <circle cx={cx} cy={cy} r={12} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="3 2" />
              )}

              {/* Node */}
              <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.9} />
              <circle cx={cx} cy={cy} r={3} fill="white" opacity={0.6} />

              {/* Label */}
              <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={8} fontFamily="monospace">
                {r.code}
              </text>
            </g>
          )
        })}

        {/* Projection label */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fill="rgba(56,189,248,0.15)" fontSize={7} fontFamily="monospace" letterSpacing={3}>
          EQUIRECTANGULAR PROJECTION — CO2 NOC
        </text>
      </svg>
    </div>
  )
}
