import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop/fine-pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Quick setters for ultra-smooth 60fps tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    // Attach magnetic hover & magnification to text / link elements
    let activeTextElement = null;

    const handleTextHover = () => {
      const selectors = 'h1, h2, h3, h4, h5, h6, p, a, button, .hover-this, [data-cursor="hover"]';
      const elements = document.querySelectorAll(selectors);

      elements.forEach((el) => {
        if (el.dataset.gsapCursorAttached) return;
        el.dataset.gsapCursorAttached = 'true';

        // Mouse Enter: Expand cursor circle & zoom/magnify text
        el.addEventListener('mouseenter', () => {
          activeTextElement = el;
          gsap.to(cursor, {
            scale: 1.5, // 20px base expands to 30px on text hover
            duration: 0.25,
            ease: "power2.out",
          });

          // Magnify text slightly
          gsap.to(el, {
            scale: 1.08,
            duration: 0.25,
            ease: "power2.out",
          });
        });

        // Magnetic tracking inside element
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(el, {
            x: x * 0.15, // Subtle magnetic pull
            y: y * 0.15,
            duration: 0.2,
            ease: "power2.out",
          });
        });

        // Mouse Leave: Restore cursor circle & reset text zoom
        el.addEventListener('mouseleave', () => {
          gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: "power3.out",
          });

          gsap.to(el, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          });

          if (activeTextElement === el) {
            activeTextElement = null;
          }
        });
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    handleTextHover();
    const interval = setInterval(handleTextHover, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      clearInterval(interval);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className="custom-gsap-cursor"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;
