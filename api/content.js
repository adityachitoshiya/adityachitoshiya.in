import { requireAdmin } from './_lib/auth.js'
import { readContent, writeContent } from './_lib/store.js'
import { sanitize } from './_lib/schema.js'

const MAX_BODY = 300_000

// GET is public (the site renders from it). PUT needs a valid admin token.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    if (req.method === 'GET') {
      const data = await readContent()
      return res.status(200).json({ data })
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return
      let parsed = req.body ?? {}
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }
      }
      if (JSON.stringify(parsed).length > MAX_BODY) return res.status(413).json({ error: 'Content too large' })
      const data = sanitize(parsed.data)
      const updatedAt = await writeContent(data)
      return res.status(200).json({ ok: true, updatedAt, data })
    }

    res.setHeader('Allow', 'GET, PUT')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('content api', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
