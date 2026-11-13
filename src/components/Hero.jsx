import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'
import { waLink } from '../lib/whatsapp'

function scrollToId(e, id) {
  e.preventDefault()
  if (window.__lenis) window.__lenis.scrollTo(id, { duration: 1.6 })
  else document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero({ loaded }) {
  const { profile, snapshot } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const lines = gsap.utils.toArray('.hero__line > span', root.current)
      const after = gsap.utils.toArray('.hero__label, .hero__proof, .hero__ctas, .hero__badge', root.current)

      if (!loaded) {
        gsap.set('.hero__photo', { clipPath: 'inset(100% 0% 0% 0% round 14px)' })
        gsap.set(lines, { yPercent: 110 })
        gsap.set(after, { opacity: 0, y: 16 })
        return
      }

      // Media first, then headline lines, then supporting copy, CTA last.
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero__photo', { clipPath: 'inset(100% 0% 0% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.2, ease: 'expo.inOut' })
        .from('.hero__photo img', { yPercent: 12, opacity: 0, duration: 1.4 }, 0.2)
        .from(lines, { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.35)
        .from(after, { opacity: 0, y: 16, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.9)

      // Gentle parallax as the hero leaves; no pinning.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } })
        .to('.hero__photo img', { yPercent: 8, ease: 'none' }, 0)
        .to('.hero__copy', { yPercent: -10, ease: 'none' }, 0)
    },
    { scope: root, dependencies: [loaded], revertOnUpdate: true },
  )

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__copy">
        <p className="hero__label mono">
          {profile.first} {profile.last}<span className="muted"> / Video editor &amp; motion designer</span>
        </p>
        <h1 className="hero__title" aria-label="I turn ideas into reels, explainers and 3D product ads people remember.">
          <span className="hero__line hero__line--sans" aria-hidden="true"><span>I turn ideas into</span></span>
          <span className="hero__line" aria-hidden="true"><span>Reels, explainers</span></span>
          <span className="hero__line" aria-hidden="true"><span><em className="accent">&amp;</em> 3D product ads</span></span>
          <span className="hero__line hero__line--sans" aria-hidden="true"><span>people remember.</span></span>
        </h1>
        <div className="hero__proof">
          <span className="mono muted">Worked with</span>
          <ul>
            {snapshot.names.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
        <div className="hero__ctas">
          <a className="btn btn--solid" href="#work" onClick={(e) => scrollToId(e, '#work')}>View my work ↘</a>
          <a className="btn" href={waLink(profile.phone, `Hi ${profile.first}, I saw your portfolio and want to talk about a project.`)} target="_blank" rel="noreferrer">WhatsApp me ↗</a>
        </div>
      </div>

      <figure className="hero__photo">
        <img src={profile.heroImage} alt="Portrait of Aditya Chitoshiya" fetchPriority="high" width="900" height="1200" />
        <figcaption className="hero__badge mono">
          <i />Open for freelance projects
        </figcaption>
      </figure>
    </section>
  )
}
