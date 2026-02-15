export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  let githubFollowers = 0
  try {
    const response = await fetch('https://api.github.com/users/dev-matheusfelipe', {
      headers
    })
    if (response.ok) {
      const data = await response.json()
      githubFollowers = typeof data.followers === 'number' ? data.followers : 0
    }
  } catch {
    githubFollowers = 0
  }

  const linkedinRaw = process.env.LINKEDIN_FOLLOWERS
  const linkedinParsed = Number(linkedinRaw)
  const linkedinFollowers = Number.isFinite(linkedinParsed) ? linkedinParsed : 0

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  return res.status(200).json({
    githubFollowers,
    linkedinFollowers
  })
}
