import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Event } from "@/types/next-auth";

export default async function SavedEventsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const savedEvents = await prisma.savedEvent.findMany({
    where: { userId: user?.id },
    include: { event: true },
    orderBy: { savedAt: "desc" },
  }) as unknown as { id: string, event: Event }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <Heart className="text-cosmic" size={30} />
          Saved Events
        </h1>
        <p className="text-silver">Events you&apos;ve bookmarked for later.</p>
      </div>

      {savedEvents.length === 0 ? (
        <Card variant="glass" className="bg-navy/30">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-muted" size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No saved events yet.</h3>
            <p className="text-silver text-sm mb-6">
              Browse events and hit the save button to keep track of ones you&apos;re interested in.
            </p>
            <Link href="/events">
              <Button variant="outline">Explore Events</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedEvents.map((saved) => (
            <Card key={saved.id} variant="glass-hover" className="border-border/50 hover:border-cosmic/50 transition-all group">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cosmic transition-colors">
                    {saved.event?.title || "Unknown Event"}
                  </h3>
                  <span className={`text-xs font-accent uppercase tracking-widest px-2 py-1 rounded-full border shrink-0 ${
                    saved.event?.status === "PUBLISHED"
                      ? "text-neon border-neon/50 bg-neon/10"
                      : saved.event?.status === "CANCELLED"
                      ? "text-red-400 border-red-400/50 bg-red-400/10"
                      : "text-muted border-border/50 bg-white/5"
                  }`}>
                    {saved.event?.status || "UNKNOWN"}
                  </span>
                </div>

                <p className="text-silver text-sm leading-relaxed line-clamp-2">
                  {saved.event?.description || "No description available."}
                </p>

                <div className="flex flex-col gap-2 text-sm text-silver">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neon shrink-0" />
                    <span>{saved.event?.date ? new Date(saved.event.date).toLocaleDateString("en-US", { dateStyle: "medium" }) : "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cosmic shrink-0" />
                    <span>{saved.event?.location || "TBD"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-gold font-bold text-lg">
                    {saved.event?.price === 0 ? "Free" : `₹${saved.event?.price?.toFixed(2)}`}
                  </span>
                  <Link href={`/events/${saved.event?.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      View Event <ExternalLink size={12} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
