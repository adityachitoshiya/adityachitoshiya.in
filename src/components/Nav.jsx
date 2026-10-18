import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const links = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Services', '#services'],
  ['Contact', '#contact'],
]

function go(e, href) {
  e.preventDefault()
  const lenis = window.__lenis
  if (lenis) lenis.scrollTo(href, { duration: 1.6 })
  else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Nav() {
  const root = useRef(null)

  useGSAP(() => {
    // Hide on scroll down, reveal on scroll up.
    const show = gsap.quickTo(root.current, 'yPercent', { duration: 0.5, ease: 'power3' })
    ScrollTrigger.create({
      start: 'top -120',
      end: 'max',
      onUpdate: (self) => show(self.direction === 1 && self.scroll() > 120 ? -110 : 0),
      onLeaveBack: () => show(0),
    })
  })

  return (
    <header className="nav" ref={root}>
      <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')}>AC®</a>
      <nav className="nav__links mono">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={(e) => go(e, href)}>
            <span>{label}</span>
            <span aria-hidden="true">{label}</span>
          </a>
        ))}
      </nav>
      <span className="nav__status mono"><i />Available for work</span>
    </header>
  )
}
