import { useRef } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

const igLink = (handle) => `https://www.instagram.com/${String(handle || '').replace(/^@/, '')}/`

// Brand accounts Aditya runs: one card per account, linking to the profile.
export default function Socials() {
  const { socials } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.socials__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.socials__title', start: 'top 85%' },
      })
      gsap.from('.acct', {
        y: 60, opacity: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out',
        scrollTrigger: { trigger: '.socials__grid', start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [socials] },
  )

  if (!socials.length) return null
  return (
    <section className="socials" id="social" ref={root}>
      <div className="socials__head">
        <h2 className="socials__title">Social media</h2>
        <p className="socials__lead">
          Brand accounts I run: content, reels, Meta ads, influencer collaborations and replying to the people who show up.
        </p>
      </div>
      <div className="socials__grid">
        {socials.map((a) => (
          <a className="acct" key={a.handle} href={a.link || igLink(a.handle)} target="_blank" rel="noreferrer" data-cursor="Open">
            <span className="acct__top mono">
              <span>Instagram</span>
              <span className="accent">↗</span>
            </span>
            <span className="acct__handle">@{a.handle.replace(/^@/, '')}</span>
            <span className="acct__name">{a.name}<span className="muted"> · {a.category}</span></span>
            {a.followers && (
              <span className="acct__count">
                <b>{a.followers}</b>
                <span className="mono muted">followers</span>
              </span>
            )}
            {a.work && <span className="acct__work mono">{a.work}</span>}
          </a>
        ))}
      </div>
    </section>
  )
}
