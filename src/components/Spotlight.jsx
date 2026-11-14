import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/gsap'

// An always-on spotlight: a warm pool of light that follows the pointer
// (smoothed) while the rest of the page sits slightly dimmer. Desktop mouse
// only; skipped for touch and reduced motion.
export default function Spotlight() {
  const el = useRef(null)

  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const node = el.current
    let tx = window.innerWidth * 0.5
    let ty = window.innerHeight * 0.4
    let x = tx
    let y = ty
    let raf = 0
    const paint = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      node.style.setProperty('--sx', `${x.toFixed(1)}px`)
      node.style.setProperty('--sy', `${y.toFixed(1)}px`)
      raf = requestAnimationFrame(paint)
    }
    const move = (e) => { tx = e.clientX; ty = e.clientY }
    const leave = () => { node.classList.remove('is-on') }
    const enter = () => { node.classList.add('is-on') }
    node.classList.add('is-on')
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)
    raf = requestAnimationFrame(paint)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [])

  return <div className="spotlight" ref={el} aria-hidden="true" />
}
