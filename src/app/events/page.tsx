"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Map as MapIcon, SlidersHorizontal, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Event } from "@/types/next-auth";

const mockEvents = [
  { id: "1", title: "Neon Lunar Festival", date: "2026-10-24T20:00:00", location: "Tokyo, Japan", spots: 120, totalSpots: 500, price: "₹299", category: "Music" },
  { id: "2", title: "Cosmic Tech Summit", date: "2026-11-12T09:00:00", location: "San Francisco, CA", spots: 50, totalSpots: 200, price: "₹899", category: "Tech" },
  { id: "3", title: "Aurora Retreat", date: "2026-12-05T14:00:00", location: "Reykjavik, Iceland", spots: 20, totalSpots: 50, price: "₹1499", category: "Wellness" },
  { id: "4", title: "Orbital Art Gala", date: "2027-01-15T19:00:00", location: "Paris, France", spots: 85, totalSpots: 150, price: "₹499", category: "Art" },
  { id: "5", title: "Stellar Food Expo", date: "2027-02-20T11:00:00", location: "New York, NY", spots: 300, totalSpots: 1000, price: "₹150", category: "Food" },
  { id: "6", title: "Gravity Defying Design", date: "2027-03-10T10:00:00", location: "London, UK", spots: 5, totalSpots: 100, price: "₹1200", category: "Design" },
];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [mapView, setMapView] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then((data: Event[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalize DB events if they exist
          setEvents(data.map(dbEvent => ({
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date,
            location: dbEvent.location,
            spots: dbEvent.capacity - Math.floor(Math.random() * 20), // mock spot tracker based on capacity
            totalSpots: dbEvent.capacity,
            price: `₹${dbEvent.price}`,
            category: "General"
          })));
        } else {
          // Fallback to beautiful mock array if DB is freshly generated and empty
          setEvents(mockEvents);
        }
      })
      .catch(() => setEvents(mockEvents))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-24 z-40 bg-navy/95 backdrop-blur-3xl rounded-2xl p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,1)] border border-lunar/50">
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events, cities, artists..." 
            className="w-full bg-navy/50 border border-border/50 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all font-sans"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <Button variant="outline" className="shrink-0 h-12 rounded-full px-6 text-white hover:text-white hover:border-lunar">
            <SlidersHorizontal size={18} className="mr-2" /> Filters
          </Button>
          <div className="h-8 w-px bg-border mx-2 shrink-0 hidden md:block" />
          <Button 
            variant={mapView ? "primary" : "outline"} 
            className={`shrink-0 h-12 rounded-full px-6 ${!mapView && 'text-white hover:text-white'}`}
            onClick={() => setMapView(!mapView)}
          >
            <MapIcon size={18} className="mr-2" /> {mapView ? "List View" : "Map View"}
          </Button>
        </div>
      </div>

      {!mapView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))
          ) : events.map((event, i) => {
            const fillPercentage = ((event.totalSpots - event.spots) / event.totalSpots) * 100;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                className="transform-gpu h-full"
                style={{ perspective: "1000px" }}
              >
                <Link href={`/events/${event.id}`}>
                  <Card variant="glass-hover" className="h-full flex flex-col group relative overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
                    
                    <div className="h-48 bg-gradient-to-br from-navy via-black to-cosmic/30 w-full flex items-center justify-center p-6 relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-accent tracking-widest text-neon border border-neon/30 z-20">
                        {event.category}
                      </div>
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-accent tracking-widest text-gold border border-gold/30 z-20 flex items-center gap-2">
                        <Clock size={12} /> 42:15:30:10
                      </div>
                      <div className="w-32 h-32 rounded-full bg-lunar/20 blur-[40px] absolute" />
                      <h3 className="text-2xl font-heading font-bold text-white z-10 text-center leading-snug group-hover:text-glow transition-all">{event.title}</h3>
                    </div>
                    
                    <CardContent className="flex-1 p-6 flex flex-col gap-4 relative z-10 bg-navy/80">
                      <div className="flex items-center gap-3 text-silver text-sm">
                        <Calendar size={16} className="text-lunar" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-silver text-sm">
                        <MapPin size={16} className="text-cosmic" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-xs text-muted">
                          <span>Spots Left</span>
                          <span className="text-white font-medium">{event.spots} / {event.totalSpots}</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-border/50">
                          <div 
                            className="bg-gradient-to-r from-lunar to-neon h-full rounded-full shadow-[0_0_10px_var(--color-neon)]" 
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/50">
                        <span className="text-gold font-bold text-2xl">{event.price}</span>
                        <Button variant="neon" size="sm" className="hidden sm:inline-flex">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-[600px] glass rounded-3xl overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-navy/90 z-0" />
          <div className="relative z-10 text-center">
            <MapIcon size={64} className="mx-auto text-muted mb-4" />
            <h3 className="text-2xl font-heading font-bold text-white mb-2">Interactive Map Loading</h3>
            <p className="text-silver">Leaflet.js map integration initializing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
