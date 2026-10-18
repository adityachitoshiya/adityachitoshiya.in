import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
  </svg>
)

// Infinite loop whose speed and direction follow scroll velocity.
export default function Marquee() {
  const { brands } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const loop = gsap.to('.marquee__track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
      let dir = 1
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity()
          if (Math.abs(v) > 10) dir = v > 0 ? 1 : -1
          const boost = gsap.utils.clamp(1, 6, Math.abs(v) / 300)
          gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true })
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' })
        },
      })

      // Hovering pauses the loop so names can be read.
      const el = root.current
      const pause = () => loop.pause()
      const play = () => loop.play()
      el.addEventListener('pointerenter', pause)
      el.addEventListener('pointerleave', play)
      return () => {
        el.removeEventListener('pointerenter', pause)
        el.removeEventListener('pointerleave', play)
      }
    },
    { scope: root },
  )

  const items = [...brands, ...brands]
  return (
    <section className="marquee" ref={root} aria-label="Brands I've worked with">
      <div className="marquee__track">
        {items.map((b, i) => (
          <span className="marquee__item" key={i} aria-hidden={i >= brands.length}>
            {b} <Star />
          </span>
        ))}
      </div>
    </section>
  )
}
