import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeMetricWithFallback, sumCounts, toMetric } from '../src/lib/visitStats'

test('toMetric keeps finite numeric counters only', () => {
  assert.deepEqual(toMetric({ totalCount: 12, todayCount: 3, dashboardUrl: 'https://x.test' }), {
    totalCount: 12,
    todayCount: 3,
    dashboardUrl: 'https://x.test'
  })

  assert.deepEqual(toMetric({ totalCount: Number.NaN, todayCount: '2' }), {
    totalCount: null,
    todayCount: null,
    dashboardUrl: null
  })
})

test('sumCounts returns null when no valid value exists', () => {
  assert.equal(sumCounts([null, undefined, Number.NaN]), null)
  assert.equal(sumCounts([1, null, 4]), 5)
})

test('mergeMetricWithFallback uses cached counters when live request fails', () => {
  const cached = { totalCount: 22, todayCount: 5, dashboardUrl: null }

  assert.deepEqual(mergeMetricWithFallback(null, cached), cached)
  assert.deepEqual(mergeMetricWithFallback(null, null), { totalCount: 0, todayCount: 0, dashboardUrl: null })
})
