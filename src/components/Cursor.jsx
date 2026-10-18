import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'

// Dot follows the pointer; a filled ring grows over [data-cursor] targets
// and shows that attribute's text as a label.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useGSAP(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.15, ease: 'power3' })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.15, ease: 'power3' })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      xDot(e.clientX); yDot(e.clientY)
      xRing(e.clientX); yRing(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) {
        label.current.textContent = t.dataset.cursor
        gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' })
        gsap.to(dot.current, { opacity: 0, duration: 0.2 })
      } else {
        gsap.to(ring.current, { scale: 0.5, opacity: 0, duration: 0.3, ease: 'power3.out' })
        gsap.to(dot.current, { opacity: 1, scale: e.target.closest('a, button') ? 2.5 : 1, duration: 0.25 })
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  })

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}><span ref={label} /></div>
      <div className="cursor__dot" ref={dot} />
    </div>
  )
}
