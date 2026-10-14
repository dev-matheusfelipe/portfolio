import { randomUUID } from 'node:crypto';

// Public project key: it has no direct access to the counter tables.
const COUNTER_ENDPOINT = 'https://dntwpvjdkuzibmfhxdkh.supabase.co/functions/v1/portfolio-views';
const COUNTER_PUBLIC_KEY = 'sb_publishable_qXzvhPESvw8A5menxfNlEQ_NUiZmmie';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (origin) {
      try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Invalid origin' }); }
      catch { return res.status(403).json({ error: 'Invalid origin' }); }
    }
    if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Invalid origin' });
  }
  const cookie = String(req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith('portfolio-view-id='));
  const candidate = cookie?.slice('portfolio-view-id='.length);
  const eventId = candidate && UUID.test(candidate) ? candidate : randomUUID();
  try {
    const response = await fetch(COUNTER_ENDPOINT, {
      method: req.method,
      headers: { apikey: COUNTER_PUBLIC_KEY, 'Content-Type': 'application/json' },
      ...(req.method === 'POST' ? { body: JSON.stringify({ eventId }) } : {}),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Counter unavailable');
    const data = await response.json();
    if (!Number.isSafeInteger(data.totalCount) || data.totalCount < 0) throw new Error('Invalid count');
    if (req.method === 'POST') res.setHeader('Set-Cookie', 'portfolio-view-id=' + eventId + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1800');
    return res.status(200).json({ totalCount: data.totalCount });
  } catch { return res.status(503).json({ error: 'View count temporarily unavailable' }); }
}

