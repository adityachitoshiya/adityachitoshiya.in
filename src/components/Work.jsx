import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function Work() {
  const { projects } = useContent()
  const root = useRef(null)

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
        // Pin and translate the track sideways; images drift against it.
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
          gsap.fromTo(card.querySelector('img'), { xPercent: 8 }, {
            xPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          })
          gsap.from(card, {
            rotate: 4, y: 60, opacity: 0.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 60%', scrub: true },
          })
        })
      })
      mm.add('(max-width: 760px)', () => {
        gsap.utils.toArray('.card').forEach((card) => {
          gsap.from(card.querySelector('.card__media'), {
            clipPath: 'inset(20% 10% 20% 10%)',
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="work" id="work" ref={root}>
      <div className="work__pin">
        <div className="work__head">
          <h2 className="work__title">Selected Work</h2>
          <span className="section-label">({String(projects.length).padStart(2, '0')}) Projects</span>
        </div>
        <div className="work__track">
          {projects.map((p, i) => (
            <article className="card" key={p.name} data-cursor="View">
              <div className="card__media">
                <img src={p.img} alt={`${p.name} — ${p.type}`} loading="lazy" />
              </div>
              <div className="card__info">
                <span className="card__name">{p.name}</span>
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="mono muted">{p.type} — {p.desc}</div>
            </article>
          ))}
        </div>
        <div className="work__progress"><i /></div>
      </div>
    </section>
  )
}
