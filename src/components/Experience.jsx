import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function Experience() {
  const { experience } = useContent()
  const root = useRef(null)
  const float = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.exp__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.exp__title', start: 'top 85%' },
      })

      gsap.utils.toArray('.exp__row').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
        tl.to(row, { '--line-s': 1, duration: 1.2, ease: 'expo.inOut' })
          .from(row.children, { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.2)
      })

      // Floating preview that trails the pointer over the list.
      if (!window.matchMedia('(hover: hover) and (min-width: 901px)').matches) return
      const el = float.current
      const imgs = el.querySelectorAll('img')
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
      const rTo = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3' })
      let lastX = 0
      let lastY = 0
      const list = root.current.querySelector('.exp__list')

      const move = (e) => {
        xTo(e.clientX - 150); yTo(e.clientY - 112)
        rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
        lastY = e.clientY
      }
      const enterRow = (i) => {
        imgs.forEach((img, j) => gsap.to(img, { opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.15, duration: 0.5 }))
      }
      const rows = list.querySelectorAll('.exp__row')
      const handlers = [...rows].map((row, i) => {
        const h = () => enterRow(i)
        row.addEventListener('pointerenter', h)
        return h
      })
      const show = () => gsap.to(el, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
      const hide = () => gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power3.out' })
      // Scrolling moves the list away without moving the mouse, and browsers
      // don't fire pointerleave for that, so the preview would stay stuck on
      // screen. Re-check what is under the pointer on every scroll.
      const onScroll = () => {
        if (!list.contains(document.elementFromPoint(lastX, lastY))) hide()
      }
      list.addEventListener('pointermove', move)
      list.addEventListener('pointerenter', show)
      list.addEventListener('pointerleave', hide)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        rows.forEach((row, i) => row.removeEventListener('pointerenter', handlers[i]))
        list.removeEventListener('pointermove', move)
        list.removeEventListener('pointerenter', show)
        list.removeEventListener('pointerleave', hide)
      }
    },
    { scope: root },
  )

  return (
    <section className="exp" id="experience" ref={root}>
      <div className="exp__head">
        <h2 className="exp__title">Experience</h2>
        <span className="section-label">2018 — Now</span>
      </div>
      <div className="exp__list">
        {experience.map((x) => (
          <div className="exp__row" key={x.company}>
            <span className="mono muted">{x.year}</span>
            <span className="exp__company">{x.company}</span>
            <div>
              <p className="exp__role">{x.role} <span className="muted">· {x.place}</span></p>
              <p className="exp__desc">{x.desc}</p>
            </div>
            <span className="exp__arrow" aria-hidden="true">↗</span>
          </div>
        ))}
      </div>
      <div className="exp__float" ref={float} aria-hidden="true">
        {experience.map((x) => <img key={x.company} src={x.img || undefined} alt="" loading="lazy" style={{ opacity: 0 }} />)}
      </div>
    </section>
  )
}
