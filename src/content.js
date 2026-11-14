import { createContext, useContext } from 'react'
import * as defaults from './data'

// Site content comes from /api/content (edited in /admin). The bundled
// data.js is the fallback, so the site still renders if the API is slow
// or unreachable.

export const defaultContent = {
  profile: defaults.profile,
  brands: defaults.brands,
  projects: defaults.projects,
  experience: defaults.experience,
  services: defaults.services,
  skills: defaults.skills,
  viral: defaults.viral,
  viralShots: defaults.viralShots,
  snapshot: defaults.snapshot,
  reels: defaults.reels,
  shorts: defaults.shorts,
  aiShoots: defaults.aiShoots,
  aiPrompts: defaults.aiPrompts,
  socials: defaults.socials,
  caseStudy: defaults.caseStudy,
}

export const ContentContext = createContext(defaultContent)

export function fetchContent(timeoutMs = 2500) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  return fetch('/api/content', { signal: ctrl.signal, cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((r) => (r?.data ? { ...defaultContent, ...r.data } : defaultContent))
    .catch(() => defaultContent)
    .finally(() => clearTimeout(timer))
}

export const useContent = () => useContext(ContentContext)
