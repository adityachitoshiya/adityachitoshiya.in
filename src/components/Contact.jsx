import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'
import { waLink } from '../lib/whatsapp'

function toTop(e) {
  e.preventDefault()
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Contact() {
  const { profile } = useContent()
  const root = useRef(null)
  const mag = useRef(null)
  const whatsapp = waLink(profile.phone, `Hi ${profile.first}, I saw your portfolio and want to talk about a project.`)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.contact__big', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 120,
        rotate: 8,
        stagger: 0.025,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.contact__big', start: 'top 80%' },
      })
      gsap.from('.contact__row > *, .footer > *', {
        y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact__row', start: 'top 92%' },
      })

      // Magnetic button: pulls toward the pointer, text pulls further.
      if (!window.matchMedia('(hover: hover)').matches) return
      const btn = mag.current
      const label = btn.querySelector('span')
      const bx = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' })
      const by = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' })
      const lx = gsap.quickTo(label, 'x', { duration: 0.45, ease: 'power3.out' })
      const ly = gsap.quickTo(label, 'y', { duration: 0.45, ease: 'power3.out' })
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        bx(dx * 0.22); by(dy * 0.22); lx(dx * 0.12); ly(dy * 0.12)
      }
      const leave = () => { bx(0); by(0); lx(0); ly(0) }
      btn.addEventListener('pointermove', move)
      btn.addEventListener('pointerleave', leave)
      return () => {
        btn.removeEventListener('pointermove', move)
        btn.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root },
  )

  return (
    <section className="contact" id="contact" ref={root}>
      <span className="section-label">Get in touch — open for reels, launch videos, 3D product ads &amp; motion</span>
      <h2 className="contact__big">Let’s<br /><span className="accent">Talk</span></h2>
      <div className="contact__row">
        <div>
          <a className="contact__email" href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="mono muted" style={{ marginTop: 16 }}>
            <a className="contact__wa" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp {profile.phone} ↗</a> · {profile.location}
          </p>
        </div>
        <a className="magnetic" ref={mag} href={whatsapp} target="_blank" rel="noreferrer">
          <span>Start a<br />project ↗</span>
        </a>
      </div>
      <footer className="footer mono">
        <span>©2026 {profile.first} {profile.last}</span>
        <span>
          <a href={profile.behance} target="_blank" rel="noreferrer">Behance ↗</a>
          <span className="muted"> · </span>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </span>
        <a href="/Aditya_Chitoshiya_CV.pdf" target="_blank" rel="noreferrer">Download CV ↗</a>
        <a href="#top" onClick={toTop}>Back to top ↑</a>
      </footer>
    </section>
  )
}
