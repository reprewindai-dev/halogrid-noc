"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Shield, ArrowRight, Search, Terminal, FileSearch,
  Globe, BarChart3, ShieldCheck, Layers, Workflow, Lock
} from "lucide-react"

const API_URL = "https://api.veklom.com"
const MARKETPLACE_ADMIN_EMAILS = new Set(["veklomdev@hotmail.com"])

const categories = [
  { id: "all", label: "All" },
  { id: "ai-infrastructure", label: "AI Infrastructure" },
  { id: "cost-control", label: "Cost Control" },
  { id: "compliance", label: "Compliance & Audit" },
  { id: "execution", label: "Execution & Jobs" },
  { id: "developer-tools", label: "Developer Tools" },
  { id: "security", label: "Security" },
]

const tiers = [
  { id: "all", label: "All Tiers" },
  { id: "sovereign", label: "Sovereign" },
  { id: "essential", label: "Essential" },
]

const listings = [
  // ── SOVEREIGN LISTINGS ── self-hostable, data stays on buyer infra, compliance-verified
  {
    id: "veklom-backend",
    name: "Veklom Backend",
    vendor: "Veklom",
    firstParty: true,
    tier: "sovereign",
    category: "ai-infrastructure",
    badge: "Sovereign Verified",
    tagline: "The control layer for AI operations, usage governance, and sovereign-ready execution.",
    description: "Full backend access: LLM inference, cost-tracked routing, token wallet, audit logs, kill switches, and compliance-grade observability. Self-host available — your data never leaves your infrastructure.",
    capabilities: ["LLM Execution", "API Gateway", "Token Metering", "Budget Caps", "Audit Trail", "Kill Switch"],
    pricing: "From $99/mo",
    deployment: "Self-Host · Managed Cloud",
    dataFlow: "Data stays on your infra (self-host) or Veklom cloud (managed)",
    compliance: ["SOC 2", "HIPAA", "GDPR"],
    rating: 5.0,
    reviews: 0,
    featured: true,
    icon: Shield,
  },
  {
    id: "document-cleaner",
    name: "Document Cleaner",
    vendor: "Veklom",
    firstParty: true,
    tier: "sovereign",
    category: "compliance",
    badge: "Sovereign Verified",
    tagline: "Strip PII before data touches any model. Deploy on your own infra.",
    description: "Run on-prem or in your VPC. Auto-detect and redact names, SSNs, medical IDs, financial data. No data leaves your environment. HIPAA-grade redaction with full audit trail.",
    capabilities: ["PII Redaction", "On-Prem Deploy", "Data Masking", "Custom Patterns", "Audit Logged"],
    pricing: "Per-call · Tokens",
    deployment: "Self-Host · Air-Gapped",
    dataFlow: "Data never leaves your environment",
    compliance: ["HIPAA", "SOC 2", "GDPR"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: FileSearch,
  },
  {
    id: "audit-exporter",
    name: "Audit & Compliance Exporter",
    vendor: "Veklom",
    firstParty: true,
    tier: "sovereign",
    category: "compliance",
    badge: "Sovereign Verified",
    tagline: "Generate compliance evidence packages in seconds, not weeks.",
    description: "Crypto-signed audit trail for every API call and token deduction. Export as PDF, CSV, or JSON. Pre-formatted for SOC 2 auditors, HIPAA officers, and GDPR DSARs. Self-hostable — logs stay on your infra.",
    capabilities: ["Audit Trail Export", "PDF Reports", "SOC 2 Mapping", "HIPAA Evidence", "GDPR DSAR"],
    pricing: "From $2,500/mo (Sovereign)",
    deployment: "Self-Host · Managed Cloud",
    dataFlow: "Audit data stays on your infra",
    compliance: ["SOC 2", "HIPAA", "GDPR"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: ShieldCheck,
  },
  {
    id: "kill-switch",
    name: "Emergency Kill Switch",
    vendor: "Veklom",
    firstParty: true,
    tier: "sovereign",
    category: "security",
    badge: "Sovereign Verified",
    tagline: "One call. All execution stops. No exceptions.",
    description: "Halt all execution across every API key in your workspace instantly. Auto-triggers on configurable budget thresholds. Self-hostable — your kill switch, your infrastructure, no external dependency.",
    capabilities: ["Instant Halt", "Budget Auto-Trigger", "Per-Workspace", "Self-Hosted", "Incident Logging"],
    pricing: "From $2,500/mo (Sovereign)",
    deployment: "Self-Host · Managed Cloud",
    dataFlow: "Control plane on your infra",
    compliance: ["SOC 2"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: Terminal,
  },
  // ── ESSENTIAL LISTINGS ── cloud-hosted through Veklom, data flows through Veklom gateway
  {
    id: "prompt-transform-engine",
    name: "Prompt Transform Engine",
    vendor: "Veklom",
    firstParty: true,
    tier: "essential",
    category: "execution",
    badge: "Essential",
    tagline: "Rewrite, summarize, translate, and classify — cloud-hosted, token-metered.",
    description: "Submit text through Veklom\u2019s cloud pipeline. Choose transform: summarize, rewrite, translate 40+ languages, classify. Data is processed on Veklom\u2019s managed infrastructure. Token-metered with budget caps.",
    capabilities: ["Summarization", "Rewriting", "Translation", "Classification", "Batch Processing"],
    pricing: "Per-call · Tokens",
    deployment: "Veklom Cloud",
    dataFlow: "Data processed on Veklom managed infra",
    compliance: ["SOC 2"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: Workflow,
  },
  {
    id: "cost-router",
    name: "Cost-Aware Router",
    vendor: "Veklom",
    firstParty: true,
    tier: "essential",
    category: "cost-control",
    badge: "Essential",
    tagline: "Route every AI call to the cheapest capable model — automatically.",
    description: "Veklom evaluates complexity, routes to the cheapest model meeting your quality threshold, logs savings. Data flows through Veklom\u2019s gateway to providers (OpenAI, Anthropic, Groq). 30-60% typical savings.",
    capabilities: ["Multi-Provider Routing", "Cost Optimization", "Quality Thresholds", "Savings Reports", "Fallback Chains"],
    pricing: "From $499/mo (Pro)",
    deployment: "Veklom Cloud",
    dataFlow: "Data routed through Veklom gateway to AI providers",
    compliance: ["SOC 2"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: BarChart3,
  },
  {
    id: "api-gateway",
    name: "Governed API Gateway",
    vendor: "Veklom",
    firstParty: true,
    tier: "essential",
    category: "ai-infrastructure",
    badge: "Essential",
    tagline: "Wrap any external API with rate limits, budget caps, and per-key tracking.",
    description: "Proxy calls to OpenAI, Anthropic, Cohere through Veklom. Every request gets a trace ID, cost attribution, and policy check. Data passes through Veklom\u2019s cloud gateway to the target API.",
    capabilities: ["API Proxying", "Rate Limiting", "Cost Attribution", "Team Budgets", "Auto-Kill"],
    pricing: "From $99/mo",
    deployment: "Veklom Cloud",
    dataFlow: "Data proxied through Veklom to external APIs",
    compliance: ["SOC 2"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: Globe,
  },
  {
    id: "batch-processor",
    name: "Batch Processor",
    vendor: "Veklom",
    firstParty: true,
    tier: "essential",
    category: "execution",
    badge: "Essential",
    tagline: "Submit hundreds of jobs. Get results when done. Pay only for what runs.",
    description: "Upload CSV or JSON. Veklom queues, processes through your pipeline (summarize, extract, classify), returns via webhook. Data processed on Veklom cloud. Hard spend cap per batch.",
    capabilities: ["Queue Processing", "CSV Upload", "Webhook Delivery", "Spend Caps", "Progress Tracking"],
    pricing: "Per-call · Tokens",
    deployment: "Veklom Cloud",
    dataFlow: "Data processed on Veklom managed infra",
    compliance: ["SOC 2"],
    rating: null,
    reviews: 0,
    featured: false,
    icon: Layers,
  },
]

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTier, setActiveTier] = useState("all")
  const [canViewSovereign, setCanViewSovereign] = useState(false)

  useEffect(() => {
    const token =
      localStorage.getItem("veklom_access_token") ||
      localStorage.getItem("access_token")

    if (!token) {
      setCanViewSovereign(false)
      return
    }

    const loadMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          setCanViewSovereign(false)
          return
        }
        const me = await res.json()
        const role = String(me?.role || "").toLowerCase()
        const email = String(me?.email || "").toLowerCase()
        const allowed =
          Boolean(me?.is_superuser) ||
          role === "owner" ||
          role === "admin" ||
          MARKETPLACE_ADMIN_EMAILS.has(email)
        setCanViewSovereign(allowed)
      } catch {
        setCanViewSovereign(false)
      }
    }

    loadMe()
  }, [])

  const filtered = listings.filter((l) => {
    const matchSearch = search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.tagline.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "all" || l.category === activeCategory
    const matchTier = activeTier === "all" || l.tier === activeTier
    return matchSearch && matchCategory && matchTier
  })

  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      {/* Nav */}
      <nav className="nav-blur sticky top-0 z-50 border-b rule-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <Shield className="h-5 w-5" style={{ color: "var(--brass)" }} />
              <span className="font-serif text-lg" style={{ color: "var(--bone)" }}>Veklom</span>
              <span className="eyebrow ml-2 hidden sm:inline">Marketplace</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/marketplace" className="text-sm transition-colors" style={{ color: "var(--brass-2)" }}>Marketplace</Link>
              <Link href="/pricing" className="text-sm hover:text-[color:var(--brass-2)] transition-colors" style={{ color: "var(--bone-2)" }}>Pricing</Link>
              <Link href="/vendor" className="text-sm hover:text-[color:var(--brass-2)] transition-colors hidden sm:inline" style={{ color: "var(--bone-2)" }}>Vendors</Link>
              <Link href="/dashboard" className="text-sm hover:text-[color:var(--brass-2)] transition-colors hidden sm:inline" style={{ color: "var(--bone-2)" }}>Dashboard</Link>
              <Link href="/login" className="text-sm hover:text-[color:var(--brass-2)] transition-colors" style={{ color: "var(--bone-2)" }}>Sign In</Link>
              <Link href="/signup" className="btn-brass !py-2.5 !px-5 !text-[11px]">
                Get Access <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,146,91,0.06) 0%, transparent 60%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
          <div className="max-w-3xl">
            <div className="eyebrow mb-6">— Marketplace</div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6" style={{ color: "var(--bone)" }}>
              AI tools that don&apos;t<br />
              <span style={{ color: "var(--brass-2)", fontStyle: "italic" }}>run away with your budget.</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--bone-2)" }}>
              Every listing runs through Veklom&apos;s control layer. Token-metered. Budget-capped.
              Audit-logged. Browse capabilities, not chaos.
            </p>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="border-t rule-line sticky top-16 z-40 nav-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--mute)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools, capabilities..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-sm border rule-line focus:outline-none focus:border-[color:var(--brass)] transition-colors"
                style={{ background: "var(--ink-2)", color: "var(--bone)", borderColor: "var(--rule)" }}
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] px-4 py-2 rounded-sm border transition-all"
                  style={{
                    background: activeCategory === c.id ? "var(--brass)" : "transparent",
                    color: activeCategory === c.id ? "var(--ink)" : "var(--mute)",
                    borderColor: activeCategory === c.id ? "var(--brass)" : "var(--rule)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Tier toggle */}
            <div className="flex gap-2">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTier(t.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] px-4 py-2 rounded-sm border transition-all"
                  style={{
                    background: activeTier === t.id ? "var(--ink-3)" : "transparent",
                    color: activeTier === t.id ? "var(--bone)" : "var(--mute)",
                    borderColor: activeTier === t.id ? "var(--rule-2)" : "var(--rule)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results count */}
      <section style={{ background: "var(--ink)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-2">
          <p className="font-mono text-xs" style={{ color: "var(--mute)" }}>
            {filtered.length} {filtered.length === 1 ? "listing" : "listings"} found
          </p>
        </div>
      </section>

      {/* Featured Listing — Sovereign gated */}
      {filtered.find((l) => l.featured) && activeCategory === "all" && activeTier === "all" && search === "" && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-6">
          {(() => {
            const feat = listings.find((l) => l.featured)!
            return (
              <div className="card-brass p-0 overflow-hidden relative">
                <div className="relative p-10 lg:p-14">
                  <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-[0.03]" style={{
                    background: "radial-gradient(circle at 80% 40%, var(--brass) 0%, transparent 70%)"
                  }} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="eyebrow" style={{ color: "var(--brass-2)" }}>Featured Listing</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm" style={{ background: "rgba(196,146,91,0.15)", color: "var(--brass-2)" }}>
                        Sovereign Verified
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm" style={{ background: "rgba(122,156,100,0.15)", color: "var(--moss)" }}>
                        First-Party
                      </span>
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl mb-4 tracking-tight" style={{ color: "var(--bone)" }}>
                      {feat.name}
                    </h2>
                    <p className="text-lg mb-6 max-w-xl leading-relaxed" style={{ color: "var(--bone-2)" }}>
                      {feat.tagline}
                    </p>

                    {/* Content */}
                    <div className="relative">
                      <div
                        className={!canViewSovereign ? "select-none" : ""}
                        style={!canViewSovereign ? { filter: "blur(6px)", pointerEvents: "none" } : undefined}
                      >
                        <p className="text-sm mb-8 max-w-xl leading-relaxed" style={{ color: "var(--mute)" }}>
                          {feat.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {feat.capabilities.map((c) => (
                            <span key={c} className="font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-sm" style={{ background: "var(--ink)", border: "1px solid var(--rule)", color: "var(--bone-2)" }}>
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-8 mb-8">
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: "var(--mute)" }}>Pricing</div>
                            <div className="font-serif text-xl" style={{ color: "var(--bone)" }}>{feat.pricing}</div>
                          </div>
                          <div className="h-8 w-px" style={{ background: "var(--rule)" }} />
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: "var(--mute)" }}>Deployment</div>
                            <div className="text-sm" style={{ color: "var(--bone-2)" }}>{feat.deployment}</div>
                          </div>
                          <div className="h-8 w-px" style={{ background: "var(--rule)" }} />
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: "var(--mute)" }}>Compliance</div>
                            <div className="flex gap-2">
                              {feat.compliance.map((c) => (
                                <span key={c} className="font-mono text-[10px]" style={{ color: "var(--moss)" }}>{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {!canViewSovereign && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(to bottom, transparent 0%, var(--ink) 60%)" }}>
                          <div className="text-center">
                            <Lock className="h-6 w-6 mx-auto mb-3" style={{ color: "var(--brass)" }} />
                            <p className="font-serif text-xl mb-2" style={{ color: "var(--bone)" }}>Sovereign Access Required</p>
                            <p className="text-sm mb-5 max-w-sm mx-auto" style={{ color: "var(--mute)" }}>
                              Full product details, deployment docs, compliance certs, and pricing are available to Sovereign plan members.
                            </p>
                            <Link href="/signup?plan=sovereign" className="btn-brass">
                              Unlock Sovereign Access <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/request-access" className="btn-ghost-brass">
                              Request a Preview
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </section>
      )}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.filter((l) => !l.featured || search !== "" || activeCategory !== "all" || activeTier !== "all").map((listing) => {
            const isSovereign = listing.tier === "sovereign"
            const isGated = isSovereign && !canViewSovereign
            return (
              <div key={listing.id} className="block group">
                <div className="card-ink p-8 h-full flex flex-col transition-all group-hover:border-[color:var(--rule-2)] relative overflow-hidden">
                  {/* Header — always visible */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="p-3 rounded-sm" style={{ background: "var(--ink-3)" }}>
                      <listing.icon className="h-5 w-5" style={{ color: "var(--brass-2)" }} />
                    </div>
                    <div className="flex gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-1 rounded-sm" style={{
                        background: isSovereign ? "rgba(196,146,91,0.12)" : "rgba(245,241,232,0.06)",
                        color: isSovereign ? "var(--brass-2)" : "var(--mute)",
                      }}>
                        {listing.badge}
                      </span>
                      {listing.firstParty && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-1 rounded-sm" style={{ background: "rgba(122,156,100,0.12)", color: "var(--moss)" }}>
                          Veklom
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name — always visible */}
                  <h3 className="font-serif text-2xl mb-2 tracking-tight" style={{ color: "var(--bone)" }}>{listing.name}</h3>

                  {isGated ? (
                    /* ── Sovereign: blurred + gated ── */
                    <div className="flex-1 flex flex-col relative">
                      <div className="select-none" style={{ filter: "blur(5px)", pointerEvents: "none" }}>
                        <p className="text-sm mb-5 leading-relaxed flex-1" style={{ color: "var(--mute)" }}>{listing.tagline}</p>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {listing.capabilities.slice(0, 3).map((c) => (
                            <span key={c} className="font-mono text-[9px] uppercase tracking-[0.10em] px-2 py-1 rounded-sm" style={{ background: "var(--ink-3)", color: "var(--bone-2)" }}>
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="pt-5 border-t rule-line flex items-center justify-between">
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--mute)" }}>Pricing</div>
                            <div className="text-sm mt-0.5" style={{ color: "var(--bone-2)" }}>{listing.pricing}</div>
                          </div>
                        </div>
                      </div>
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" style={{ background: "linear-gradient(to bottom, transparent 0%, var(--ink) 40%)" }}>
                        <Lock className="h-5 w-5 mb-2" style={{ color: "var(--brass)" }} />
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--brass)" }}>Sovereign Access Only</p>
                        <div className="flex gap-2">
                          <Link href="/signup?plan=sovereign" className="btn-brass !py-2 !px-4 !text-[10px]">
                            Unlock <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link href="/request-access" className="btn-ghost-brass !py-2 !px-4 !text-[10px]">
                            Request Preview
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── Essential: fully visible ── */
                    <>
                      <p className="text-sm mb-5 leading-relaxed flex-1" style={{ color: "var(--mute)" }}>{listing.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {listing.capabilities.slice(0, 3).map((c) => (
                          <span key={c} className="font-mono text-[9px] uppercase tracking-[0.10em] px-2 py-1 rounded-sm" style={{ background: "var(--ink-3)", color: "var(--bone-2)" }}>
                            {c}
                          </span>
                        ))}
                        {listing.capabilities.length > 3 && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.10em] px-2 py-1 rounded-sm" style={{ background: "var(--ink-3)", color: "var(--mute)" }}>
                            +{listing.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="pt-5 border-t rule-line flex items-center justify-between">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--mute)" }}>Pricing</div>
                          <div className="text-sm mt-0.5" style={{ color: "var(--bone-2)" }}>{listing.pricing}</div>
                        </div>
                        {listing.compliance.length > 0 && (
                          <div className="flex gap-1.5">
                            {listing.compliance.map((c) => (
                              <span key={c} className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(122,156,100,0.10)", color: "var(--moss)" }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--mute)" }} />
            <h3 className="font-serif text-2xl mb-2" style={{ color: "var(--bone)" }}>No listings found</h3>
            <p className="text-sm" style={{ color: "var(--mute)" }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* Submit CTA */}
      <section className="border-t rule-line py-20" style={{ background: "var(--ink-2)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="eyebrow mb-6">— For Vendors</div>
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight mb-6" style={{ color: "var(--bone)" }}>
            List your tool on Veklom.
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--bone-2)" }}>
            Sovereign-verified or Essential — submit your product for review and reach
            teams that care about governance, not just features.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/vendor" className="btn-brass">Submit a Listing <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/pricing" className="btn-ghost-brass">Vendor Pricing</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t rule-line py-12" style={{ background: "var(--ink)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5" style={{ color: "var(--brass)" }} />
              <span className="font-serif text-lg" style={{ color: "var(--bone)" }}>Veklom</span>
              <span className="font-mono text-xs ml-3" style={{ color: "var(--mute)" }}>v1.0 · 2026</span>
            </div>
            <div className="flex gap-8 text-sm font-mono uppercase tracking-[0.12em]" style={{ color: "var(--mute)" }}>
              <Link href="/marketplace" className="hover:text-[color:var(--brass-2)] transition-colors">Marketplace</Link>
              <Link href="/pricing" className="hover:text-[color:var(--brass-2)] transition-colors">Pricing</Link>
              <Link href="/vendor" className="hover:text-[color:var(--brass-2)] transition-colors">Vendors</Link>
              <Link href="/login" className="hover:text-[color:var(--brass-2)] transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
