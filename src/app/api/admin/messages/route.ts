import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, eventId, userId } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Missing title or message." }, { status: 400 });
    }

    // --- Direct Message to a single user ---
    if (userId) {
      await prisma.notification.create({
        data: { userId, title, message, isRead: false }
      });
      return NextResponse.json({ success: true, count: 1 });
    }

    // --- Broadcast to all attendees of an event ---
    if (!eventId) {
      return NextResponse.json({ error: "Provide either userId or eventId." }, { status: 400 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { eventId },
      select: { userId: true }
    });

    if (tickets.length === 0) {
      return NextResponse.json({ error: "No participants registered for this event." }, { status: 404 });
    }

    const uniqueUserIds = [...new Set(tickets.map(t => t.userId))];

    const notifications = await prisma.notification.createMany({
      data: uniqueUserIds.map(uid => ({
        userId: uid,
        title,
        message,
        isRead: false
      }))
    });

    return NextResponse.json({ success: true, count: notifications.count });
  } catch (error) {
    console.error("Message error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
