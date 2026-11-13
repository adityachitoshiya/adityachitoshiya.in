import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './lib/gsap'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Work from './components/Work'
import Experience from './components/Experience'
import Services from './components/Services'
import Contact from './components/Contact'
import Skills from './components/Skills'
import Viral from './components/Viral'
import Snapshot from './components/Snapshot'
import Showreel from './components/Showreel'
import Shorts from './components/Shorts'
import CaseStudy from './components/CaseStudy'
import HireMe from './components/HireMe'
import ContentProvider from './ContentProvider'

export default function App() {
  const [loaded, setLoaded] = useState(reducedMotion)
  // Content renders a beat after mount; re-measure scroll triggers then.
  const onContent = useCallback(() => requestAnimationFrame(() => ScrollTrigger.refresh()), [])

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('load', refresh)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // Hold scroll while the preloader runs.
  useEffect(() => {
    const lenis = window.__lenis
    if (!loaded) lenis?.stop()
    else {
      lenis?.start()
      // The hero pin is created after the preloader, so re-order triggers
      // to let its spacing shift everything below it.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
  }, [loaded])

  return (
    <>
      {!reducedMotion && <Preloader onDone={() => setLoaded(true)} />}
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <ContentProvider onReady={onContent}>
        <HireMe />
        <main id="main">
          <Hero loaded={loaded} />
          <Snapshot />
          <Marquee />
          <Showreel />
          <Shorts />
          <Viral />
          <About />
          <Work />
          <CaseStudy />
          <Experience />
          <Services />
          <Skills />
          <Contact />
        </main>
      </ContentProvider>
    </>
  )
}
