import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    
    const tickets = await prisma.ticket.findMany({
      where: eventId ? { eventId } : {},
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        event: { select: { id: true, title: true, location: true } }
      },
      orderBy: { eventId: 'asc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { ticketId, checkedIn } = await req.json();
    
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        checkedIn: checkedIn,
        checkedInAt: checkedIn ? new Date() : null
      },
      include: { user: true }
    });

    return NextResponse.json({ success: true, checkedIn: updatedTicket.checkedIn });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
