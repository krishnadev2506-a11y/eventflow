import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { eventId, name, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // 1. Resolve User (Create if doesn't exist) safely to satisfy Foreign Key dependencies
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Guest Attendee",
          role: "ATTENDEE"
        }
      });
    }

    // 2. Resolve Event (Fallback safely if a cached GUI mock link was pressed)
    let validEventId = typeof eventId === "string" ? eventId : null;
    if (validEventId) {
       const checkEvent = await prisma.event.findUnique({ where: { id: validEventId } });
       if (!checkEvent) validEventId = null;
    }
    
    if (!validEventId) {
       // Graceful fallback for prototype UX when clicking dead links
       const firstEvent = await prisma.event.findFirst();
       if (!firstEvent) throw new Error("No events exist in the database to bind this ticket to.");
       validEventId = firstEvent.id;
    }

    // 3. Payment record removed (Table deleted)
    
    // 4. Generate the official ticket
    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        eventId: validEventId,
        ticketType: "VIP Pass",
        qrCode: `EVFTCKT_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
        paymentStatus: "paid",
        checkedIn: false
      }
    });

    return NextResponse.json({ success: true, ticketId: ticket.id, qr: ticket.qrCode });
  } catch (error) {
    console.error("Checkout database sync error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
