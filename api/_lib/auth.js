import crypto from 'node:crypto'

// Stateless admin session: base64url(payload).hmac, signed with ADMIN_SECRET.
// No fallback secrets: if the environment isn't configured, auth is refused.

const TTL_SECONDS = 60 * 60 * 12

const b64url = (buf) => Buffer.from(buf).toString('base64url')

function secret() {
  const s = process.env.ADMIN_SECRET
  return s && s.length >= 32 ? s : null
}

function sign(data, key) {
  return crypto.createHmac('sha256', key).update(data).digest('base64url')
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  // Compare fixed-length digests so length differences don't leak timing.
  const ha = crypto.createHash('sha256').update(ab).digest()
  const hb = crypto.createHash('sha256').update(bb).digest()
  return crypto.timingSafeEqual(ha, hb) && ab.length === bb.length
}

export function configError() {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || pw.length < 12) return 'ADMIN_PASSWORD must be set (12+ characters).'
  if (!secret()) return 'ADMIN_SECRET must be set (32+ random characters).'
  return null
}

export function checkPassword(password) {
  if (configError()) return false
  return safeEqual(password ?? '', process.env.ADMIN_PASSWORD)
}

export function issueToken() {
  const payload = b64url(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + TTL_SECONDS }))
  return `${payload}.${sign(payload, secret())}`
}

export function verifyToken(token) {
  const key = secret()
  if (!key || typeof token !== 'string') return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now() / 1000
  } catch {
    return false
  }
}

export function requireAdmin(req, res) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
