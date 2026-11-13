import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useContent } from '../content'
import { waLink } from '../lib/whatsapp'

// Floating CTA (CV + WhatsApp): shows once the hero is passed, hides again
// at the contact section.
export default function HireMe() {
  const { profile } = useContent()
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

  return (
    <div className="hire" ref={root}>
      <a className="hire__cv mono" href="/Aditya_Chitoshiya_CV.pdf" target="_blank" rel="noreferrer">CV ↓</a>
      <a
        className="hire__main mono"
        href={waLink(profile.phone, `Hi ${profile.first}, I saw your portfolio and want to talk about a project.`)}
        target="_blank"
        rel="noreferrer"
      >
        <i />WhatsApp me
      </a>
    </div>
  )
}
