"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Users, CalendarDays, LogOut, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Command Center", href: "/admin" },
    { icon: CalendarDays, label: "Manage Events", href: "/admin/events" },
    { icon: Users, label: "Attendees", href: "/admin/attendees" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-black border-r border-border/50 hidden md:flex flex-col fixed top-20 h-[calc(100vh-5rem)] z-20">
        <div className="p-6 pb-4 border-b border-border/50">
          <div className="inline-block px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-accent tracking-widest uppercase">Admin Terminal</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                  isActive 
                    ? "bg-neon/10 text-neon shadow-[inset_3px_0_0_var(--color-neon)]" 
                    : "text-silver hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} className={isActive ? "text-neon drop-shadow-[0_0_8px_var(--color-neon)]" : "text-muted"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/50 bg-black/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-navy border border-neon overflow-hidden relative">
               <Image src="https://i.pravatar.cc/150?u=admin" alt="Admin" fill className="object-cover" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">System Admin</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left">
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative bg-background min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy/30 via-background to-background pointer-events-none" />
        <div className="relative z-10 p-6 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
