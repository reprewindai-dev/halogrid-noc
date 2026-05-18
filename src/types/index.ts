export type SeverityLevel = 'critical' | 'warning' | 'info' | 'ok'
export type RouterAction = 'SHIFT_REGION' | 'DEFER_JOB' | 'THROTTLE' | 'HOLD' | 'PASS'
export type RegionState = 'green' | 'yellow' | 'red'
export type IncidentStatus = 'active' | 'acknowledged' | 'resolved'

export interface Region {
  id: string
  name: string
  code: string
  lat: number
  lng: number
  carbon: number
  renewable: number
  load: number
  waterStress: number
  state: RegionState
  lastDecision: RouterAction
  trend: 'up' | 'down' | 'flat'
  provider: string
}

export interface Alert {
  id: string
  severity: SeverityLevel
  regionId: string
  regionName: string
  message: string
  timestamp: number
  acknowledged: boolean
}

export interface Incident {
  id: string
  title: string
  severity: SeverityLevel
  status: IncidentStatus
  regionIds: string[]
  alerts: string[]
  createdAt: number
  updatedAt: number
  description: string
}

export interface RouterDecision {
  id: string
  regionId: string
  regionName: string
  action: RouterAction
  reason: string
  carbon: number
  savings: number
  timestamp: number
  confidence: number
  proofHash: string
}

export interface NocMetrics {
  totalNodes: number
  healthyNodes: number
  degradedNodes: number
  criticalNodes: number
  activeAlerts: number
  activeIncidents: number
  totalSavingsKg: number
  avgCarbonIntensity: number
  uptimePct: number
  decisionsPerMinute: number
}

export interface NodeLink {
  source: string
  target: string
  latencyMs: number
  throughputMbps: number
  status: 'active' | 'degraded' | 'down'
}
