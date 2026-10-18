import fs from 'node:fs/promises'
import path from 'node:path'
import { getCollection, hasMongo } from './store.js'

// Passkeys (public keys only) and one-time login/registration challenges.
// Collection `site_auth`; local dev falls back to .data/auth.json.

const COLLECTION = 'site_auth'
const LOCAL_FILE = path.join(process.cwd(), '.data', 'auth.json')
const CHALLENGE_TTL_MS = 5 * 60 * 1000

async function readLocal() {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'))
  } catch {
    return { passkeys: [], challenges: {} }
  }
}

async function writeLocal(data) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2))
}

function assertConfigured() {
  if (!hasMongo() && process.env.VERCEL) throw new Error('MONGODB_URI is not configured')
}

export async function listPasskeys() {
  assertConfigured()
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    return col.find({ type: 'passkey' }).sort({ createdAt: 1 }).project({ _id: 0, type: 0 }).toArray()
  }
  return (await readLocal()).passkeys
}

export async function getPasskey(id) {
  const all = await listPasskeys()
  return all.find((p) => p.id === id) ?? null
}

export async function addPasskey(doc) {
  assertConfigured()
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    await col.insertOne({ _id: `pk:${doc.id}`, type: 'passkey', ...doc })
    return
  }
  const data = await readLocal()
  data.passkeys = [...data.passkeys.filter((p) => p.id !== doc.id), doc]
  await writeLocal(data)
}

export async function updatePasskey(id, patch) {
  assertConfigured()
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    await col.updateOne({ _id: `pk:${id}` }, { $set: patch })
    return
  }
  const data = await readLocal()
  data.passkeys = data.passkeys.map((p) => (p.id === id ? { ...p, ...patch } : p))
  await writeLocal(data)
}

export async function removePasskey(id) {
  assertConfigured()
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    const res = await col.deleteOne({ _id: `pk:${id}` })
    return res.deletedCount > 0
  }
  const data = await readLocal()
  const before = data.passkeys.length
  data.passkeys = data.passkeys.filter((p) => p.id !== id)
  await writeLocal(data)
  return data.passkeys.length < before
}

export async function putChallenge(cid, challenge, purpose) {
  assertConfigured()
  const doc = { challenge, purpose, createdAt: Date.now() }
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    await col.deleteMany({ type: 'challenge', createdAt: { $lt: Date.now() - CHALLENGE_TTL_MS } })
    await col.insertOne({ _id: `ch:${cid}`, type: 'challenge', ...doc })
    return
  }
  const data = await readLocal()
  const fresh = Object.fromEntries(Object.entries(data.challenges).filter(([, c]) => c.createdAt > Date.now() - CHALLENGE_TTL_MS))
  data.challenges = { ...fresh, [cid]: doc }
  await writeLocal(data)
}

// Single use: the challenge is deleted as it is read, so a captured
// response can never be replayed.
export async function takeChallenge(cid, purpose) {
  assertConfigured()
  let doc
  if (hasMongo()) {
    const col = await getCollection(COLLECTION)
    doc = await col.findOneAndDelete({ _id: `ch:${cid}`, type: 'challenge' })
  } else {
    const data = await readLocal()
    doc = data.challenges[cid]
    delete data.challenges[cid]
    await writeLocal(data)
  }
  if (!doc || doc.purpose !== purpose || Date.now() - doc.createdAt > CHALLENGE_TTL_MS) return null
  return doc.challenge
}
