export const randomBetween = (min: number, max: number): number =>
  Math.random() * (max - min) + min

export const randomInt = (min: number, max: number): number =>
  Math.floor(randomBetween(min, max + 1))

export const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v))

export const uuid = (): string =>
  crypto.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const hashLike = (): string => {
  const chars = '0123456789abcdef'
  let h = '0x'
  for (let i = 0; i < 12; i++) h += chars[randomInt(0, 15)]
  return h
}

export const formatTimestamp = (ts: number): string => {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export const formatDuration = (ms: number): string => {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}
