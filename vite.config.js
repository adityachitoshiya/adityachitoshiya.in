import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { experience, profile, projects, skills, snapshot, viral } from './src/data.js'

// The site renders client-side, so the raw HTML would be an empty <div>.
// Write the key content into <noscript> from src/data.js so crawlers and
// no-JS visitors get real text (JSON-LD and meta tags are already in the HTML).
function seoFallback() {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const li = (items) => items.map((t) => `<li>${t}</li>`).join('')
  return {
    name: 'seo-fallback',
    transformIndexHtml(html) {
      const body = `<noscript>
      <main>
        <h1>${esc(profile.first)} ${esc(profile.last)} — Creative &amp; Digital Marketing Specialist</h1>
        <p>${esc(profile.intro)}</p>
        <h2>Worked with</h2>
        <ul>${li(snapshot.names.map(esc))}</ul>
        <h2>Selected work</h2>
        <ul>${li(projects.map((p) => `${esc(p.name)} — ${esc(p.type)}${p.company ? ` (done at ${esc(p.company)})` : ''}: ${esc(p.desc)}`))}</ul>
        <h2>Experience</h2>
        <ul>${li(experience.map((e) => `${esc(e.company)} — ${esc(e.role)} (${esc(e.year)}): ${esc(e.desc)}`))}</ul>
        ${viral.length ? `<h2>Went viral</h2><ul>${li(viral.map((v) => `<a href="${esc(v.link)}">${esc(v.title)}</a> — ${esc(v.views)} views${v.company ? ` (${esc(v.company)})` : ''}`))}</ul>` : ''}
        <h2>Skills</h2>
        ${skills.map((g) => `<h3>${esc(g.title)}</h3><ul>${li(g.items.map(esc))}</ul>`).join('')}
        <h2>Contact</h2>
        <p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> · ${esc(profile.location)}</p>
        <p><a href="${esc(profile.behance)}">Behance</a> · <a href="${esc(profile.github)}">GitHub</a> · <a href="/Aditya_Chitoshiya_CV.pdf">CV (PDF)</a></p>
      </main>
    </noscript>`
      return html.replace('<!-- SEO_FALLBACK -->', body)
    },
  }
}

// Runs the Vercel-style handlers in /api during `vite dev`, so the admin
// works locally without the Vercel CLI. Production uses Vercel functions.
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url.match(/^\/api\/([a-z-]+)(?:\?.*)?$/)
        if (!match) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`)
          let raw = ''
          for await (const chunk of req) raw += chunk
          req.body = raw ? (() => { try { return JSON.parse(raw) } catch { return raw } })() : undefined
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)) }
          await mod.default(req, res)
        } catch (err) {
          if (err?.code === 'ERR_LOAD_URL') return next()
          console.error(err)
          res.statusCode = 500
          res.end('dev api error')
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Expose server-side secrets from .env.local to the dev API only.
  // Real environment variables win over .env.local.
  for (const [k, v] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
    if (!(k in process.env)) process.env[k] = v
  }
  return { plugins: [react(), devApi(), seoFallback()] }
})
