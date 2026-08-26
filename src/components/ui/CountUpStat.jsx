import React, { useState, useEffect, useRef } from 'react';

/**
 * Parses a stat string like "07", "70+", "100%", "3.5k" etc.
 * Returns { num: number, prefix: string, suffix: string, formatted: string }
 */
function parseStat(str) {
  if (!str) return { num: 0, prefix: '', suffix: '', padded: false, padLen: 0 };
  const s = String(str).trim();
  // Check leading zeros (like "07") — need to preserve zero-padding
  const padded = /^0\d/.test(s);
  const padLen = padded ? s.replace(/[^0-9].*$/, '').length : 0;
  // Extract optional prefix (e.g. "+")
  const prefixMatch = s.match(/^([^0-9]*)/);
  const prefix = prefixMatch ? prefixMatch[1] : '';
  // Extract number
  const numMatch = s.replace(prefix, '').match(/^(\d+\.?\d*)/);
  const num = numMatch ? parseFloat(numMatch[1]) : 0;
  // Extract suffix (everything after the number)
  const suffix = s.slice(prefix.length + (numMatch ? numMatch[0].length : 0));
  return { num, prefix, suffix, padded, padLen };
}

function formatNum(current, padded, padLen) {
  const n = Math.round(current);
  if (padded && padLen > 0) return String(n).padStart(padLen, '0');
  return String(n);
}

/**
 * CountUpStat — animates a numeric stat value on scroll into view.
 * Plays once. Falls back to plain text if value is non-numeric.
 *
 * Props:
 *   value      — string like "07", "70+", "100%"
 *   className  — CSS classes for the wrapping span
 *   duration   — animation duration in ms (default 1600)
 *   delay      — delay before starting in ms (default 0)
 */
export default function CountUpStat({ value, className = '', duration = 1600, delay = 0 }) {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState(value);
  const [triggered, setTriggered] = useState(false);
  const rafRef = useRef(null);

  const { num, prefix, suffix, padded, padLen } = parseStat(value);
  const isAnimatable = num > 0 && !isNaN(num);

  useEffect(() => {
    if (!isAnimatable || triggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isAnimatable, triggered]);

  useEffect(() => {
    if (!triggered || !isAnimatable) return;

    // Easing: easeOutCubic
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp + delay;
      const elapsed = Math.max(0, timestamp - start);
      const progress = Math.min(elapsed / duration, 1);
      const current = ease(progress) * num;
      setDisplayed(`${prefix}${formatNum(current, padded, padLen)}${suffix}`);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [triggered, num, prefix, suffix, padded, padLen, duration, delay, isAnimatable]);

  // Update displayed value if content changes externally (e.g. after admin edit)
  useEffect(() => {
    if (!triggered) setDisplayed(value);
  }, [value, triggered]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
