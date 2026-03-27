"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Rocket, Ticket, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current && stepsRef.current.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center+=100",
          end: "bottom center-=100",
          scrub: 1,
        }
      });

      stepsRef.current.forEach((step, index) => {
        if (step) {
          tl.fromTo(step, 
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 1 }
          );
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const steps = [
    {
      title: "Discover Your Event",
      description: "Browse our curated selection of cosmic and luxury events worldwide.",
      icon: <Rocket size={40} className="text-lunar" />
    },
    {
      title: "Secure Your Ticket",
      description: "Quick and seamless checkout with Stripe integration and instant electronic delivery.",
      icon: <Ticket size={40} className="text-cosmic" />
    },
    {
      title: "Experience the Magic",
      description: "Check in with your digital pass and enjoy real-time schedules and networking.",
      icon: <CheckCircle size={40} className="text-neon" />
    }
  ];

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 px-6 relative z-10 w-full max-w-5xl mx-auto">
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-cosmic/20 blur-[60px] rounded-full z-0" />
        <h2 className="text-4xl font-heading font-bold text-white mb-4 relative z-10">How It Works</h2>
        <p className="text-silver relative z-10">Your journey to unforgettable experiences in 3 simple steps.</p>
      </div>

      <div className="flex flex-col gap-12 sm:gap-20 relative">
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-lunar/50 to-transparent -translate-x-1/2 hidden md:block" />
        
        {steps.map((step, i) => (
          <div 
            key={i} 
            ref={(el) => { if (el) stepsRef.current[i] = el }}
            className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className={`flex-1 flex justify-center md:justify-${i % 2 === 0 ? 'end' : 'start'} relative md:px-12`}>
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(79,142,247,0.15)] bg-navy">
                {step.icon}
              </div>
            </div>
            
            <div className={`flex-1 text-center md:text-${i % 2 === 0 ? 'left' : 'right'} md:px-12`}>
              <h3 className="text-3xl font-heading font-bold text-white mb-3">{step.title}</h3>
              <p className="text-silver max-w-sm mx-auto md:mx-0 text-lg">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
