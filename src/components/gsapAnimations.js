import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global ScrollTrigger Defaults
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
});

export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

export const animateHeroEntrance = (refs) => {
  console.log("GSAP animations triggered on:", refs);
};

export const animateMarquee = (ref, { speed = 55 } = {}) => {
  if (!ref.current) return;
  gsap.to(ref.current.children, {
    xPercent: -50,
    repeat: -1,
    duration: speed,
    ease: "none"
  });
};

export const initHeroParallax = ({ heroRef, nextSectionRef, layers }) => {
  const ctx = gsap.context(() => {
    if (!heroRef.current || !nextSectionRef.current) return;

    // Subtle scale & slight parallax shift without disappearing or blur glitches
    gsap.to(heroRef.current, {
      scale: 0.96,
      opacity: 0.85,
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: nextSectionRef.current,
        start: "top bottom",
        end: "top top",
        scrub: 0.5,
      }
    });

    // Gentle layer parallax depth movement
    if (layers && Array.isArray(layers)) {
      layers.forEach((layer) => {
        if (!layer.ref || !layer.ref.current) return;
        const target = layer.ref.current;
        
        gsap.to(target, {
          y: -40 * (layer.speed || 0.5),
          ease: "none",
          scrollTrigger: {
            trigger: nextSectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          }
        });
      });
    }
  });
  
  return ctx;
};

export const initTextHighlight = (selector = '[data-text-highlight]', options = {}) => {
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
};

export const initFadeUp = (selector = '[data-fade-up]') => {
  const elements = gsap.utils.toArray(selector);
  return elements.map((el) => {
    return gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};

export const initStaggerList = (containerSelector = '[data-stagger-container]', itemSelector = '[data-stagger-item]') => {
  const containers = gsap.utils.toArray(containerSelector);
  return containers.map((container) => {
    const items = container.querySelectorAll(itemSelector);
    return gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};
