import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket as TicketIcon } from "lucide-react";
import { Ticket } from "@/types/next-auth";

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  const tickets = await prisma.ticket.findMany({ 
    where: { userId: user?.id },
    include: { event: true }
  }) as unknown as Ticket[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white mb-2">My Tickets</h1>
      <p className="text-silver mb-8">Your verified digital passes to the cosmos.</p>
      
      {tickets.length === 0 ? (
         <Card variant="glass" className="bg-navy/30">
            <CardContent className="p-8 text-center text-silver font-medium">
               No tickets found in your registry.
            </CardContent>
         </Card>
      ) : tickets.map(ticket => (
        <Card key={ticket.id} variant="glass-hover" className="bg-navy/50 mb-4 border-lunar/30 hover:shadow-[0_0_20px_rgba(200,200,255,0.1)] transition-all">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 bg-neon/20 rounded-full flex items-center justify-center shrink-0">
                <TicketIcon className="text-neon" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{ticket.event?.title || "Interstellar Event"}</h3>
                <p className="text-silver text-sm mt-1">
                   <span className="text-gold uppercase font-accent text-xs tracking-widest">{ticket.ticketType}</span> 
                   {" • "}
                   <span className={ticket.checkedIn ? "text-neon" : "text-muted"}>
                     {ticket.checkedIn ? "Checked In" : "Confirmed Transit"}
                   </span>
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-border/50 pt-4 sm:pt-0">
              <p className="text-neon font-bold font-mono tracking-widest text-sm sm:text-base">{ticket.qrCode}</p>
              <p className="text-muted text-xs font-accent uppercase tracking-widest mt-1">
                {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : "TBD"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
