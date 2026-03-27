"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Elena Rostova",
    role: "Event Organizer",
    text: "EventFlow completely changed how we manage our luxury tech summits. The Stripe integration is flawless and the QR check-in is incredibly fast.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "VIP Guest",
    text: "Booking a ticket has never felt so premium. The UI is breathtaking and the whole process was smoother than any other platform I've used.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Festival Director",
    text: "The real-time analytics and attendee tracking gave us peace of mind during our 3-day retreat. Highly recommended for serious organizers.",
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 relative z-10 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-heading font-bold text-white mb-4">What the Universe is Saying</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl relative overflow-hidden group hover:border-lunar/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic/10 rounded-full blur-3xl group-hover:bg-cosmic/20 transition-colors" />
            
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={18} className="text-gold fill-gold" />
              ))}
            </div>
            
            <p className="text-silver mb-8 text-lg italic relative z-10">&quot;{t.text}&quot;</p>
            
            <div className="flex flex-col relative z-10">
              <span className="font-heading font-bold text-white text-lg">{t.name}</span>
              <span className="text-sm text-muted uppercase tracking-widest mt-1 font-accent">{t.role}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
