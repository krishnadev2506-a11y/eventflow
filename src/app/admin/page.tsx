import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar as CalendarIcon, Activity } from "lucide-react";

export default async function AdminOverview() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const totalEvents = await prisma.event.count();
  const totalAttendees = await prisma.user.count({ where: { role: "ATTENDEE" } });
  
  // Calculate total internal revenue via Tickets dynamically without Stripe
  const allTickets = await prisma.ticket.findMany({
    include: { event: { select: { price: true } } }
  });
  const totalRevenue = allTickets.reduce((sum, ticket) => sum + (ticket.event?.price || 0), 0);

  const recentRegistrations = await prisma.ticket.findMany({
     take: 5,
     orderBy: { id: 'desc' },
     include: { 
        user: { select: { name: true, email: true } },
        event: { select: { title: true, price: true } }
     }
  });

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 text-glow">Command Center</h1>
          <p className="text-silver">Live database aggregation and system telemetry.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-left md:text-right">
             <div className="text-[10px] text-neon font-accent tracking-widest mb-1 uppercase">Database Sync</div>
             <div className="flex items-center gap-2 md:justify-end">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_8px_var(--color-neon)]" />
                <span className="text-sm text-white font-medium">REAL-TIME</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="bg-navy/50 border-border/50 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-silver">Total Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neon" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white text-glow">₹{totalRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs mt-1 text-neon">Native Platform Payments</p>
          </CardContent>
        </Card>

        <Card variant="default" className="bg-navy/50 border-border/50 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-silver">Registered Attendees</CardTitle>
            <Users className="h-4 w-4 text-lunar" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalAttendees}</div>
            <p className="text-xs mt-1 text-lunar">Verified DB Users</p>
          </CardContent>
        </Card>

        <Card variant="default" className="bg-navy/50 border-border/50 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-silver">Hosted Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-cosmic" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalEvents}</div>
            <p className="text-xs mt-1 text-cosmic">Active Directories</p>
          </CardContent>
        </Card>

        <Card variant="default" className="bg-navy/50 border-border/50 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-silver">Database Schema</CardTitle>
            <Activity className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">Prisma</div>
            <p className="text-xs mt-1 text-gold">Relational Synced</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card variant="default" className="bg-navy/50 border-border/50 p-6 h-full shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-heading font-medium text-white mb-6 flex items-center gap-2">
               <Activity size={18} className="text-lunar" /> System Activity Telemetry
            </h3>
            <div className="w-full flex items-center justify-center h-64 border border-white/5 rounded-lg bg-black/30">
                <p className="text-silver text-sm font-accent tracking-widest uppercase">Chart Visualization Module Offline</p>
            </div>
          </Card>
        </div>

        <div>
          <Card variant="default" className="bg-navy/50 border-border/50 p-6 h-full shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-heading font-medium text-white mb-6 border-b border-white/10 pb-4">Recent Network Registrations</h3>
              <div className="space-y-4">
                {recentRegistrations.length === 0 ? (
                  <p className="text-muted text-sm italic">No recent ticket transactions.</p>
                ) : recentRegistrations.map((tkt, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/30 pb-4 last:border-0 last:pb-0 gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{tkt.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-silver truncate max-w-[150px]">{tkt.event?.title || "Deleted Event"}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-neon">₹{tkt.event?.price || 0}</p>
                      <p className="text-[10px] flex items-center gap-1 text-neon uppercase font-accent tracking-widest">
                         <span className="w-1.5 h-1.5 bg-neon rounded-full" /> SUCCESS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
