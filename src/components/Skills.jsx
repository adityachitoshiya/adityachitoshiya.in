import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function Skills() {
  const { skills } = useContent()
  const root = useRef(null)
  const total = skills.reduce((n, g) => n + g.items.length, 0)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.skills__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.skills__title', start: 'top 85%' },
      })

      // Each group draws its rule, then its skills settle in one by one.
      gsap.utils.toArray('.skills__row').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } })
        tl.to(row, { '--line-s': 1, duration: 1.2, ease: 'expo.inOut' })
          .from(row.querySelectorAll('.skills__num, .skills__group'), { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.2)
          .from(row.querySelectorAll('.skills__chips li'), { y: 14, opacity: 0, duration: 0.7, stagger: 0.035, ease: 'power3.out' }, 0.35)
      })
    },
    { scope: root, dependencies: [skills] },
  )

  if (!skills.length) return null
  return (
    <section className="skills" id="skills" ref={root}>
      <div className="skills__head">
        <h2 className="skills__title">Skills</h2>
        <span className="section-label">({total}) across {skills.length} areas</span>
      </div>
      <div className="skills__list">
        {skills.map((g, i) => (
          <article className="skills__row" key={g.title}>
            <span className="skills__num mono muted">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="skills__group">{g.title}</h3>
            <ul className="skills__chips">
              {g.items.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
