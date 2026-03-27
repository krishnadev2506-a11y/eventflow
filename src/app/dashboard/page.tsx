import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket } from "@/types/next-auth";
import Image from "next/image";

export default async function DashboardOverview() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  const tickets = await prisma.ticket.findMany({ 
    where: { userId: user?.id },
    include: { event: true },
    orderBy: { eventId: 'desc' }
  }) as unknown as Ticket[];

  const messages = await prisma.notification.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' }
  });

  const nextTicket = tickets[0]; // Get the most recent ticket

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 text-glow">
          Welcome to your Orbit, {session.user.name?.split(' ')[0] || 'Traveler'}
        </h1>
        <p className="text-silver text-lg">Here&apos;s a dynamic overview of your cosmic journey.</p>
      </div>

      {user?.role === "ADMIN" && (
        <Card variant="glass" className="bg-neon/10 border-neon/50 mt-8 mb-4 shadow-[0_0_30px_rgba(0,245,255,0.15)]">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-neon animate-pulse" /> System Administrator Detected
              </h2>
              <p className="text-silver text-sm mt-1">You have root privileges to modify all organization event data and manage attendee manifests.</p>
            </div>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button variant="neon" className="w-full sm:w-auto">Launch Command Center</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
          <Card variant="glass" className="bg-lunar/5 border-lunar/30 hover:bg-lunar/10 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-silver text-xs font-accent tracking-widest mb-2">UPCOMING EVENTS</h3>
              <p className="text-5xl font-bold text-white text-glow">{tickets.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "200ms" }}>
          <Card variant="glass" className="bg-cosmic/5 border-cosmic/30 hover:bg-cosmic/10 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-silver text-xs font-accent tracking-widest mb-2">PAST TRANSITS</h3>
              <p className="text-5xl font-bold text-white text-glow">0</p>
            </CardContent>
          </Card>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "300ms" }}>
          <Card variant="glass" className="bg-neon/5 border-neon/30 hover:bg-neon/10 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-silver text-xs font-accent tracking-widest mb-2">MEMBERSHIP</h3>
              <p className="text-3xl font-bold text-gold text-glow mt-2 uppercase">{user?.role || "ATTENDEE"}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "400ms" }}>
        <h2 className="text-2xl font-heading font-bold text-white">Next Destination</h2>
        
        {nextTicket ? (
          <Card variant="glass-hover" className="border border-border/50">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="md:w-1/3 h-56 md:h-auto shrink-0 border-b md:border-b-0 md:border-r border-border/50 relative overflow-hidden">
                 <Image 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop"
                    alt="Event"
                    fill
                    className="object-cover opacity-40 z-0"
                 />
                 <div className="absolute inset-0 bg-navy/40 backdrop-blur-[1px]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80 md:hidden" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-white leading-tight">{nextTicket.event?.title || "Global Interstellar Event"}</h3>
                    <div className="bg-lunar/20 text-lunar px-3 py-1 rounded-full text-xs font-accent border border-lunar/50 uppercase tracking-widest shrink-0">
                       {nextTicket.ticketType}
                    </div>
                  </div>
                  <p className="text-silver mb-8 leading-relaxed max-w-2xl">{nextTicket.event?.description || "Prepare for your journey into the unknown."}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="flex items-center gap-3 text-silver text-sm">
                      <Calendar size={18} className="text-neon" />
                      <span>{nextTicket.event?.date ? new Date(nextTicket.event.date).toLocaleDateString() : "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-silver text-sm">
                      <MapPin size={18} className="text-cosmic" />
                      <span>{nextTicket.event?.location || "Unknown"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
                  <Link href="/dashboard/tickets">
                     <Button variant="neon" size="sm" className="w-full sm:w-auto">
                       View My Ticket
                     </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass" className="bg-navy/30 p-10 text-center flex flex-col items-center justify-center">
             <MapPin size={48} className="text-muted mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">No active missions scheduled.</h3>
             <p className="text-silver mb-6">You currently aren&apos;t booked for any planetary events.</p>
             <Link href="/events"><Button variant="outline">Explore Events Directory</Button></Link>
          </Card>
        )}
      </div>

      <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "500ms" }}>
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2"><Mail className="text-neon" size={24}/> Mission Comms</h2>
          <Card variant="glass" className="border-border/50 max-h-[400px] overflow-y-auto w-full md:w-2/3 lg:w-1/2 mx-auto md:mx-0">
             <CardContent className="p-0">
               {messages.length === 0 ? (
                 <div className="p-8 text-center text-silver">No incoming transmissions.</div>
               ) : (
                 <div className="divide-y divide-border/30">
                   {messages.map((msg) => (
                     <div key={msg.id} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-neon text-sm">{msg.title}</h4>
                           <span className="text-xs text-muted font-accent">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-silver text-sm">{msg.message}</p>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
