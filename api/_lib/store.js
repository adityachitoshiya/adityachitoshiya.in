import fs from 'node:fs/promises'
import path from 'node:path'
import { MongoClient } from 'mongodb'

// Content lives in its own document (site_content/_id "v2") in the existing
// database, so the current adityachitoshiya.in data is never touched.
// Without MONGODB_URI (local dev only) it falls back to a JSON file.

const DOC_ID = 'v2'
const LOCAL_FILE = path.join(process.cwd(), '.data', 'content.json')

let clientPromise

export function getCollection(name) {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect().catch((err) => {
      clientPromise = null // retry on the next request
      throw err
    })
  }
  return clientPromise.then((c) => c.db().collection(name))
}

export const hasMongo = () => Boolean(process.env.MONGODB_URI)

export async function readContent() {
  if (hasMongo()) {
    const doc = await (await getCollection('site_content')).findOne({ _id: DOC_ID })
    return doc?.data ?? null
  }
  if (process.env.VERCEL) throw new Error('MONGODB_URI is not configured')
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'))
  } catch {
    return null
  }
}

export async function writeContent(data) {
  const updatedAt = new Date()
  if (hasMongo()) {
    await (await getCollection('site_content')).updateOne({ _id: DOC_ID }, { $set: { data, updatedAt } }, { upsert: true })
    return updatedAt
  }
  if (process.env.VERCEL) throw new Error('MONGODB_URI is not configured')
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2))
  return updatedAt
}
