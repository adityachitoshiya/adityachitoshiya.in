import { useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'
import { waLink } from '../lib/whatsapp'

// Client TL;DR: everything worth knowing, readable in ten seconds.
export default function Snapshot() {
  const { profile, snapshot } = useContent()
  const root = useRef(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.snap__title', { type: 'lines', mask: 'lines', linesClass: 'ln' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      tl.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out' })
        .from('.snap__card', { y: 80, rotate: 2, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, 0.2)
        .from('.snap__person img', { scale: 1.3, duration: 1.6, ease: 'expo.out' }, 0.4)

      // Ten-second countdown that runs once the section is on screen.
      const n = { v: 10 }
      const out = root.current.querySelector('.snap__count b')
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 50%' } })
        .to(n, { v: 0, duration: 10, ease: 'none', onUpdate: () => { out.textContent = Math.ceil(n.v) } })
        .to('.snap__count i', { scaleX: 1, duration: 10, ease: 'none' }, 0)
    },
    { scope: root },
  )

  return (
    <section className="snap" ref={root} aria-label="Quick overview">
      <div className="snap__head">
        <h2 className="snap__title">Short on time?<br /><span className="muted">Here’s me in ten seconds.</span></h2>
        <div className="snap__count mono"><b>10</b>s<i /></div>
      </div>

      <div className="snap__grid">
        <article className="snap__card snap__card--main">
          <span className="nav__status mono"><i />Available for work</span>
          <p className="snap__role">{snapshot.role}</p>
          <div className="snap__actions">
            <a className="btn btn--solid" href={waLink(profile.phone, `Hi ${profile.first}, I saw your portfolio and want to talk about a project.`)} target="_blank" rel="noreferrer">WhatsApp me ↗</a>
            <a className="btn" href="/Aditya_Chitoshiya_CV.pdf" target="_blank" rel="noreferrer">Download CV ↓</a>
            <button className="btn" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy'}>
              {copied ? 'Email copied ✓' : 'Copy email'}
            </button>
          </div>
        </article>

        <article className="snap__card">
          <span className="mono muted">Experience</span>
          <b className="snap__big">{snapshot.years}</b>
          <ul className="snap__list">{snapshot.companies.map((c) => <li key={c}>{c}</li>)}</ul>
        </article>

        <article className="snap__card">
          <span className="mono muted">Worked with</span>
          <ul className="snap__names">{snapshot.names.map((c) => <li key={c}>{c}</li>)}</ul>
        </article>

        <article className="snap__card">
          <span className="mono muted">Toolkit</span>
          <div className="snap__chips">{snapshot.tools.map((t) => <span key={t}>{t}</span>)}</div>
        </article>

        {snapshot.people.map((p) => (
          <figure className="snap__card snap__person" key={p.name}>
            <img src={p.img} alt={`Aditya with ${p.name}`} loading="lazy" />
            <figcaption>
              <b>{p.name}</b>
              <span className="mono">{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
