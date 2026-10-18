import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const count = useRef(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const tl = gsap.timeline({ paused: true })

      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })
        .to('.preloader__bar', { scaleX: 1, duration: 2.2, ease: 'power3.inOut' }, 0)
        .to('.preloader__count, .preloader__top', { yPercent: -40, opacity: 0, duration: 0.6, ease: 'power2.in' })
        .add(() => onDone?.())
        .to(root.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.1,
          ease: 'expo.inOut',
          onComplete: () => setGone(true),
        }, '<-0.1')

      fonts.then(() => tl.play())
    },
    { scope: root },
  )

  if (gone) return null
  return (
    <div className="preloader" ref={root} style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <div className="preloader__top mono">
        <span>Aditya Chitoshiya</span>
        <span className="muted">Portfolio — ©2026</span>
      </div>
      <div className="preloader__count" ref={count}>000</div>
      <div className="preloader__bar" />
    </div>
  )
}
