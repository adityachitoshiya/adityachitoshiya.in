import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function Services() {
  const { services } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.services__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.services__title', start: 'top 85%' },
      })

      // Each sticky card recedes as the next one slides over it.
      const cards = gsap.utils.toArray('.svc')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card, {
          scale: 0.9,
          filter: 'brightness(0.5)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="services" id="services" ref={root}>
      <div className="services__head">
        <span className="section-label">What I do</span>
        <h2 className="services__title">Services</h2>
      </div>
      {services.map((s, i) => (
        <article className="svc" key={s.title}>
          <span className="svc__num">0{i + 1}</span>
          <p className="svc__body muted">{s.body}</p>
          <h3 className="svc__title">{s.title}</h3>
          <div />
          <div className="svc__tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </article>
      ))}
    </section>
  )
}
