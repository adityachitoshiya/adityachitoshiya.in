import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function CaseStudy() {
  const { caseStudy: cs } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.case__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.02, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.case__title', start: 'top 85%' },
      })

      gsap.from('.case__did li', {
        x: -30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '.case__did', start: 'top 85%' },
      })

      gsap.utils.toArray('.case__shot').forEach((shot) => {
        gsap.from(shot, {
          clipPath: 'inset(15% 8% 15% 8% round 14px)',
          ease: 'none',
          scrollTrigger: { trigger: shot, start: 'top bottom', end: 'top 35%', scrub: true },
        })
        gsap.fromTo(shot.querySelector('img'), { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  const shots = [{ img: cs.hero, cap: 'Suniel Shetty — Regrip campaign shoot' }, ...cs.shots]
  return (
    <section className="case" id="case" ref={root}>
      <div className="case__top">
        <span className="section-label">Featured case study</span>
        <span className="mono muted">{cs.years}</span>
      </div>
      <h2 className="case__title">{cs.title}</h2>
      <div className="case__grid">
        <aside className="case__info">
          <dl className="case__meta">
            <div><dt className="mono muted">Client</dt><dd>{cs.client}</dd></div>
            <div><dt className="mono muted">Role</dt><dd>{cs.role}</dd></div>
          </dl>
          <p className="case__brief">{cs.brief}</p>
          <span className="mono muted">What I did</span>
          <ol className="case__did">
            {cs.did.map((d, n) => (
              <li key={d}><span className="mono accent">{String(n + 1).padStart(2, '0')}</span>{d}</li>
            ))}
          </ol>
        </aside>
        <div className="case__shots">
          {shots.map((s, n) => (
            <figure className={`case__shot${n === 0 ? ' case__shot--hero' : ''}`} key={s.img}>
              <img src={s.img} alt={s.cap} loading="lazy" />
              <figcaption className="mono">{s.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
