import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

// GET /api/user/saved — list all saved events for the current user
export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const saved = await prisma.savedEvent.findMany({
      where: { userId: user.id },
      include: { event: true },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/user/saved — save an event { eventId }
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'eventId is required' }, { status: 400 });

    const saved = await prisma.savedEvent.upsert({
      where: { userId_eventId: { userId: user.id, eventId } },
      update: {},
      create: { userId: user.id, eventId },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/user/saved — unsave an event { eventId }
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'eventId is required' }, { status: 400 });

    await prisma.savedEvent.deleteMany({
      where: { userId: user.id, eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
