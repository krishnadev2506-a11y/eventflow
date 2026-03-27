"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function Navbar({ session }: { session?: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events Directory", href: "/events" },
  ];

  if (pathname.startsWith("/event-day")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmic to-neon animate-pulse-slow shadow-[0_0_15px_var(--color-neon)]" />
          <span className="font-heading font-bold text-2xl tracking-wide text-white group-hover:text-glow transition-all">
            EventFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neon",
                    pathname === link.href ? "text-white" : "text-muted"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 border-l border-border/50 pl-8">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-silver text-sm hidden sm:inline">Orbit: <span className="text-neon font-bold">{session.user.name?.split(' ')[0]}</span></span>
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button onClick={() => signOut({ callbackUrl: '/' })} variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 hover:text-red-300">Logout</Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-20 left-0 right-0 border-b border-border p-6 flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg font-medium text-white hover:text-neon"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 pt-4 border-t border-border">
            {session?.user ? (
              <>
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard ({session.user.name?.split(' ')[0]})</Button>
                </Link>
                <Button onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }} variant="ghost" className="w-full text-red-400 hover:bg-red-500/10">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
