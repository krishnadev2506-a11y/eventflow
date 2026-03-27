import "next-auth"

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
  }
  interface Session {
    user: User & {
      id?: string;
      role?: string;
    };
  }
}

export interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  adminId: string;
  createdAt: string;
  category?: string;
  sessions?: Session[];
  speakers?: Speaker[];
}

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  ticketType: string;
  qrCode: string;
  paymentStatus: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  event?: Event;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
