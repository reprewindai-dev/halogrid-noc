import { GitBranch, ArrowRightLeft, Clock, Pause, Square, Check, Hash } from 'lucide-react'
import type { RouterDecision, RouterAction } from '../types'
import { formatTimestamp } from '../lib/utils'

interface Props {
  decisions: RouterDecision[]
}

const actionIcon: Record<RouterAction, typeof GitBranch> = {
  SHIFT_REGION: ArrowRightLeft,
  DEFER_JOB: Clock,
  THROTTLE: Pause,
  HOLD: Square,
  PASS: Check,
}

const actionColor: Record<RouterAction, string> = {
  SHIFT_REGION: '#38bdf8',
  DEFER_JOB: '#a78bfa',
  THROTTLE: '#f59e0b',
  HOLD: '#ef4444',
  PASS: '#10b981',
}

export default function DecisionFeed({ decisions }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <GitBranch className="h-3.5 w-3.5 text-sky-400" />
        <span className="font-mono text-[10px] tracking-[0.15em] text-gray-400 uppercase">Decision Stream</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {decisions.slice(0, 25).map((d) => {
          const Icon = actionIcon[d.action]
          const color = actionColor[d.action]
          return (
            <div key={d.id} className="flex items-start gap-2.5 px-3 py-2 border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
              <Icon className="h-3 w-3 shrink-0 mt-0.5" style={{ color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-medium" style={{ color }}>{d.action}</span>
                  <span className="font-mono text-[9px] text-gray-500">{d.regionName}</span>
                </div>
                <div className="font-mono text-[9px] text-gray-500 mt-0.5 leading-tight truncate">{d.reason}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[9px] text-gray-600">{d.carbon} gCO₂</span>
                  <span className="font-mono text-[9px] text-emerald-500">-{d.savings} kg</span>
                  <span className="font-mono text-[9px] text-gray-600">{d.confidence}%</span>
                  <span className="flex items-center gap-0.5 font-mono text-[8px] text-gray-700">
                    <Hash className="h-2.5 w-2.5" />
                    {d.proofHash}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[8px] text-gray-600 shrink-0">{formatTimestamp(d.timestamp)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
