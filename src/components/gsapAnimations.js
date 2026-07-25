import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHeroEntrance = (refs) => {
  // Existing placeholder or implementation
  console.log("GSAP animations triggered on:", refs);
};

export const initHeroParallax = ({ heroRef, nextSectionRef, layers }, pinDistance = 600) => {
  const ctx = gsap.context(() => {
    // Pin the hero section
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${pinDistance}`,
      pin: true,
      pinSpacing: false, // next section will slide over it
    });

    // Make the next section round at the top and act as a tray
    gsap.set(nextSectionRef.current, {
      borderTopLeftRadius: '32px',
      borderTopRightRadius: '32px',
      overflow: 'hidden',
      marginTop: '-2px', // tiny overlap
      position: 'relative',
      zIndex: 30, // needs to be higher than hero which is z-20
    });

    // Parallax layers inside Hero
    layers.forEach((layer) => {
      // If ref.current is an array of elements (which it is via callback refs), GSAP animates all of them
      if (!layer.ref.current || layer.ref.current.length === 0) return;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          scrub: true,
        }
      });
      
      const yMove = pinDistance * layer.speed;
      const toVars = { y: yMove, ease: "none" };
      if (layer.fade) {
        toVars.opacity = 0;
      }
      
      tl.to(layer.ref.current, toVars);
    });
  });
  
  return ctx;
};
