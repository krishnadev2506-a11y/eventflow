"use client";

import { useState, useEffect } from "react";
import { Starfield } from "@/components/3d/starfield";
import { QrCode, Clock, Bell, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const schedule = [
  { id: 1, time: "09:00 AM", title: "Cosmic Keynote", speaker: "Dr. Stella Nova", active: false, past: true },
  { id: 2, time: "11:30 AM", title: "Future of AI & Space", speaker: "Marcus Chen", active: true, past: false },
  { id: 3, time: "02:00 PM", title: "Quantum Computing Workshop", speaker: "Elena Rostova", active: false, past: false },
];

export default function EventDayPortal() {
  const [showQR, setShowQR] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [announcement, setAnnouncement] = useState("Welcome to Cosmic Tech Summit! Please proceed to the Main Hall for the Keynote.");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement("Session 'Future of AI' is starting in 10 minutes at Stage Alpha.");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-10">
      <Starfield />
      
      {/* Live Ticker */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-neon/10 border-b border-neon/30 flex items-center px-4 overflow-hidden z-50">
        <div className="flex items-center gap-2 text-neon shrink-0 bg-black/50 pr-4 z-10 h-full">
          <Bell size={14} className="animate-pulse" />
          <span className="font-accent text-xs tracking-widest uppercase font-bold">Live Alert</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <motion.div 
            animate={{ x: [800, -800] }} 
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="text-silver text-sm whitespace-nowrap absolute"
          >
            {announcement}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-6 md:p-8 gap-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <Card variant="glass" className="p-6 text-center border-lunar/30 bg-navy/80 backdrop-blur-xl shrink-0">
            <h2 className="text-xl font-heading font-bold text-white mb-2">Cosmic Traveler</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-accent mb-6 font-bold tracking-widest uppercase">VIP Pass</div>
            
            <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 flex items-center justify-center cursor-pointer group relative overflow-hidden" onClick={() => setShowQR(true)}>
              <QrCode size={160} className="text-black" />
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-accent tracking-widest text-sm">ENLARGE</span>
              </div>
            </div>
            <p className="text-muted text-xs mt-4 uppercase tracking-widest">Scan at checkpoints</p>
          </Card>
          
          <Button variant="outline" className="w-full" onClick={() => setShowFeedback(true)}>
            <Star size={16} className="mr-2" /> Rate Current Session
          </Button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-3xl font-heading font-bold text-white mb-8 text-glow">Live Schedule</h2>
          
          <div className="space-y-4">
            {schedule.map((session) => (
              <div 
                key={session.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  session.active 
                    ? "bg-lunar/10 border-lunar shadow-[0_0_20px_rgba(79,142,247,0.2)]" 
                    : session.past 
                      ? "bg-white/5 border-white/5 opacity-60" 
                      : "glass border-border hover:border-white/20"
                }`}
              >
                {session.active && (
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-neon shadow-[0_0_15px_var(--color-neon)] animate-pulse" />
                )}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className={session.active ? "text-neon" : "text-lunar"} />
                      <span className={`font-accent text-sm tracking-widest ${session.active ? "text-neon" : "text-silver"}`}>
                        {session.time}
                      </span>
                      {session.active && (
                        <span className="ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neon/20 text-neon border border-neon/50 animate-pulse">
                          Live Now
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-1">{session.title}</h3>
                    <p className="text-silver text-sm">by {session.speaker}</p>
                  </div>
                  
                  <Button variant={session.active ? "neon" : "outline"} size="sm" className="w-full sm:w-auto">
                    {session.active ? "Join Stream" : "Details"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-3xl relative shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <QrCode size={300} className="text-black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              className="glass border-border rounded-2xl p-8 max-w-md w-full relative"
            >
              <button className="absolute top-4 right-4 text-muted hover:text-white" onClick={() => setShowFeedback(false)}>
                <X size={20} />
              </button>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Rate Session</h3>
              <p className="text-silver mb-6 text-sm">&quot;Future of AI &amp; Space&quot; by Marcus Chen</p>
              
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={32} className="text-gold cursor-pointer hover:fill-gold transition-all" />
                ))}
              </div>
              <Button variant="primary" className="w-full" onClick={() => setShowFeedback(false)}>Submit Feedback</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
