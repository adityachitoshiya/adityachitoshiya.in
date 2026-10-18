import crypto from 'node:crypto'
import { requireAdmin } from './_lib/auth.js'

// Signs a direct browser-to-Cloudinary upload. Admin only; the API secret
// never leaves the server.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!requireAdmin(req, res)) return

  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ error: 'Cloudinary is not configured' })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'portfolio_v2'
  // Parameters must be signed in alphabetical order.
  const toSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex')

  return res.status(200).json({ cloudName, apiKey, timestamp, folder, signature })
}
