"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface UIEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  spots: number;
  totalSpots: number;
  price: string;
  category: string;
}

export function FeaturedEvents({ liveEvents = [] }: { liveEvents?: UIEvent[] }) {
  return (
    <section className="py-24 px-6 relative z-10 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-heading font-bold text-white text-glow">Featured Transits</h2>
        <Link href="/events">
           <Button variant="outline" className="hidden sm:inline-flex">View All Hubs</Button>
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory hide-scrollbar">
        {liveEvents.length === 0 ? (
          <div className="text-silver italic py-8 border border-white/10 rounded-xl px-12 bg-navy/30">
            Fetching celestial data feeds... (No live events pushed by Admins yet)
          </div>
        ) : liveEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: -10, rotateX: 5 }}
            className="snap-center shrink-0 w-[85vw] sm:w-96"
            style={{ perspective: "1000px" }}
          >
            <Link href={`/events/${event.id}`}>
               <Card variant="glass-hover" className="h-full flex flex-col transform-gpu overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
                  
                  <div className="h-56 bg-gradient-to-br from-navy via-black to-cosmic/40 w-full flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-accent tracking-widest text-neon border border-neon/30">
                      {event.category}
                    </div>
                    <div className="w-32 h-32 rounded-full bg-lunar/20 blur-[40px] absolute" />
                    <h3 className="text-2xl font-heading font-bold text-white z-10 text-center leading-snug group-hover:text-glow transition-all">{event.title}</h3>
                  </div>
                  
                  <CardContent className="flex-1 p-6 flex flex-col gap-4 bg-navy/50 relative z-10">
                    <div className="flex items-center gap-3 text-silver text-sm">
                      <Calendar size={18} className="text-lunar" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-silver text-sm">
                      <MapPin size={18} className="text-cosmic" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/50">
                      <div className="flex items-center gap-2 text-silver text-sm">
                        <Users size={16} />
                        <span>{event.spots} cap</span>
                      </div>
                      <span className="text-gold font-bold text-xl">{event.price}</span>
                    </div>
                  </CardContent>
               </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
