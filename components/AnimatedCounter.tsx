"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const showFinal = () => setDisplay(target);

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      showFinal();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showFinal();
      return;
    }

    const element = nodeRef.current;
    if (!element) {
      showFinal();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      showFinal();
      return;
    }

    const run = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutExpo(progress);
        setDisplay(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = display.toLocaleString("en-US");

  return (
    <span ref={nodeRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
