import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function About() {
  const { profile, projects } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      // Words light up as the paragraph scrolls through the viewport.
      const split = SplitText.create('.about__text', { type: 'words', wordsClass: 'word' })
      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })

      gsap.fromTo('.about__portrait img', { yPercent: -12 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.about__portrait', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.about__portrait', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.about__portrait', start: 'top 85%' },
      })

      gsap.utils.toArray('.stat b').forEach((el) => {
        const end = Number(el.dataset.value)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => { el.textContent = Math.round(obj.v) + (el.dataset.suffix || '') },
        })
      })
    },
    { scope: root },
  )

  const years = new Date().getFullYear() - 2022
  return (
    <section className="about" ref={root}>
      <span className="section-label">About</span>
      <p className="about__text">{profile.intro}</p>
      <div className="about__bottom">
        <div className="about__portrait">
          <img src="/img/about_me.jpg" alt="" loading="lazy" />
        </div>
        <div className="about__side">
          <p>{profile.mission}</p>
          <div className="stats">
            <div className="stat"><b data-value={years} data-suffix="+">0</b><span className="mono muted">Years</span></div>
            <div className="stat"><b data-value={projects.length} data-suffix="+">0</b><span className="mono muted">Brands</span></div>
            <div className="stat"><b data-value="4">0</b><span className="mono muted">Disciplines</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
