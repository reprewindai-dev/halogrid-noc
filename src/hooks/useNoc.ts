import { useState, useEffect, useCallback, useRef } from 'react'
import type { Region, Alert, Incident, RouterDecision, NodeLink, NocMetrics } from '../types'
import {
  REGIONS,
  NODE_LINKS,
  tickRegions,
  tickLinks,
  makeDecision,
  makeAlert,
  computeMetrics,
} from '../lib/simulation'
import { uuid } from '../lib/utils'

const MAX_ALERTS = 100
const MAX_DECISIONS = 50
const TICK_MS = 2000

export function useNoc() {
  const [regions, setRegions] = useState<Region[]>(REGIONS)
  const [links, setLinks] = useState<NodeLink[]>(NODE_LINKS)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [decisions, setDecisions] = useState<RouterDecision[]>([])
  const [metrics, setMetrics] = useState<NocMetrics>(() => computeMetrics(REGIONS, [], []))
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    setRegions((prev) => {
      const next = tickRegions(prev)

      const newAlerts: Alert[] = []
      const newDecisions: RouterDecision[] = []
      for (const region of next) {
        if (region.state !== 'green' || Math.random() > 0.6) {
          newDecisions.push(makeDecision(region))
        }
        const alert = makeAlert(region)
        if (alert) newAlerts.push(alert)
      }

      if (newAlerts.length > 0) {
        setAlerts((a) => [...newAlerts, ...a].slice(0, MAX_ALERTS))
      }
      if (newDecisions.length > 0) {
        setDecisions((d) => [...newDecisions, ...d].slice(0, MAX_DECISIONS))
      }

      setMetrics(computeMetrics(next, newAlerts, []))
      return next
    })

    setLinks((prev) => tickLinks(prev))
  }, [])

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(tick, TICK_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, tick])

  const togglePause = useCallback(() => setPaused((p) => !p), [])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)))
  }, [])

  const createIncident = useCallback((alertIds: string[]) => {
    setAlerts((prev) => {
      const selected = prev.filter((a) => alertIds.includes(a.id))
      if (selected.length === 0) return prev
      const incident: Incident = {
        id: uuid(),
        title: `Incident — ${selected[0].regionName}`,
        severity: selected.some((a) => a.severity === 'critical') ? 'critical' : 'warning',
        status: 'active',
        regionIds: [...new Set(selected.map((a) => a.regionId))],
        alerts: alertIds,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: selected.map((a) => a.message).join('; '),
      }
      setIncidents((i) => [incident, ...i])
      return prev.map((a) => (alertIds.includes(a.id) ? { ...a, acknowledged: true } : a))
    })
  }, [])

  const resolveIncident = useCallback((incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: 'resolved', updatedAt: Date.now() } : i)),
    )
  }, [])

  return {
    regions,
    links,
    alerts,
    incidents,
    decisions,
    metrics,
    paused,
    togglePause,
    acknowledgeAlert,
    createIncident,
    resolveIncident,
  }
}
