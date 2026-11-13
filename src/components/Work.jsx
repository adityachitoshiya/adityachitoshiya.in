import { Fragment, useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

const norm = (s) => (s || '').trim().toLowerCase()

// Filter tabs. A project's `category` text may name several, e.g. "viral, strategy".
const CATEGORIES = [
  { key: 'youtube', label: 'YouTube work', match: 'youtube' },
  { key: 'saas', label: 'SaaS work', match: 'saas' },
  { key: 'product', label: 'Product designing', match: 'product' },
  { key: 'viral', label: 'Viral marketing', match: 'viral' },
  { key: 'strategy', label: 'Strategy planning', match: 'strateg' },
]
const inCategory = (p, key) => {
  const m = CATEGORIES.find((c) => c.key === key)?.match
  return !!m && norm(p.category).includes(m)
}

// "16:9" / "9 / 16" / "1.78" -> [w, h]. Anything unreadable falls back to 4:5.
function parseRatio(r) {
  const m = String(r || '').match(/^\s*([\d.]+)\s*(?:[:/x]\s*([\d.]+))?\s*$/)
  const w = m ? parseFloat(m[1]) : 0
  const h = m ? parseFloat(m[2] || 1) : 0
  return w > 0 && h > 0 && w / h > 0.3 && w / h < 3 ? [w, h] : [4, 5]
}

// Chapters of work: one per company ("done at"), in the order of the
// Experience list, then anything without a company as "Other projects".
function groupByCompany(projects, experience) {
  const groups = new Map()
  projects.forEach((p, i) => {
    const key = norm(p.company)
    if (!groups.has(key)) groups.set(key, { company: (p.company || '').trim(), items: [] })
    groups.get(key).items.push({ ...p, n: 0, key: `${p.name}-${i}` })
  })
  const order = experience.map((e) => norm(e.company))
  const rank = (k) => (k === '' ? Infinity : order.includes(k) ? order.indexOf(k) : order.length)
  let n = 0
  return [...groups.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]))
    .map(([k, g]) => ({
      ...g,
      job: experience.find((e) => norm(e.company) === k),
      items: g.items.map((p) => ({ ...p, n: ++n })),
    }))
}

// Silent looping preview; plays only while on screen to save battery/data.
function Preview({ src, poster, alt }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [src])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={alt} />
}

function ProjectCard({ p }) {
  const Tag = p.link ? 'a' : 'article'
  const linkProps = p.link ? { href: p.link, target: '_blank', rel: 'noreferrer', 'data-cursor': 'Open' } : {}
  const [w, h] = parseRatio(p.ratio)
  return (
    <Tag className="card" style={{ '--r': w / h, '--ar': `${w} / ${h}` }} {...linkProps}>
      <div className="card__media">
        {p.video
          ? <Preview src={p.video} poster={p.img} alt={`${p.name} — ${p.type}`} />
          : <img src={p.img} alt={`${p.name} — ${p.type}`} loading="lazy" />}
        {p.company && <span className="card__badge mono">@ {p.company}</span>}
      </div>
      <div className="card__info">
        <span className="card__name">{p.name}</span>
        <span className="mono muted">{String(p.n).padStart(2, '0')}</span>
      </div>
      <div className="mono muted">{p.type}{p.year ? ` · ${p.year}` : ''} — {p.desc}</div>
      {p.link && <span className="card__open mono">View project ↗</span>}
    </Tag>
  )
}

export default function Work() {
  const { projects: all, experience } = useContent()
  const root = useRef(null)
  const [cat, setCat] = useState('all')
  const projects = cat === 'all' ? all : all.filter((p) => inCategory(p, cat))
  const groups = groupByCompany(projects, experience)
  const companies = groups.filter((g) => g.company).length

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.work__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110,
        stagger: 0.03,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.work__title', start: 'top 85%' },
      })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 761px)', () => {
        // Pin and translate the track sideways.
        const track = root.current.querySelector('.work__track')
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work__pin',
            start: 'top top',
            end: () => '+=' + distance(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.work__progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => '+=' + distance(), scrub: true },
        })
        gsap.utils.toArray('.card').forEach((card) => {
          gsap.from(card, {
            rotate: 4, y: 60, opacity: 0.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 60%', scrub: true },
          })
        })
      })
      mm.add('(max-width: 760px)', () => {
        gsap.utils.toArray('.card__media').forEach((media) => {
          gsap.from(media, {
            clipPath: 'inset(20% 10% 20% 10%)',
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top 95%', end: 'top 45%', scrub: true },
          })
        })
      })
    },
    { scope: root, dependencies: [all, cat], revertOnUpdate: true },
  )

  return (
    <section className="work" id="work" ref={root}>
      <div className="work__pin">
        <div className="work__head">
          <h2 className="work__title">Selected Work</h2>
          <span className="section-label">
            ({String(projects.length).padStart(2, '0')}) projects{companies ? ` · ${companies} ${companies === 1 ? 'company' : 'companies'}` : ''}
          </span>
        </div>
        <div className="work__tabs mono" role="tablist" aria-label="Filter work by category">
          {[{ key: 'all', label: 'All work' }, ...CATEGORIES].map((c) => {
            const count = c.key === 'all' ? all.length : all.filter((p) => inCategory(p, c.key)).length
            if (c.key !== 'all' && !count) return null
            return (
              <button key={c.key} role="tab" aria-selected={cat === c.key} className={cat === c.key ? 'is-active' : ''} onClick={() => setCat(c.key)}>
                {c.label} <sup>{String(count).padStart(2, '0')}</sup>
              </button>
            )
          })}
        </div>
        <div className="work__track">
          {groups.map((g) => (
            <Fragment key={g.company || 'other'}>
              <div className="card card--chapter">
                <span className="mono muted">{g.company ? 'Work done at' : 'Also'}</span>
                <span className="chapter__name">{g.company || 'Other projects'}</span>
                <span className="chapter__meta">
                  {g.job && <><span className="chapter__role">{g.job.role}</span><span className="mono muted">{g.job.year}</span></>}
                  <span className="mono accent">({g.items.length}) {g.items.length === 1 ? 'project' : 'projects'} →</span>
                </span>
              </div>
              {g.items.map((p) => <ProjectCard p={p} key={p.key} />)}
            </Fragment>
          ))}
        </div>
        <div className="work__progress"><i /></div>
      </div>
    </section>
  )
}
