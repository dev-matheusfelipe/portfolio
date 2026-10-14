import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'

let pendingVisit: Promise<number> | null = null

function loadViews(register: boolean): Promise<number> {
  if (pendingVisit) return pendingVisit
  const day = new Date().toISOString().slice(0, 10)
  const key = `portfolio-visit-posted:matheusfelipe.dev.br:${window.location.pathname}:${day}`
  let counted = true
  try { counted = sessionStorage.getItem(key) === '1' } catch { /* Read only when session storage is unavailable. */ }
  const shouldRegister = register && !counted && window.location.hostname === 'matheusfelipe.dev.br'
  pendingVisit = fetch('/api/visits', { method: shouldRegister ? 'POST' : 'GET', cache: 'no-store' })
    .then(async response => {
      if (!response.ok) throw new Error('Counter unavailable')
      const data: { totalCount?: unknown } = await response.json()
      if (typeof data.totalCount !== 'number' || !Number.isSafeInteger(data.totalCount) || data.totalCount < 0) throw new Error('Invalid count')
      if (shouldRegister) { try { sessionStorage.setItem(key, '1') } catch { /* Count already recorded. */ } }
      return data.totalCount
    }).finally(() => { pendingVisit = null })
  return pendingVisit
}

export default function VisitorCounter({ language }: { language: 'pt' | 'en' }) {
  const [count, setCount] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const value = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const pt = language === 'pt'

  useEffect(() => {
    let active = true
    setLoading(true)
    setFailed(false)
    loadViews(refresh === 0).then(total => { if (active) setCount(total) })
      .catch(() => { if (active) setFailed(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refresh])

  useEffect(() => value.on('change', latest => setShown(Math.round(latest))), [value])
  useEffect(() => {
    if (count === null) return
    const control = animate(value, count, { duration: reducedMotion ? 0 : 0.8, ease: 'easeOut' })
    return () => control.stop()
  }, [count, reducedMotion, value])

  return (
    <motion.section initial={reducedMotion ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} aria-label={pt ? 'Visualizações do portfólio' : 'Portfolio views'} className="relative mt-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-5 sm:px-6">
      <svg aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-48 opacity-[0.08] text-[var(--button)]" viewBox="0 0 192 100"><defs><pattern id="visit-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="currentColor" /></pattern></defs><rect width="192" height="100" fill="url(#visit-dots)" /></svg>
      <div className="relative flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <svg aria-hidden="true" className="h-7 w-7 shrink-0 text-[var(--button)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
        <div className="min-w-0 flex-1"><h3 className="font-['Poppins'] text-base font-semibold leading-snug text-[var(--text-title)]">{pt ? 'Visualizações do portfólio' : 'Portfolio views'}</h3><p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{failed ? (pt ? 'Contagem indisponível. Tente novamente.' : 'Count unavailable. Try again.') : (pt ? 'Acessos registrados neste site.' : 'Views recorded on this website.')}</p></div>
        <div className="flex items-center gap-3"><span className="font-['Poppins'] text-[30px] font-semibold leading-none tabular-nums text-[var(--text-title)]" aria-label={count !== null ? String(count) : (pt ? 'Contagem indisponível' : 'Count unavailable')}>{count !== null ? new Intl.NumberFormat(pt ? 'pt-BR' : 'en-US').format(shown) : loading ? '…' : '—'}</span><button type="button" onClick={() => setRefresh(current => current + 1)} disabled={loading} aria-label={pt ? 'Atualizar contador' : 'Refresh counter'} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--text-title)] transition hover:border-[var(--button)] disabled:opacity-40"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7v5h-5M4 17v-5h5M19 12a7 7 0 0 0-12-5M5 12a7 7 0 0 0 12 5" /></svg></button></div>
      </div>
    </motion.section>
  )
}
