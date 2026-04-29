import Link from "next/link"
import { Shield, Server, Lock, Zap, Check, ArrowRight, Activity, FileText, Eye, Terminal } from "lucide-react"
import { SovereignBadge, SovereignBadgeInline } from "@/components/SovereignBadge"
import InteractiveDemo from "@/components/InteractiveDemo"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      {/* Navigation */}
      <nav className="nav-blur sticky top-0 z-50 border-b rule-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <Shield className="h-5 w-5" style={{ color: "var(--brass)" }} />
              <span className="font-serif text-lg" style={{ color: "var(--bone)" }}>Veklom</span>
              <span className="eyebrow ml-2 hidden sm:inline">Marketplace</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/marketplace" className="text-sm hover:text-[color:var(--brass-2)] transition-colors" style={{ color: "var(--bone-2)" }}>Marketplace</Link>
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

      <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,146,91,0.08) 0%, transparent 60%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-4xl">
            <div className="eyebrow mb-6">— Sovereign Infrastructure / Token-Metered</div>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8" style={{ color: "var(--bone)" }}>
              Run AI jobs<br />
              <span style={{ color: "var(--brass-2)", fontStyle: "italic" }}>without losing control</span><br />
              of spend or data.
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed" style={{ color: "var(--bone-2)" }}>
              Regulated teams in hospitals, banks, and government want AI now.
              Veklom gives them modern AI without losing control of data, spend, or compliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="btn-brass">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="btn-ghost-brass">
                View Pricing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <SovereignBadgeInline />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-2" style={{ color: "var(--mute)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--moss)" }} /> SOC 2 / HIPAA / GDPR
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-2" style={{ color: "var(--mute)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--moss)" }} /> 99.9% SLA
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-2" style={{ color: "var(--mute)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brass)" }} /> 14-day free trial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo — MAIN FEATURE */}
      <section className="py-20 border-t rule-line" style={{ background: "var(--ink-2)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="eyebrow mb-4">— Live Simulation</div>
              <h2 className="font-serif text-4xl sm:text-5xl tracking-tight" style={{ color: "var(--bone)" }}>
                See it work.<br />
                <span style={{ color: "var(--brass-2)", fontStyle: "italic" }}>Before you buy.</span>
              </h2>
              <p className="text-base mt-4 max-w-xl leading-relaxed" style={{ color: "var(--bone-2)" }}>
                Pick a scenario — hospital, bank, or agency. Watch Veklom detect PII, auto-redact, meter tokens, enforce spend controls, and generate a crypto-signed audit trail.
              </p>
            </div>
            <SovereignBadge size={80} />
          </div>
          <InteractiveDemo />
        </div>
      </section>

      {/* Features */}
      <section className="py-24" style={{ background: "var(--ink-2)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">— Why Veklom</div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight" style={{ color: "var(--bone)" }}>
              Built for teams that prefer<br />
              <span style={{ color: "var(--brass-2)", fontStyle: "italic" }}>evidence over rapport.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px rule-line" style={{ background: "var(--rule)" }}>
            {[
              {
                icon: Server,
                title: "True Sovereignty",
                desc: "Entirely self-hosted in your VPC or fully air-gapped. No data ever calls home."
              },
              {
                icon: Lock,
                title: "Governed AI Control",
                desc: "Multi-LLM gateway with audit-grade execution, compliance controls, and policy enforcement at runtime."
              },
              {
                icon: Zap,
                title: "Spend Protection",
                desc: "Hard spend limits and instant kill-switch control stop runaway AI before the bill hits."
              },
              {
                icon: Activity,
                title: "Token Metering",
                desc: "Pay-per-call pricing. 100 tokens per docs view. Variable cost endpoints. Hard budget caps at the wallet level."
              },
              {
                icon: Eye,
                title: "Competitor Reality",
                desc: "A 3AM alert after a runaway job is too late. Veklom stops runaway AI before money is spent."
              },
              {
                icon: Terminal,
                title: "Procurement Bypass",
                desc: "Perpetual source-available licensing helps teams skip months of vendor security reviews, legal loops, and procurement drag."
              },
            ].map((f) => (
              <div key={f.title} className="p-10 transition-colors" style={{ background: "var(--ink-2)" }}>
                <f.icon className="h-7 w-7 mb-6" style={{ color: "var(--brass-2)" }} />
                <h3 className="font-serif text-2xl mb-3" style={{ color: "var(--bone)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--bone-2)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 border-t rule-line" style={{ background: "var(--ink)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">— Pricing</div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight" style={{ color: "var(--bone)" }}>
              Transparent rates.<br />
              <span style={{ color: "var(--brass-2)", fontStyle: "italic" }}>No surprise invoices.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Free", price: "$0", desc: "Explore — no card required", credits: "50K", features: ["1 API key", "Health endpoints", "Token wallet", "Community docs"], free: true },
              { name: "Starter", price: "$99", desc: "Builders & small teams", credits: "10M", features: ["5 API keys", "Basic analytics", "AI support bot", "Cost prediction"] },
              { name: "Pro", price: "$499", desc: "AI teams & agencies", credits: "100M", features: ["20 API keys", "Advanced routing", "Savings insights", "Priority AI support"], popular: true },
              { name: "Sovereign", price: "$2,500", desc: "Regulated teams", credits: "500M", features: ["100 API keys", "Kill switch", "Compliance reports", "99.9% SLA"] },
              { name: "Enterprise", price: "Custom", desc: "Banks · Hospitals · Gov", credits: "Custom", features: ["Unlimited keys", "Dedicated AI agent", "Custom training", "99.99% SLA"] },
            ].map((plan) => (
              <div key={plan.name} className={plan.popular ? "card-brass p-8" : "card-ink p-8"}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-2xl" style={{ color: "var(--bone)" }}>{plan.name}</h3>
                  {plan.popular && <span className="eyebrow !text-[10px]" style={{ color: "var(--brass-2)" }}>— Popular</span>}
                </div>
                <p className="text-xs mb-6" style={{ color: "var(--mute)" }}>{plan.desc}</p>
                <div className="mb-6 pb-6 border-b rule-line">
                  <span className="font-serif text-5xl" style={{ color: "var(--bone)" }}>{plan.price}</span>
                  {plan.price !== "Custom" && <span className="font-mono text-sm ml-1" style={{ color: "var(--mute)" }}>/mo</span>}
                </div>
                <div className="font-mono text-xs mb-6" style={{ color: "var(--brass-2)" }}>
                  {plan.credits} credits / month
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--bone-2)" }}>
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--moss)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Enterprise" ? "/signup?plan=enterprise" : `/signup?plan=${plan.name.toLowerCase()}`}
                  className={plan.popular ? "btn-brass w-full justify-center !py-3" : "btn-ghost-brass w-full justify-center !py-3"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : plan.name === "Free" ? "Start Free" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/pricing" className="font-mono text-xs uppercase tracking-[0.18em] inline-flex items-center gap-2 hover:text-[color:var(--brass-2)] transition-colors" style={{ color: "var(--brass)" }}>
              View Full Pricing & Token Packs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t rule-line" style={{ background: "var(--ink-2)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="eyebrow mb-6">— Ready</div>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight mb-6" style={{ color: "var(--bone)" }}>
            Start with evidence.
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--bone-2)" }}>
            The future of enterprise AI is moving back on-prem. Start where your data already lives.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/signup" className="btn-brass">Create Account <ArrowRight className="h-4 w-4" /></Link>
            <Link href="https://api.veklom.com/api/v1/docs" className="btn-ghost-brass"><FileText className="h-4 w-4" /> Read Docs</Link>
          </div>
        </div>
      </section>

      </main>
      {/* Footer */}
      <footer className="border-t rule-line py-12" style={{ background: "var(--ink)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5" style={{ color: "var(--brass)" }} />
              <span className="font-serif text-lg" style={{ color: "var(--bone)" }}>Veklom</span>
              <span className="font-mono text-xs ml-3" style={{ color: "var(--mute)" }}>v1.0 · 2026</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono uppercase tracking-[0.12em]" style={{ color: "var(--mute)" }}>
              <Link href="/marketplace" className="hover:text-[color:var(--brass-2)] transition-colors">Marketplace</Link>
              <Link href="/pricing" className="hover:text-[color:var(--brass-2)] transition-colors">Pricing</Link>
              <Link href="/vendor" className="hover:text-[color:var(--brass-2)] transition-colors">Vendors</Link>
              <Link href="/legal/terms" className="hover:text-[color:var(--brass-2)] transition-colors">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-[color:var(--brass-2)] transition-colors">Privacy</Link>
              <Link href="/login" className="hover:text-[color:var(--brass-2)] transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

