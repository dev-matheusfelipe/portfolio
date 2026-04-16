export type VisitMetric = {
  totalCount: number | null
  todayCount: number | null
  dashboardUrl: string | null
}

export const emptyMetric: VisitMetric = {
  totalCount: null,
  todayCount: null,
  dashboardUrl: null
}

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

export const toMetric = (payload: { totalCount?: unknown; todayCount?: unknown; dashboardUrl?: unknown }): VisitMetric => ({
  totalCount: isFiniteNumber(payload.totalCount) ? payload.totalCount : null,
  todayCount: isFiniteNumber(payload.todayCount) ? payload.todayCount : null,
  dashboardUrl: typeof payload.dashboardUrl === 'string' ? payload.dashboardUrl : null
})

export const sumCounts = (values: Array<number | null | undefined>) => {
  const valid = values.filter(isFiniteNumber)
  if (!valid.length) return null
  return valid.reduce((acc, value) => acc + value, 0)
}

export const mergeMetricWithFallback = (live: VisitMetric | null, fallback: VisitMetric | null): VisitMetric => {
  if (live) return live
  if (fallback) return fallback
  return { totalCount: 0, todayCount: 0, dashboardUrl: null }
}

export const readCachedMetric = (storage: Storage, key: string): VisitMetric | null => {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    return toMetric(JSON.parse(raw) as Record<string, unknown>)
  } catch {
    return null
  }
}

export const writeCachedMetric = (storage: Storage, key: string, metric: VisitMetric) => {
  try {
    storage.setItem(key, JSON.stringify(metric))
  } catch {
    // ignore storage failures
  }
}
