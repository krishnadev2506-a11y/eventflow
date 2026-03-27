"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Starfield } from "@/components/3d/starfield";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (res?.error) {
        setError("Invalid email or password. Ensure you registered first.");
      } else {
        router.push("/dashboard");
        router.refresh(); // Force refresh to update navigation states
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <Card variant="glass" className="w-full max-w-md relative z-10 border-white/10 shadow-2xl backdrop-blur-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border border-neon/50 flex items-center justify-center bg-black/50 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmic to-neon animate-pulse-slow" />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-bold text-white text-glow">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your terminal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-red-400 text-sm mb-4 text-center border border-red-500/30 bg-red-500/10 p-2 rounded">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-silver">Email / Identifier</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all font-sans"
                placeholder="astral@traveler.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-silver">Security Key</label>
                <Link href="#" className="text-xs text-neon hover:underline">Forgot key?</Link>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy/50 border border-border/50 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all font-sans"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-lg mt-6" disabled={isPending}>
              {isPending ? "Authenticating..." : "Initialize Link"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-sm text-silver mt-8">
            New to the network? <Link href="/register" className="text-neon hover:underline font-medium">Request Access</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
