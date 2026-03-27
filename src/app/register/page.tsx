"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Starfield } from "@/components/3d/starfield";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to register");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-background">
      <Starfield />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cosmic/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-neon/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <Card variant="glass" className="w-full max-w-md relative z-10 border-white/10 shadow-2xl backdrop-blur-2xl mt-12 mb-12">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-heading font-bold text-white text-glow">Join the Cosmos</CardTitle>
          <CardDescription>Create your account and unlock exclusive experiences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="text-red-400 text-sm mb-4 text-center border border-red-500/30 bg-red-500/10 p-2 rounded">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-navy/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all"
                placeholder="Neil Armstrong"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all"
                placeholder="astral@traveler.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-lg mt-6" disabled={isPending}>
              {isPending ? "Creating Account..." : "Sign Up"} <UserPlus className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-sm text-silver mt-8">
            Already have an account? <Link href="/login" className="text-neon hover:underline">Log In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
