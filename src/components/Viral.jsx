import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

// --- helpers -------------------------------------------------------------
function youtubeId(link) {
  try {
    const u = new URL(link)
    if (u.hostname.endsWith('youtu.be')) return u.pathname.slice(1) || null
    if (u.hostname.includes('youtube.com')) {
      const [, kind, id] = u.pathname.split('/')
      if (kind === 'shorts' || kind === 'embed' || kind === 'live') return id || null
      return u.searchParams.get('v')
    }
  } catch { /* not a URL */ }
  return null
}

function platformOf(link) {
  try {
    const h = new URL(link).hostname
    if (h.includes('youtu')) return 'YouTube'
    if (h.includes('instagram')) return 'Instagram'
    if (h.includes('linkedin')) return 'LinkedIn'
    if (h.includes('facebook') || h.includes('fb.watch')) return 'Facebook'
    if (h === 'x.com' || h.includes('twitter')) return 'X'
    if (h.includes('tiktok')) return 'TikTok'
  } catch { /* not a URL */ }
  return 'Link'
}

const isVertical = (link) => /\/shorts\/|instagram\.com\/(reel|reels|p)\/|tiktok\.com/.test(link || '')

// "1.2M", "850K", "1,200,000" -> number
function parseViews(s) {
  const m = String(s || '').replace(/,/g, '').trim().match(/^([\d.]+)\s*([kmb])?/i)
  if (!m) return 0
  return parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1)
}

function formatViews(n) {
  const short = (v, unit) => `${(Math.floor(v * 10) / 10).toString().replace(/\.0$/, '')}${unit}`
  if (n >= 1e9) return short(n / 1e9, 'B')
  if (n >= 1e6) return short(n / 1e6, 'M')
  if (n >= 1e3) return `${Math.floor(n / 1e3)}K`
  return String(Math.round(n))
}

// --- pop-up (video player or full-size screenshot) ---------------------
function Modal({ label, onClose, children }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    window.__lenis?.stop()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.__lenis?.start()
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <div className="vplayer" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
      <button ref={closeRef} className="vplayer__close mono" onClick={onClose}>Close ✕</button>
    </div>
  )
}

function OpenItem({ item }) {
  if (item.type === 'video') {
    return (
      <div className="vplayer__box">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
          title={item.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <figure className="vplayer__shot">
      <img src={item.img} alt={item.caption || 'Screenshot'} />
      {(item.caption || item.link) && (
        <figcaption className="mono">
          {item.caption}
          {item.link && <> · <a href={item.link} target="_blank" rel="noreferrer">Open ↗</a></>}
        </figcaption>
      )}
    </figure>
  )
}

// --- section ---------------------------------------------------------------
export default function Viral() {
  const { viral = [], viralShots = [] } = useContent()
  const items = viral.filter((v) => v.link)
  const shots = viralShots.filter((s) => s.img)
  const root = useRef(null)
  const [open, setOpen] = useState(null)
  const total = items.reduce((n, v) => n + parseViews(v.views), 0)
  const platforms = [...new Set(items.map((v) => platformOf(v.link)))]

  useGSAP(
    () => {
      if (reducedMotion || (!items.length && !shots.length)) return
      const split = SplitText.create('.viral__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.02, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.viral__title', start: 'top 85%' },
      })
      const out = root.current.querySelector('.viral__total b')
      if (out && total) {
        const n = { v: 0 }
        gsap.to(n, {
          v: total, duration: 2.2, ease: 'power3.out',
          scrollTrigger: { trigger: out, start: 'top 90%' },
          onUpdate: () => { out.textContent = `${formatViews(n.v)}+` },
        })
      }
      if (items.length) {
        gsap.from('.vcard', {
          y: 60, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: '.viral__grid', start: 'top 85%' },
        })
      }
      if (shots.length) {
        gsap.from('.vshot', {
          y: 50, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out',
          scrollTrigger: { trigger: '.viral__shots', start: 'top 90%' },
        })
      }
    },
    { scope: root, dependencies: [viral, viralShots], revertOnUpdate: true },
  )

  if (!items.length && !shots.length) return null
  return (
    <section className="viral" id="viral" ref={root}>
      <div className="viral__head">
        <span className="section-label">Went viral</span>
        <h2 className="viral__title">Work that went viral</h2>
        {total > 0 && (
          <p className="viral__total">
            <b>{formatViews(total)}+</b>
            <span className="mono muted">total views · {items.length} {items.length === 1 ? 'piece' : 'pieces'} · {platforms.join(', ')}</span>
          </p>
        )}
      </div>

      {items.length > 0 && <div className="viral__grid">
        {items.map((v, i) => {
          const id = youtubeId(v.link)
          const platform = platformOf(v.link)
          const thumb = v.thumb || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '')
          const inner = (
            <>
              {thumb ? <img src={thumb} alt="" loading="lazy" /> : <span className="vcard__noimg mono">{platform}</span>}
              {v.views && <span className="vcard__views">{v.views}<small> views</small></span>}
              <span className="vcard__platform mono">{platform}</span>
              <span className="vcard__play" aria-hidden="true">{id ? '▶' : '↗'}</span>
            </>
          )
          return (
            <article className={`vcard${isVertical(v.link) ? ' vcard--tall' : ''}`} key={`${v.link}-${i}`}>
              {id ? (
                <button className="vcard__media" onClick={() => setOpen({ type: 'video', id, title: v.title })} data-cursor="Play" aria-label={`Play ${v.title}`}>
                  {inner}
                </button>
              ) : (
                <a className="vcard__media" href={v.link} target="_blank" rel="noreferrer" data-cursor="Open" aria-label={`Open ${v.title} on ${platform}`}>
                  {inner}
                </a>
              )}
              <div className="vcard__info">
                <span className="vcard__title">{v.title}</span>
                {v.company && <span className="mono muted">@ {v.company}</span>}
              </div>
            </article>
          )
        })}
      </div>}

      {shots.length > 0 && (
        <div className="viral__proof">
          <span className="section-label">Proof, straight from the apps</span>
          <div className="viral__shots">
            {shots.map((sh, i) => (
              <figure className="vshot" key={`${sh.img}-${i}`}>
                <button className="vshot__img" onClick={() => setOpen({ type: 'shot', ...sh })} data-cursor="View" aria-label={`View screenshot: ${sh.caption || 'proof'}`}>
                  <img src={sh.img} alt={sh.caption || 'Screenshot'} loading="lazy" />
                </button>
                {sh.caption && <figcaption className="mono">{sh.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      )}

      {open && (
        <Modal label={open.title || open.caption || 'Preview'} onClose={() => setOpen(null)}>
          <OpenItem item={open} />
        </Modal>
      )}
    </section>
  )
}
