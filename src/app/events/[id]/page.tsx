"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Event } from "@/types/next-auth";

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Move setMounted to next tick to avoid synchronous setState in effect warning
    const timeout = setTimeout(() => setMounted(true), 0);
    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetDate]);

  if (!mounted) return <div className="h-[108px]" />; // Placeholder to prevent jump

  return (
    <div className="flex gap-4 font-accent text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-navy/80 border border-lunar/30 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-neon shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            {value.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-silver mt-2 uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => { setEvent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-neon"><div className="animate-pulse text-2xl font-bold">Initializing Uplink...</div></div>;
  if (!event || (event as { error?: string }).error) return <div className="min-h-screen flex items-center justify-center bg-background text-silver"><Link href="/events"><Button variant="outline">Event Not Found</Button></Link></div>;

  return (
    <div className="relative min-h-screen bg-background pb-24">
      {/* Parallax Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop')] bg-cover bg-center opacity-40 z-0"
          style={{ y }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        
        <div className="relative z-20 text-center px-6 mt-20">
          <Link href="/events" className="inline-flex items-center text-silver hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Events
          </Link>
          <div className="inline-block mb-6 px-4 py-1 rounded-full bg-lunar/20 border border-lunar/50 text-lunar font-accent text-sm tracking-widest uppercase">
            {event.category}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white text-glow mb-8">{event.title}</h1>
          <Countdown targetDate={event.date} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <Card variant="glass" className="p-8">
              <h2 className="text-2xl font-heading font-bold text-white mb-4">About the Event</h2>
              <p className="text-silver text-lg leading-relaxed">{event.description}</p>
            </Card>

            {/* Schedule Timeline */}
            {event.sessions && event.sessions.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-white">Event Schedule</h2>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {event.sessions.map((session) => (
                    <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neon bg-navy shadow-[0_0_10px_var(--color-neon)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Clock size={16} className="text-neon" />
                      </div>
                      <Card variant="glass-hover" className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6">
                        <div className="text-neon font-accent text-sm mb-2">{new Date(session.startTime).toLocaleTimeString([], {timeStyle: 'short'})} - {new Date(session.endTime).toLocaleTimeString([], {timeStyle: 'short'})}</div>
                        <h3 className="text-xl font-heading font-bold text-white mb-2">{session.title}</h3>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-white">Guest Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.id} className="group perspective-1000 h-80">
                      <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180 cursor-pointer">
                        <div className="absolute inset-0 backface-hidden glass rounded-xl flex flex-col items-center justify-center p-6 border-lunar/30">
                          <div className="w-24 h-24 rounded-full bg-navy border-2 border-lunar mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold bg-gradient-to-tr from-neon to-cosmic text-white">
                             {speaker.name.charAt(0)}
                          </div>
                          <h3 className="text-xl font-heading font-bold text-white text-center">{speaker.name}</h3>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card border-neon/50 rounded-xl p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                          <Star size={32} className="text-neon mb-4 shrink-0" />
                          <p className="text-white text-sm">{speaker.bio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Tickets */}
          <div className="space-y-8 relative z-20 sticky top-28">
            <Card variant="glass" className="p-6 bg-navy/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Calendar className="text-lunar mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Date & Time</h4>
                    <p className="text-silver text-sm">{new Date(event.date).toLocaleDateString()}<br/>{new Date(event.date).toLocaleTimeString([], {timeStyle: 'short'})}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="text-cosmic mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Location</h4>
                    <p className="text-silver text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="text-neon mt-1" />
                  <div>
                    <h4 className="text-white font-bold">Capacity</h4>
                    <p className="text-silver text-sm">{event.capacity} total spots</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4 pt-4">
              <h3 className="text-2xl font-heading font-bold text-white text-center mb-6">Select Ticket</h3>
              
              {/* Standard Tier */}
              <div className="glass rounded-xl p-6 relative overflow-hidden group cursor-pointer border border-border hover:border-lunar transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-white">Event Pass</h4>
                  <span className="text-2xl font-accent font-bold text-lunar">${event.price}</span>
                </div>
                <ul className="text-sm text-silver space-y-2 mb-6">
                  <li>• Full 3-day summit access</li>
                  <li>• Expo floor networking</li>
                  <li>• Digital certificate</li>
                </ul>
                <Link href={`/checkout/${id}`}>
                  <Button className="w-full" variant="outline">Select</Button>
                </Link>
              </div>

              {/* VIP Tier */}
              <div className="glass-card rounded-xl p-6 relative overflow-hidden group cursor-pointer border border-gold/40 hover:shadow-[0_0_30px_rgba(245,200,66,0.2)] transition-all">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-gold text-glow flex items-center gap-2">
                    <Star size={16} className="fill-gold" /> VIP Pass
                  </h4>
                  <span className="text-2xl font-accent font-bold text-gold">$1499</span>
                </div>
                <ul className="text-sm text-silver space-y-2 mb-6">
                  <li>• Everything in Standard</li>
                  <li>• 1-on-1 Speaker meet & greet</li>
                  <li>• Exclusive afterparty invite</li>
                </ul>
                <Link href={`/checkout/${id}`}>
                  <Button className="w-full bg-gold/10 text-gold hover:bg-gold hover:text-black border-gold">Select VIP</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
