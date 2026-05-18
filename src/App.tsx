import { useState } from 'react'
import { useNoc } from './hooks/useNoc'
import TopBar from './components/TopBar'
import MetricsBar from './components/MetricsBar'
import GlobeMap from './components/GlobeMap'
import AlertPanel from './components/AlertPanel'
import DecisionFeed from './components/DecisionFeed'
import RegionTable from './components/RegionTable'
import IncidentPanel from './components/IncidentPanel'
import NetworkTopology from './components/NetworkTopology'
import StatusBar from './components/StatusBar'
import './styles/globals.css'

type RightTab = 'alerts' | 'decisions' | 'incidents' | 'network'

export default function App() {
  const {
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
  } = useNoc()

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [rightTab, setRightTab] = useState<RightTab>('alerts')

  const handleRegionClick = (regionId: string) => {
    setSelectedRegionId((prev) => (prev === regionId ? null : regionId))
  }

  const tabs: { key: RightTab; label: string; count?: number }[] = [
    { key: 'alerts', label: 'Alerts', count: alerts.filter((a) => !a.acknowledged).length },
    { key: 'decisions', label: 'Decisions' },
    { key: 'incidents', label: 'Incidents', count: incidents.filter((i) => i.status === 'active').length },
    { key: 'network', label: 'Network' },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#060d18' }}>
      <TopBar metrics={metrics} paused={paused} onToggle={togglePause} />
      <MetricsBar metrics={metrics} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Region table */}
        <div className="w-[320px] border-r border-gray-800 overflow-hidden flex flex-col bg-[#0a1220]/50">
          <RegionTable regions={regions} selectedRegionId={selectedRegionId} onRegionClick={handleRegionClick} />
        </div>

        {/* Center: Globe map */}
        <div className="flex-1 relative overflow-hidden">
          <GlobeMap regions={regions} links={links} selectedRegionId={selectedRegionId} onRegionClick={handleRegionClick} />
        </div>

        {/* Right: Tabbed panel */}
        <div className="w-[360px] border-l border-gray-800 overflow-hidden flex flex-col bg-[#0a1220]/50">
          <div className="flex border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRightTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 font-mono text-[9px] uppercase tracking-wider transition-colors border-b-2"
                style={{
                  color: rightTab === tab.key ? '#38bdf8' : '#6b7280',
                  borderBottomColor: rightTab === tab.key ? '#38bdf8' : 'transparent',
                }}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="font-mono text-[8px] px-1 py-0.5 rounded bg-red-500/20 text-red-400">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === 'alerts' && (
              <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} onCreateIncident={createIncident} />
            )}
            {rightTab === 'decisions' && <DecisionFeed decisions={decisions} />}
            {rightTab === 'incidents' && <IncidentPanel incidents={incidents} onResolve={resolveIncident} />}
            {rightTab === 'network' && <NetworkTopology links={links} />}
          </div>
        </div>
      </div>

      <StatusBar metrics={metrics} paused={paused} />
    </div>
  )
}
