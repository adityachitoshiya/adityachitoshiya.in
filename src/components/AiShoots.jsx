import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

// AI-made social media creatives and product photo shoots.
export default function AiShoots() {
  const { aiShoots } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.aishoots__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.02, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.aishoots__title', start: 'top 85%' },
      })
      gsap.from('.aishot', {
        y: 70, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: '.aishoots__grid', start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [aiShoots] },
  )

  if (!aiShoots.length) return null
  return (
    <section className="aishoots" id="ai-shoots" ref={root}>
      <div className="aishoots__head">
        <h2 className="aishoots__title">AI for social media and product photo shoot</h2>
        <span className="section-label">({String(aiShoots.length).padStart(2, '0')}) made with AI</span>
      </div>
      <p className="aishoots__disclaimer mono muted">
        Spec work: AI-made concept shoots and posts using well-known products. Not client work, and not affiliated with or endorsed by these brands.
      </p>
      <div className="aishoots__grid">
        {aiShoots.map((s) => (
          <figure className={`aishot${s.slides?.length ? ' aishot--carousel' : ''}`} key={s.img}>
            {s.slides?.length ? (
              <div className="aishot__slides" role="group" aria-label={`${s.title}, ${s.slides.length} slides, swipe`} tabIndex={0}>
                {s.slides.map((u, n) => (
                  <img key={u} className="aishot__slide" src={u} alt={`${s.title}, slide ${n + 1} of ${s.slides.length}`} loading="lazy" />
                ))}
              </div>
            ) : (
              <div className="aishot__frame">
                <img className="aishot__media" src={s.img} alt={s.title} loading="lazy" />
              </div>
            )}
            <figcaption>
              <h3 className="aishot__title">{s.title}</h3>
              <p className="aishot__note mono muted">{s.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
