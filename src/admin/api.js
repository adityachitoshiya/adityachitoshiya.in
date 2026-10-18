import { browserSupportsWebAuthn, startAuthentication, startRegistration } from '@simplewebauthn/browser'

const TOKEN_KEY = 'adminToken'

export const getToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (t) => {
  try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY) } catch { /* private mode */ }
}

export class AuthError extends Error {}

// `auth: false` is for sign-in calls, where a 401 means "wrong credentials",
// not "your session expired".
async function call(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
  const json = await res.json().catch(() => ({}))
  if (res.status === 401 && auth) throw new AuthError('Session expired')
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
  return json
}

export async function login(password) {
  const { token } = await call('/api/login', { method: 'POST', body: { password }, auth: false })
  setToken(token)
}

// ---- Passkeys (Touch ID / Face ID / security key) ----
const pk = (body, auth = true) => call('/api/passkey', { method: 'POST', body, auth })

export const passkeysSupported = () => browserSupportsWebAuthn()
export const authStatus = () => pk({ action: 'status' }, false)

export async function loginWithPasskey() {
  const { options, challengeId } = await pk({ action: 'login-options' }, false)
  const response = await startAuthentication({ optionsJSON: options })
  const { token } = await pk({ action: 'login-verify', challengeId, response }, false)
  setToken(token)
}

export async function addPasskey(name) {
  const { options, challengeId } = await pk({ action: 'register-options' })
  const response = await startRegistration({ optionsJSON: options })
  return pk({ action: 'register-verify', challengeId, response, name })
}

export const listPasskeys = () => pk({ action: 'list' })
export const removePasskey = (id) => pk({ action: 'remove', id })

export function friendlyAuthError(err) {
  if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') return 'Cancelled, or timed out. Try again.'
  if (err?.name === 'InvalidStateError') return 'This device already has a passkey registered.'
  return err?.message || 'Something went wrong'
}

export const loadContent = () => call('/api/content').then((r) => r.data)
export const saveContent = (data) => call('/api/content', { method: 'PUT', body: { data } })

// Direct browser → Cloudinary upload using a server-issued signature.
// Returns a delivery URL with sensible transforms (mp4 for video).
export async function upload(file, kind) {
  const sig = await call('/api/upload-signature', { method: 'POST' })
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', sig.timestamp)
  form.append('folder', sig.folder)
  form.append('signature', sig.signature)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message || 'Upload failed')
  const base = json.secure_url
  if (kind === 'video') return base.replace('/upload/', '/upload/q_auto,w_1280/').replace(/\.[a-z0-9]+$/i, '.mp4')
  return base.replace('/upload/', '/upload/f_auto,q_auto,w_1600/')
}
