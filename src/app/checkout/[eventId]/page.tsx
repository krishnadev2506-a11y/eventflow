"use client";

import { useState } from "react";
import { Starfield } from "@/components/3d/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { eventId } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventId, 
          amount: 1423.50, 
          name, 
          email 
        })
      });
      if(res.ok) {
        setIsSuccess(true);
      } else {
        alert("Payment database recording failed.");
      }
    } catch {
       alert("Network synchronization error.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pt-28 pb-10 px-6 max-w-6xl mx-auto w-full flex items-center justify-center">
      <Starfield />

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
          >
            {/* Event Summary */}
            <div className="space-y-6">
              <h1 className="text-3xl font-heading font-bold text-white mb-2">Complete Purchase</h1>
              <p className="text-silver mb-8">Secure your spot in the cosmos.</p>

              <Card variant="glass" className="p-6 bg-navy/80 border-lunar/30 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-border/50 pb-4">Order Summary</h3>
                <div className="flex gap-4 mb-6">
                  <div className="w-24 h-24 rounded-lg bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop')] bg-cover bg-center shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-lg">Cosmic Tech Summit</h4>
                    <p className="text-sm text-silver mt-1">Nov 12 - 14, 2026</p>
                    <p className="text-sm text-silver">San Francisco, CA</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-silver">
                    <span>VIP Pass (x1)</span>
                    <span>$1,499.00</span>
                  </div>
                  <div className="flex justify-between text-silver line-through opacity-60">
                    <span>Early Bird Discount</span>
                    <span>-$200.00</span>
                  </div>
                  <div className="flex justify-between text-silver">
                    <span>Taxes & Fees</span>
                    <span>$124.50</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-border/50">
                  <span className="font-bold text-white text-lg">Total</span>
                  <span className="font-accent font-bold text-gold text-2xl text-glow">$1,423.50</span>
                </div>
              </Card>
            </div>

            {/* Registration Confirmation Form */}
            <div className="pt-2 lg:pt-16">
              <Card variant="glass-hover" className="p-6 md:p-8 border border-neon/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[80px] pointer-events-none" />
                
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-neon" /> Confirm Registration
                </h3>

                <form onSubmit={handlePayment} className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-silver">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon transition-all mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-silver">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon transition-all mt-1"
                      />
                      <p className="text-xs text-muted mt-1">Your secure digital ticket will be generated and associated with this address immediately.</p>
                    </div>
                  </div>

                  <Button type="submit" variant="neon" className="w-full h-14 text-lg mt-8" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Lock className="animate-pulse" size={18} /> Processing Registration...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={18} /> Confirm & Complete
                      </span>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative z-10 text-center"
          >
            <div className="absolute inset-0 bg-neon/20 blur-[100px] rounded-full z-0" />
            <Card variant="glass" className="p-10 relative z-10 border-neon/50 bg-black/80 backdrop-blur-2xl text-center">
              <div className="w-24 h-24 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-neon" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2 text-glow">Payment Successful!</h2>
              <p className="text-silver mb-8">Your cosmic journey awaits. Your ticket has been sent to your email.</p>
              
              <Link href="/dashboard">
                <Button variant="outline" className="w-full h-12">Return to Dashboard</Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
