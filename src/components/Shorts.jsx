import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

// One vertical reel. Loops silently while on screen; a click restarts it
// with sound. Only one reel has sound at a time (`active`).
function Short({ s, active, onToggle }) {
  const ref = useRef(null)
  const inView = useRef(false)

  useEffect(() => {
    const v = ref.current
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting
      if (e.isIntersecting && (active || !reducedMotion)) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.4 })
    io.observe(v)
    return () => io.disconnect()
  }, [active])

  // React doesn't reliably sync the muted property; set it directly.
  useEffect(() => {
    const v = ref.current
    v.muted = !active
    if (active) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else if (reducedMotion) v.pause()
  }, [active])

  return (
    <article className="short">
      <button
        className="short__media"
        onClick={onToggle}
        data-cursor={active ? 'Mute' : 'Sound on'}
        aria-pressed={active}
        aria-label={`${s.title}. ${active ? 'Mute' : 'Play with sound'}.`}
      >
        <video ref={ref} src={s.src} poster={s.poster} muted loop playsInline preload="none" />
        {s.company && <span className="card__badge mono">@ {s.company}</span>}
        <span className={`short__sound mono${active ? ' is-on' : ''}`}><i />{active ? 'Sound on' : 'Tap for sound'}</span>
      </button>
      <h3 className="short__title">{s.title}</h3>
      <p className="short__note mono muted">{s.note}</p>
    </article>
  )
}

// Vertical reels: the short-form work a reels client wants to see first.
export default function Shorts() {
  const { shorts } = useContent()
  const root = useRef(null)
  const [active, setActive] = useState(-1)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.shorts__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.shorts__title', start: 'top 85%' },
      })
      gsap.from('.short', {
        y: 70, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: '.shorts__track', start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [shorts] },
  )

  if (!shorts.length) return null
  return (
    <section className="shorts" id="reels" ref={root}>
      <div className="shorts__head">
        <h2 className="shorts__title">Reels</h2>
        <span className="section-label">({String(shorts.length).padStart(2, '0')}) vertical videos · tap one for sound</span>
      </div>
      <div className="shorts__track">
        {shorts.map((s, n) => (
          <Short key={s.src} s={s} active={n === active} onToggle={() => setActive(n === active ? -1 : n)} />
        ))}
      </div>
    </section>
  )
}
