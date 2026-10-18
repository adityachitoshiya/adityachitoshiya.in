import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

// Floating CTA: shows once the hero is passed, hides again at the contact section.
export default function HireMe() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.set(root.current, { yPercent: 160 })
    const show = (on) => gsap.to(root.current, { yPercent: on ? 0 : 160, duration: 0.7, ease: 'expo.out', overwrite: true })
    ScrollTrigger.create({
      trigger: '.snap',
      start: 'top 60%',
      endTrigger: '#contact',
      end: 'top 80%',
      // Measure after the pinned sections so their spacing is included.
      refreshPriority: -1,
      onToggle: (self) => show(self.isActive),
    })
  })

  const toContact = (e) => {
    e.preventDefault()
    if (window.__lenis) window.__lenis.scrollTo('#contact', { duration: 1.8 })
    else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="hire" ref={root}>
      <a className="hire__cv mono" href="/Aditya_Chitoshiya_CV.pdf" target="_blank" rel="noreferrer">CV ↓</a>
      <a className="hire__main mono" href="#contact" onClick={toContact}>
        <i />Hire me
      </a>
    </div>
  )
}
