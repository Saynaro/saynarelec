import React, { useEffect, useRef, useState } from 'react';

export default function CountUp({ value = 0, duration = 1400, suffix = '', prefix = '', pad = 0, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.round(eased * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration, started]);

  const num = pad > 0 ? String(display).padStart(pad, '0') : String(display);

  return (
    <span ref={ref} className={className}>
      {prefix}{num}{suffix}
    </span>
  );
}