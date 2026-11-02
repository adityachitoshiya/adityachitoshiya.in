// Whitelist of editable content. Anything not described here is dropped,
// strings are length-capped, and URL fields only accept https:// or /paths.

const S = 'string'
const URL = 'url'
const list = (item, max = 60) => ({ list: item, max })

const person = { name: S, note: S, img: URL }

export const shape = {
  profile: {
    first: S, last: S, email: S, phone: S, social: S, location: S,
    behance: URL, github: URL, tagline: S, disciplines: S, heroImage: URL,
    intro: S, mission: S,
  },
  brands: list(S),
  projects: list({ name: S, type: S, desc: S, company: S, year: S, link: URL, img: URL, video: URL }),
  experience: list({ year: S, company: S, place: S, role: S, desc: S, img: URL }),
  services: list({ title: S, body: S, tags: list(S, 12) }, 12),
  skills: list({ title: S, items: list(S, 40) }, 12),
  viral: list({ title: S, link: URL, views: S, company: S, thumb: URL }, 30),
  viralShots: list({ img: URL, caption: S, link: URL }, 30),
  snapshot: {
    role: S, years: S,
    companies: list(S, 12), names: list(S, 12), tools: list(S, 20),
    people: list(person, 6),
  },
  reels: list({ title: S, src: URL }, 20),
  caseStudy: {
    client: S, title: S, role: S, years: S, brief: S,
    did: list(S, 12), hero: URL, shots: list({ img: URL, cap: S }, 12),
  },
}

const MAX_STRING = 2000

function cleanString(v) {
  return typeof v === 'string' ? v.slice(0, MAX_STRING).trim() : ''
}

function cleanUrl(v) {
  const s = cleanString(v)
  if (s === '') return ''
  if (s.startsWith('/') && !s.startsWith('//')) return s
  try {
    return new globalThis.URL(s).protocol === 'https:' ? s : ''
  } catch {
    return ''
  }
}

function clean(spec, value) {
  if (spec === S) return cleanString(value)
  if (spec === URL) return cleanUrl(value)
  if (spec.list) {
    return Array.isArray(value) ? value.slice(0, spec.max).map((v) => clean(spec.list, v)) : []
  }
  const src = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return Object.fromEntries(Object.entries(spec).map(([k, s]) => [k, clean(s, src[k])]))
}

export function sanitize(input) {
  return clean(shape, input)
}
