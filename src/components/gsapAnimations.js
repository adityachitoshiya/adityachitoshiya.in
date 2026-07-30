import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHeroEntrance = (refs) => {
  // Existing placeholder or implementation
  console.log("GSAP animations triggered on:", refs);
};

export const animateMarquee = (ref, { speed = 55 } = {}) => {
  if (!ref.current) return;
  // If the marquee has children, animate them to scroll infinitely
  gsap.to(ref.current.children, {
    xPercent: -50,
    repeat: -1,
    duration: speed,
    ease: "none"
  });
};

export const initHeroParallax = ({ heroRef, nextSectionRef, layers }, pinDistance = 500) => {
  const ctx = gsap.context(() => {
    if (!heroRef.current) return;

    // Parallax scrub layers inside Hero
    layers.forEach((layer) => {
      if (!layer.ref.current || layer.ref.current.length === 0) return;
      
      gsap.to(layer.ref.current, {
        y: pinDistance * layer.speed,
        opacity: layer.fade ? 0 : 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        }
      });
    });
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
