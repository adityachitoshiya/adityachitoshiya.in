import crypto from 'node:crypto'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { configError, issueToken, requireAdmin } from './_lib/auth.js'
import * as store from './_lib/authstore.js'

// Passkey (Touch ID / Face ID / security key) login for the admin.
//
//   public : status, login-options, login-verify
//   admin  : register-options, register-verify, list, remove
//
// Enrolling a passkey needs an existing admin session, so nobody can add
// their own. The server only ever stores public keys.

const MAX_PASSKEYS = 10
const failDelay = () => new Promise((r) => setTimeout(r, 800))

function rpConfig() {
  const prod = Boolean(process.env.VERCEL)
  const rpID = process.env.WEBAUTHN_RP_ID || (prod ? '' : 'localhost')
  const origins = (process.env.WEBAUTHN_ORIGINS || (prod ? '' : 'http://localhost:5173'))
    .split(',').map((s) => s.trim()).filter(Boolean)
  return rpID && origins.length ? { rpID, origins } : null
}

const passwordLoginDisabled = () => process.env.DISABLE_PASSWORD_LOGIN === '1'

const isId = (v) => typeof v === 'string' && v.length > 0 && v.length <= 1024
const publicView = (p) => ({
  id: p.id, name: p.name, createdAt: p.createdAt, lastUsedAt: p.lastUsedAt ?? null,
  deviceType: p.deviceType, backedUp: Boolean(p.backedUp),
})

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body ?? {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  if (JSON.stringify(body).length > 20_000) return res.status(413).json({ error: 'Request too large' })

  try {
    const { action } = body
    const needsAdmin = ['register-options', 'register-verify', 'list', 'remove'].includes(action)
    if (needsAdmin && !requireAdmin(req, res)) return

    if (action === 'status') {
      const passkeys = await store.listPasskeys()
      return res.status(200).json({ passkeys: passkeys.length > 0, password: !passwordLoginDisabled() })
    }

    const problem = configError()
    if (problem) return res.status(503).json({ error: `Admin is not configured: ${problem}` })
    const rp = rpConfig()
    if (!rp) return res.status(503).json({ error: 'WEBAUTHN_RP_ID and WEBAUTHN_ORIGINS are not configured' })

    switch (action) {
      case 'login-options': {
        const options = await generateAuthenticationOptions({ rpID: rp.rpID, userVerification: 'required', allowCredentials: [] })
        const challengeId = crypto.randomBytes(16).toString('base64url')
        await store.putChallenge(challengeId, options.challenge, 'login')
        return res.status(200).json({ options, challengeId })
      }

      case 'login-verify': {
        const { challengeId, response } = body
        const fail = async () => { await failDelay(); return res.status(401).json({ error: 'Passkey sign-in failed' }) }
        if (!isId(challengeId) || !response || typeof response !== 'object' || !isId(response.id)) return fail()

        const challenge = await store.takeChallenge(challengeId, 'login')
        if (!challenge) return fail()
        const pk = await store.getPasskey(response.id)
        if (!pk) return fail()

        let result
        try {
          result = await verifyAuthenticationResponse({
            response,
            expectedChallenge: challenge,
            expectedOrigin: rp.origins,
            expectedRPID: rp.rpID,
            requireUserVerification: true,
            credential: {
              id: pk.id,
              publicKey: new Uint8Array(Buffer.from(pk.publicKey, 'base64url')),
              counter: pk.counter ?? 0,
              transports: pk.transports,
            },
          })
        } catch {
          return fail()
        }
        if (!result.verified) return fail()

        await store.updatePasskey(pk.id, { counter: result.authenticationInfo.newCounter, lastUsedAt: Date.now() })
        return res.status(200).json({ token: issueToken() })
      }

      case 'register-options': {
        const existing = await store.listPasskeys()
        if (existing.length >= MAX_PASSKEYS) return res.status(409).json({ error: 'Passkey limit reached' })
        const options = await generateRegistrationOptions({
          rpName: 'Portfolio admin',
          rpID: rp.rpID,
          userName: 'admin',
          userDisplayName: 'Admin',
          userID: new TextEncoder().encode('admin'),
          attestationType: 'none',
          excludeCredentials: existing.map((p) => ({ id: p.id, transports: p.transports })),
          authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
        })
        const challengeId = crypto.randomBytes(16).toString('base64url')
        await store.putChallenge(challengeId, options.challenge, 'register')
        return res.status(200).json({ options, challengeId })
      }

      case 'register-verify': {
        const { challengeId, response } = body
        if (!isId(challengeId) || !response || typeof response !== 'object') return res.status(400).json({ error: 'Bad request' })
        const challenge = await store.takeChallenge(challengeId, 'register')
        if (!challenge) return res.status(400).json({ error: 'Registration expired, try again' })

        let result
        try {
          result = await verifyRegistrationResponse({
            response,
            expectedChallenge: challenge,
            expectedOrigin: rp.origins,
            expectedRPID: rp.rpID,
            requireUserVerification: true,
          })
        } catch {
          return res.status(400).json({ error: 'Could not verify this passkey' })
        }
        if (!result.verified) return res.status(400).json({ error: 'Could not verify this passkey' })

        const { credential, credentialDeviceType, credentialBackedUp } = result.registrationInfo
        const name = typeof body.name === 'string' ? body.name.trim().slice(0, 40) : ''
        const doc = {
          id: credential.id,
          publicKey: Buffer.from(credential.publicKey).toString('base64url'),
          counter: credential.counter,
          transports: credential.transports ?? [],
          name: name || 'Passkey',
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
          createdAt: Date.now(),
          lastUsedAt: null,
        }
        await store.addPasskey(doc)
        return res.status(200).json({ ok: true, passkey: publicView(doc) })
      }

      case 'list': {
        const passkeys = await store.listPasskeys()
        return res.status(200).json({ passkeys: passkeys.map(publicView), passwordLogin: !passwordLoginDisabled() })
      }

      case 'remove': {
        if (!isId(body.id)) return res.status(400).json({ error: 'Bad request' })
        const all = await store.listPasskeys()
        if (passwordLoginDisabled() && all.length <= 1) {
          return res.status(409).json({ error: 'Password login is off, so the last passkey cannot be removed' })
        }
        const removed = await store.removePasskey(body.id)
        return res.status(removed ? 200 : 404).json({ ok: removed })
      }

      default:
        return res.status(400).json({ error: 'Unknown action' })
    }
  } catch (err) {
    console.error('passkey api', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
