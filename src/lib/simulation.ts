import type { Region, Alert, RouterDecision, Incident, NodeLink, NocMetrics, RouterAction, SeverityLevel } from '../types'
import { randomBetween, randomInt, uuid, hashLike, clamp } from './utils'

export const REGIONS: Region[] = [
  { id: 'us-east-1', name: 'US East (Virginia)', code: 'IAD', lat: 38.9, lng: -77.0, carbon: 320, renewable: 42, load: 67, waterStress: 0.3, state: 'yellow', lastDecision: 'PASS', trend: 'flat', provider: 'AWS' },
  { id: 'us-west-2', name: 'US West (Oregon)', code: 'PDX', lat: 45.5, lng: -122.6, carbon: 85, renewable: 91, load: 44, waterStress: 0.2, state: 'green', lastDecision: 'SHIFT_REGION', trend: 'down', provider: 'AWS' },
  { id: 'eu-west-1', name: 'Europe (Ireland)', code: 'DUB', lat: 53.3, lng: -6.3, carbon: 185, renewable: 72, load: 55, waterStress: 0.1, state: 'green', lastDecision: 'PASS', trend: 'down', provider: 'AWS' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)', code: 'FRA', lat: 50.1, lng: 8.7, carbon: 290, renewable: 55, load: 71, waterStress: 0.4, state: 'yellow', lastDecision: 'DEFER_JOB', trend: 'up', provider: 'AWS' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', code: 'SIN', lat: 1.35, lng: 103.8, carbon: 480, renewable: 12, load: 82, waterStress: 0.7, state: 'red', lastDecision: 'HOLD', trend: 'up', provider: 'AWS' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', code: 'NRT', lat: 35.7, lng: 139.7, carbon: 390, renewable: 28, load: 75, waterStress: 0.5, state: 'red', lastDecision: 'THROTTLE', trend: 'up', provider: 'AWS' },
  { id: 'ca-central-1', name: 'Canada (Central)', code: 'YUL', lat: 45.5, lng: -73.6, carbon: 28, renewable: 97, load: 38, waterStress: 0.1, state: 'green', lastDecision: 'SHIFT_REGION', trend: 'down', provider: 'AWS' },
  { id: 'sa-east-1', name: 'South America (São Paulo)', code: 'GRU', lat: -23.5, lng: -46.6, carbon: 62, renewable: 88, load: 49, waterStress: 0.6, state: 'green', lastDecision: 'PASS', trend: 'flat', provider: 'AWS' },
  { id: 'af-south-1', name: 'Africa (Cape Town)', code: 'CPT', lat: -33.9, lng: 18.4, carbon: 610, renewable: 8, load: 88, waterStress: 0.8, state: 'red', lastDecision: 'HOLD', trend: 'up', provider: 'AWS' },
  { id: 'me-south-1', name: 'Middle East (Bahrain)', code: 'BAH', lat: 26.2, lng: 50.6, carbon: 520, renewable: 6, load: 79, waterStress: 0.9, state: 'red', lastDecision: 'THROTTLE', trend: 'up', provider: 'AWS' },
]

export const NODE_LINKS: NodeLink[] = [
  { source: 'us-east-1', target: 'us-west-2', latencyMs: 62, throughputMbps: 940, status: 'active' },
  { source: 'us-east-1', target: 'eu-west-1', latencyMs: 85, throughputMbps: 720, status: 'active' },
  { source: 'us-east-1', target: 'ca-central-1', latencyMs: 18, throughputMbps: 990, status: 'active' },
  { source: 'eu-west-1', target: 'eu-central-1', latencyMs: 12, throughputMbps: 980, status: 'active' },
  { source: 'eu-central-1', target: 'me-south-1', latencyMs: 110, throughputMbps: 540, status: 'degraded' },
  { source: 'ap-southeast-1', target: 'ap-northeast-1', latencyMs: 72, throughputMbps: 680, status: 'active' },
  { source: 'us-west-2', target: 'ap-northeast-1', latencyMs: 105, throughputMbps: 460, status: 'active' },
  { source: 'sa-east-1', target: 'us-east-1', latencyMs: 130, throughputMbps: 380, status: 'active' },
  { source: 'af-south-1', target: 'eu-west-1', latencyMs: 155, throughputMbps: 290, status: 'degraded' },
  { source: 'ca-central-1', target: 'eu-west-1', latencyMs: 75, throughputMbps: 810, status: 'active' },
]

const ACTIONS: RouterAction[] = ['SHIFT_REGION', 'DEFER_JOB', 'THROTTLE', 'HOLD', 'PASS', 'PASS', 'PASS']

