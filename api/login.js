import { checkPassword, configError, issueToken } from './_lib/auth.js'

// Password-only login; the password lives in ADMIN_PASSWORD on the server.
// A short delay on failure slows down guessing.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (process.env.DISABLE_PASSWORD_LOGIN === '1') {
    return res.status(403).json({ error: 'Password login is turned off. Use your passkey.' })
  }

  const problem = configError()
  if (problem) return res.status(503).json({ error: `Admin is not configured: ${problem}` })

  let body = req.body ?? {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  if (!checkPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 800))
    return res.status(401).json({ error: 'Wrong password' })
  }
  return res.status(200).json({ token: issueToken() })
}
