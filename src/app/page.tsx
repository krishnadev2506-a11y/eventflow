import { Hero } from "@/components/landing/hero";
import { FeaturedEvents } from "@/components/landing/featured-events";
import { Starfield } from "@/components/3d/starfield";
import prisma from "@/lib/prisma";

export default async function Home() {
  let liveEvents: any[] = [];
  
  try {
    const dbEvents = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    liveEvents = dbEvents.map(ev => ({
      id: ev.id,
      title: ev.title,
      date: ev.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: ev.location,
      spots: ev.capacity,
      totalSpots: ev.capacity,
      price: `₹${ev.price}`,
      category: "Featured"
    }));
  } catch (error) {
    console.error("Database connection failed during Home pre-render:", error);
    // Fallback or empty state already handled by liveEvents = []
  }

  return (
    <div className="flex flex-col w-full relative">
      <Starfield />
      <Hero />
      <FeaturedEvents liveEvents={liveEvents} />
    </div>
  );
}
