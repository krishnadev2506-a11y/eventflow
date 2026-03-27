"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const Moon = dynamic(() => import("@/components/3d/moon").then(mod => mod.Moon), { ssr: false });
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [text, setText] = useState("");
  const fullText = "Your Universe of Events Awaits";

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* 3D Moon Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <Moon />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 px-6 py-2 rounded-full border border-lunar/30 bg-lunar/10 backdrop-blur-md"
        >
          <span className="text-lunar font-semibold tracking-wider text-sm uppercase">Discover & Host Seamlessly</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight min-h-[1em]">
          {text}
          <span className="animate-pulse text-neon">|</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-silver mb-10 max-w-2xl bg-clip-text"
        >
          Experience the premium platform for cosmic luxury events. Seamless booking, real-time tracking, and unforgettable moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link href="/events">
            <Button variant="neon" size="lg">Explore Events</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Host an Event</Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-muted font-accent uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="text-lunar" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
