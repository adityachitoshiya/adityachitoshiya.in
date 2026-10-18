import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

export default function Showreel() {
  const { reels } = useContent()
  const root = useRef(null)
  const video = useRef(null)
  const bar = useRef(null)
  const [i, setI] = useState(0)
  const [muted, setMuted] = useState(true)
  const inView = useRef(false)
  const [paused, setPaused] = useState(reducedMotion)
  const pausedRef = useRef(paused)
  useEffect(() => { pausedRef.current = paused }, [paused])

  useGSAP(
    () => {
      if (reducedMotion) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 761px)', () => {
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', scrub: 1, pin: true },
        })
          .fromTo('.reel__frame', { scale: 0.42, borderRadius: 28 }, { scale: 1, borderRadius: 14, ease: 'none' }, 0)
          .fromTo('.reel__word--l', { xPercent: 60 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo('.reel__word--r', { xPercent: -60 }, { xPercent: 0, ease: 'none' }, 0)
          .from('.reel__list', { opacity: 0, y: 30, ease: 'none' }, 0.5)
      })
      mm.add('(max-width: 760px)', () => {
        gsap.from('.reel__frame', {
          scale: 0.7, ease: 'none',
          scrollTrigger: { trigger: '.reel__frame', start: 'top bottom', end: 'center center', scrub: true },
        })
      })
    },
    { scope: root },
  )

  // Only play while the frame is on screen.
  useEffect(() => {
    const v = video.current
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting
      if (e.isIntersecting && !pausedRef.current) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // Swap clips; keep playing if on screen.
  useEffect(() => {
    const v = video.current
    v.load()
    if (inView.current && !pausedRef.current) v.play().catch(() => {})
    if (reducedMotion) return
    gsap.fromTo(v, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' })
  }, [i])

  // React doesn't reliably sync the muted property; set it directly.
  useEffect(() => { video.current.muted = muted }, [muted])

  const onTime = () => {
    const v = video.current
    if (v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`
  }
  const next = () => setI((n) => (n + 1) % reels.length)
  const togglePlay = (e) => {
    e.stopPropagation()
    const v = video.current
    if (paused) v.play().catch(() => {})
    else v.pause()
    setPaused(!paused)
  }

  if (!reels.length) return null
  return (
    <section className="reel" ref={root} aria-label="Motion showreel">
      <span className="reel__word reel__word--l" aria-hidden="true">Show</span>
      <div
        className="reel__frame"
        data-cursor={muted ? 'Sound on' : 'Mute'}
        onClick={() => setMuted((m) => !m)}
      >
        <video
          ref={video}
          src={reels[i].src}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label={`${reels[i].title}. Click to toggle sound.`}
          onTimeUpdate={onTime}
          onEnded={next}
        />
        <div className="reel__hud mono">
          <span>{String(i + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')} — {reels[i].title}</span>
          <button className="reel__pause" onClick={togglePlay} aria-label={paused ? 'Play showreel' : 'Pause showreel'}>
            {paused ? '▶ Play' : '❚❚ Pause'}
          </button>
        </div>
        <div className="reel__bar"><i ref={bar} /></div>
      </div>
      <span className="reel__word reel__word--r" aria-hidden="true">Reel</span>
      <ol className="reel__list mono">
        {reels.map((r, n) => (
          <li key={r.title}>
            <button className={n === i ? 'is-active' : ''} onClick={() => setI(n)}>
              {String(n + 1).padStart(2, '0')} {r.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
