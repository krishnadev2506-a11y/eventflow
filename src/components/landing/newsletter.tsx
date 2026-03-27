"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 px-6 relative z-10 w-full">
      <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-30" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Join the Cosmic Guestlist</h2>
          <p className="text-silver/90 mb-10 max-w-xl text-lg">
            Be the first to know about upcoming exclusive events, secret locations, and VIP ticket drops.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-navy/80 border border-border/50 rounded-full px-6 py-4 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all font-sans"
              disabled={status === "loading" || status === "success"}
            />
            <Button 
              type="submit" 
              variant="neon" 
              disabled={status === "loading" || status === "success"}
              className="w-full sm:w-auto"
            >
              {status === "loading" ? "Joining..." : status === "success" ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
