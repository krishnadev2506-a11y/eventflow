"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Ticket, CalendarClock, Heart, Bell, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Ticket, label: "My Tickets", href: "/dashboard/tickets" },
    { icon: CalendarClock, label: "History", href: "/dashboard/history" },
    { icon: Heart, label: "Saved Events", href: "/dashboard/saved" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border hidden md:flex flex-col fixed top-20 h-[calc(100vh-5rem)] z-10 transition-all">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-navy border-2 border-lunar overflow-hidden shrink-0 shadow-[0_0_10px_var(--color-lunar)] relative">
              <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" fill className="object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold font-heading truncate">Cosmic Traveler</p>
              <p className="text-xs text-silver font-accent tracking-widest mt-1">ATTENDEE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-sm font-medium group",
                  isActive 
                    ? "bg-gradient-to-r from-lunar/20 to-transparent text-lunar shadow-[inset_3px_0_0_var(--color-lunar)]" 
                    : "text-silver hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-neon drop-shadow-[0_0_8px_var(--color-neon)]" : "text-muted group-hover:text-silver")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/50">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full text-left">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cosmic/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
