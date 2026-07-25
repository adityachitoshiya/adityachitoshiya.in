import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero entrance timeline — nav, badge, accent word, headline, photo,
 * tagline, presented-by, footer all animate in with a staggered sequence.
 * Pass refs for whichever elements exist in that Hero variant (desktop/mobile);
 * missing refs are simply skipped.
 */
export function animateHeroEntrance(refs) {
  if (prefersReducedMotion()) return null;

  const { navRef, badgeRef, accentRef, headlineRef, photoRef, taglineRef, presentedRef, footerRef } = refs;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (navRef?.current) tl.from(navRef.current, { y: -20, opacity: 0, duration: 0.5 }, 0);
  if (badgeRef?.current) tl.from(badgeRef.current, { opacity: 0, scale: 0.9, duration: 0.4 }, 0.1);
  if (accentRef?.current) tl.from(accentRef.current, { opacity: 0, y: 20, rotate: -4, duration: 0.5 }, 0.2);
  if (headlineRef?.current) tl.from(headlineRef.current, { opacity: 0, y: 40, duration: 0.7 }, 0.3);
  if (photoRef?.current) tl.from(photoRef.current, { opacity: 0, y: 60, duration: 0.8 }, 0.4);
  if (taglineRef?.current) tl.from(taglineRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0.6);
  if (presentedRef?.current) tl.from(presentedRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0.65);
  if (footerRef?.current) tl.from(footerRef.current, { opacity: 0, y: 10, duration: 0.5 }, 0.7);

  return tl;
}

/**
 * Generic scroll-reveal — attach `data-reveal` to any section/card anywhere
 * in the site (Welcome, About, Education, Creatives cards, etc.) and call
 * this once near the app root so scrolling feels consistent site-wide,
 * not just on the Hero.
 */
export function initScrollReveals(selector = '[data-reveal]') {
  if (prefersReducedMotion()) return [];

  const elements = gsap.utils.toArray(selector);
  return elements.map((el) =>
    gsap.from(el, {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  );
}

/**
 * Smooth infinite marquee — replaces raw CSS @keyframes with GSAP so speed
 * and pausing (e.g. on hover) are controllable from JS if needed later.
 * Assumes the marquee content is duplicated inside the ref so the loop
 * distance is exactly half the scrollWidth.
 */
export function animateMarquee(ref, { speed = 40 } = {}) {
  if (!ref?.current || prefersReducedMotion()) return null;

  const el = ref.current;
  const distance = el.scrollWidth / 2;

  return gsap.to(el, {
    x: -distance,
    duration: distance / speed,
    ease: 'none',
    repeat: -1,
  });
}

/**
 * Scroll-highlight text — dims every word in a paragraph/heading, then
 * lights them up one by one (dim → active color) as the element scrolls
 * through the viewport. No SplitText plugin needed — words are split and
 * wrapped in spans manually, then animated with a stagger tied to scroll
 * position via ScrollTrigger's scrub.
 *
 * Attach `data-text-highlight` to any paragraph/heading anywhere on the
 * site (About Me copy, Introduction text, etc.) and call this once near
 * the app root — same pattern as initScrollReveals().
 *
 * @param {string} selector
 * @param {object} [options]
 * @param {string} [options.activeColor] - fully "read" word color
 * @param {string} [options.dimColor]    - not-yet-read word color
 * @param {boolean|number} [options.scrubSpeed] - true = tightly tied to scroll,
 *        or a number of seconds for a slight catch-up smoothing (e.g. 0.5)
 */
export function initTextHighlight(selector = '[data-text-highlight]', options = {}) {
  if (prefersReducedMotion()) return [];

  const { activeColor = '#ffffff', dimColor = 'rgba(255,255,255,0.25)', scrubSpeed = true } = options;

  const elements = gsap.utils.toArray(selector);

  return elements.map((el) => {
    // Split into words once; guards against double-wrapping on re-render/HMR
    if (!el.dataset.thSplit) {
      const words = el.textContent.split(/(\s+)/);
      el.innerHTML = words
        .map((w) => (w.trim() ? `<span style="color:${dimColor}">${w}</span>` : w))
        .join('');
      el.dataset.thSplit = 'true';
    }

    const spans = el.querySelectorAll('span');

    return gsap.to(spans, {
      color: activeColor,
      stagger: 0.04,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 55%',
        scrub: scrubSpeed,
      },
    });
  });
}
/**
 * Hero → next-section parallax reveal (the "sliding tray" effect).
 *
 * While the visitor scrolls through the Hero, the Hero pins in place and
 * the next section (e.g. Welcome) rises up from below and slides over it,
 * covering it completely by the time the pin range ends. Rounded top
 * corners on the next section make it read as a tray sliding up over glass.
 *
 * Inside the Hero, individual layers (photo, headline, accent word) drift
 * at different speeds during the pin — the depth/parallax feel.
 *
 * @param {object} refs
 * @param {React.RefObject} refs.heroRef        - outer wrapper of the whole Hero section
 * @param {React.RefObject} refs.nextSectionRef - the section directly after Hero (e.g. Welcome)
 * @param {Array<{ ref: React.RefObject, speed?: number, fade?: boolean }>} [refs.layers]
 *        Inner Hero elements to parallax. `speed` is relative drift (0 = static, 1 = full range).
 *        `fade: true` also fades the layer out as it drifts — good for text/accent elements
 *        that should visually recede before the photo does.
 * @param {number} [pinDistance] - how much extra scroll (in px) the pin holds for; bigger = slower reveal
 */
export function initHeroParallax({ heroRef, nextSectionRef, layers = [] }, pinDistance) {
  if (prefersReducedMotion()) return null;
  if (!heroRef?.current || !nextSectionRef?.current) return null;

  const ctx = gsap.context(() => {
    // Give the next section its "tray" styling so the reveal reads correctly
    gsap.set(nextSectionRef.current, {
      position: 'relative',
      zIndex: 20,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
    });

    // Default to one full viewport height of scroll if no distance given —
    // gives a smooth, unhurried reveal instead of a jarring quick cover.
    const distance = pinDistance || (typeof window !== 'undefined' ? window.innerHeight : 600);

    const trigger = {
      trigger: heroRef.current,
      start: 'top top',
      end: `+=${distance}`,
      scrub: 1,
    };

    // Pin the Hero. pinSpacing defaults to true, which reserves exactly
    // `distance` px of extra scroll room in the document — the next section
    // (sitting right after Hero in normal flow) then naturally scrolls up
    // and covers the pinned Hero over that range. No manual yPercent/transform
    // on the next section needed — that manual approach was what caused the
    // "covers way too fast" bug before.
    ScrollTrigger.create({ ...trigger, pin: true });

    // Depth parallax for individual Hero layers while pinned
    layers.forEach(({ ref, speed = 0.3, fade = false }) => {
      if (!ref?.current) return;
      gsap.to(ref.current, {
        yPercent: -30 * speed,
        opacity: fade ? 0.15 : 1,
        ease: 'none',
        scrollTrigger: trigger,
      });
    });
  });

  return ctx;
}

/**
 * Call inside a resize/orientation-change listener (or after fonts/images
 * finish loading) so the pin distance recalculates correctly.
 */
export function refreshOnResize(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    ScrollTrigger.refresh();
    callback && callback();
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}