const REASONS: string[] = [
  'Carbon intensity above threshold — routing to lower-carbon region',
  'Renewable availability high — opportunistic shift triggered',
  'Marginal emissions elevated — deferring non-urgent batch',
  'Water stress critical — throttling GPU cluster',
  'Carbon signal stale — holding until next refresh',
  'Load spike + high carbon — emergency throttle applied',
  'Greener window opened — scheduling deferred jobs',
  'Cross-region latency acceptable — shifting to ca-central-1',
  'Peak demand forecast — pre-emptive defer to off-peak',
  'Trace reference generated for operator drill output',
]

const ALERT_TEMPLATES: { message: string; severity: SeverityLevel }[] = [
  { message: 'Carbon intensity exceeded 500 gCO2/kWh threshold', severity: 'critical' },
  { message: 'Water stress index above 0.8 — cooling capacity limited', severity: 'critical' },
  { message: 'Node load exceeding 85% capacity', severity: 'warning' },
  { message: 'Renewable generation dropped below 15%', severity: 'warning' },
  { message: 'Inter-region latency spike detected', severity: 'warning' },
  { message: 'Scheduled maintenance window approaching', severity: 'info' },
  { message: 'Carbon signal provider failover activated', severity: 'info' },
  { message: 'Region carbon intensity returned to normal', severity: 'ok' },
]

export function tickRegions(regions: Region[]): Region[] {
  return regions.map((r) => {
    const dCarbon = randomBetween(-18, 18)
    const carbon = clamp(r.carbon + dCarbon, 18, 640)
    const load = clamp(r.load + randomBetween(-4, 4), 12, 98)
    const state = carbon < 200 ? 'green' : carbon < 400 ? 'yellow' : 'red'
    const action: RouterAction =
      state === 'green'
        ? Math.random() > 0.7 ? 'SHIFT_REGION' : 'PASS'
        : state === 'yellow'
          ? Math.random() > 0.5 ? 'DEFER_JOB' : 'THROTTLE'
          : Math.random() > 0.5 ? 'HOLD' : 'THROTTLE'
    return {
      ...r,
      carbon: Math.round(carbon),
      load: Math.round(load),
      state,
      lastDecision: action,
      trend: dCarbon > 2 ? 'up' : dCarbon < -2 ? 'down' : 'flat',
    }
  })
}

export function tickLinks(links: NodeLink[]): NodeLink[] {
  return links.map((l) => ({
    ...l,
    latencyMs: clamp(l.latencyMs + randomBetween(-8, 8), 5, 300),
    throughputMbps: clamp(l.throughputMbps + randomBetween(-20, 20), 50, 1000),
    status: Math.random() > 0.95 ? 'degraded' : Math.random() > 0.98 ? 'down' : 'active',
  }))
}

export function makeDecision(region: Region): RouterDecision {
  return {
    id: uuid(),
    regionId: region.id,
    regionName: region.name,
    action: region.lastDecision,
    reason: REASONS[randomInt(0, REASONS.length - 1)],
    carbon: region.carbon,
    savings: Math.round(randomBetween(0.4, 18.2) * 10) / 10,
    timestamp: Date.now(),
    confidence: Math.round(randomBetween(72, 99)),
    proofHash: hashLike(),
  }
}

export function makeAlert(region: Region): Alert | null {
  if (Math.random() > 0.15) return null
  const template = ALERT_TEMPLATES[randomInt(0, ALERT_TEMPLATES.length - 1)]
  if (template.severity === 'critical' && region.state !== 'red') return null
  if (template.severity === 'ok' && region.state !== 'green') return null
  return {
    id: uuid(),
    severity: template.severity,
    regionId: region.id,
    regionName: region.name,
    message: template.message,
    timestamp: Date.now(),
    acknowledged: false,
  }
}

export function computeMetrics(regions: Region[], alerts: Alert[], incidents: Incident[]): NocMetrics {
  const healthy = regions.filter((r) => r.state === 'green').length
  const degraded = regions.filter((r) => r.state === 'yellow').length
  const critical = regions.filter((r) => r.state === 'red').length
  const avgCarbon = Math.round(regions.reduce((s, r) => s + r.carbon, 0) / regions.length)
  return {
    totalNodes: regions.length,
    healthyNodes: healthy,
    degradedNodes: degraded,
    criticalNodes: critical,
    activeAlerts: alerts.filter((a) => !a.acknowledged).length,
    activeIncidents: incidents.filter((i) => i.status === 'active').length,
    totalSavingsKg: Math.round(randomBetween(420, 890)),
    avgCarbonIntensity: avgCarbon,
    uptimePct: 99.94,
    decisionsPerMinute: randomInt(12, 38),
  }
}
