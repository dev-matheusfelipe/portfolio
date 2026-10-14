// Forward only the portfolio's real view count. Never substitute a fake zero.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (req.method === 'POST' && req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ error: 'Invalid origin' })
    } catch { return res.status(403).json({ error: 'Invalid origin' }) }
  }
  try {
    const endpoint = process.env.VISITOR_COUNTER_API_URL || 'https://visitor.6developer.com/visit'
    const domain = 'matheusfelipe.dev.br'
    const url = new URL(endpoint)
    if (req.method === 'GET') url.searchParams.set('domain', domain)
    const response = await fetch(url, {
      method: req.method,
      headers: { Accept: 'application/json', ...(req.method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      ...(req.method === 'POST' ? { body: JSON.stringify({ domain, timezone: 'America/Sao_Paulo', page_path: '/', page_title: 'Portfólio de Matheus Felipe' }) } : {}),
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) throw new Error('Upstream unavailable')
    const data = await response.json()
    if (!Number.isSafeInteger(data.totalCount) || data.totalCount < 0) throw new Error('Invalid count')
    return res.status(200).json({ totalCount: data.totalCount })
  } catch { return res.status(503).json({ error: 'View count temporarily unavailable' }) }
}
