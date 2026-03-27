"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/messages")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/user/messages/${id}`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => fetch(`/api/user/messages/${n.id}`, { method: "PATCH" })));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="text-neon" size={30} />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-neon text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-silver">Your incoming transmissions from mission control.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2 shrink-0">
            <CheckCheck size={16} />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card variant="glass" className="bg-navy/30">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Mail className="text-muted" size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No transmissions received.</h3>
            <p className="text-silver text-sm">You&apos;re all caught up! Mission control is quiet for now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              variant="glass"
              className={cn(
                "border transition-all cursor-pointer group",
                notif.isRead
                  ? "border-border/30 bg-navy/20 opacity-70"
                  : "border-neon/30 bg-neon/5 shadow-[0_0_15px_rgba(0,245,255,0.05)]"
              )}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div
                  className={cn(
                    "mt-1 w-2.5 h-2.5 rounded-full shrink-0",
                    notif.isRead ? "bg-muted" : "bg-neon shadow-[0_0_6px_var(--color-neon)] animate-pulse"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn("font-bold text-sm", notif.isRead ? "text-silver" : "text-white")}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-muted font-accent shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <p className="text-silver text-sm mt-1 leading-relaxed">{notif.message}</p>
                  {!notif.isRead && (
                    <p className="text-neon text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to mark as read
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
