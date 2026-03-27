"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{to >= 1000 && to % 1000 === 0 ? "+" : ""}</span>;
}

export function Stats() {
  return (
    <section className="py-20 px-6 relative z-10 w-full bg-navy/80 border-y border-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center">
        <div>
          <div className="text-4xl md:text-6xl font-accent font-bold text-white mb-3">
            <Counter from={0} to={5000} duration={2} />
          </div>
          <div className="text-silver uppercase tracking-[0.2em] text-xs">Events Hosted</div>
        </div>
        <div>
          <div className="text-4xl md:text-6xl font-accent font-bold text-neon mb-3 text-glow">
            <Counter from={0} to={120000} duration={2.5} />
          </div>
          <div className="text-silver uppercase tracking-[0.2em] text-xs">Attendees</div>
        </div>
        <div>
          <div className="text-4xl md:text-6xl font-accent font-bold text-lunar mb-3">
            <Counter from={0} to={150} duration={1.5} />
          </div>
          <div className="text-silver uppercase tracking-[0.2em] text-xs">Cities</div>
        </div>
        <div>
          <div className="text-4xl md:text-6xl font-accent font-bold text-gold mb-3">
            <Counter from={0} to={4900} duration={2} />
          </div>
          <div className="text-silver uppercase tracking-[0.2em] text-xs">5-Star Reviews</div>
        </div>
      </div>
    </section>
  );
}
