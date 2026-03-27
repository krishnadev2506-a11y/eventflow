"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Send, Mail, Loader2, CheckCheck, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    message: ""
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/user/messages").then(res => res.json()),
      fetch("/api/admin/events").then(res => res.json())
    ]).then(([notifs, evs]) => {
      setNotifications(Array.isArray(notifs) ? notifs : []);
      setEvents(Array.isArray(evs) ? evs : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventId || !formData.title || !formData.message) {
      return alert("Please fill in all fields.");
    }
    
    setSending(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: formData.eventId,
          title: formData.title,
          message: formData.message
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully broadcasted message to ${data.count} attendees.`);
        setFormData({ eventId: "", title: "", message: "" });
      } else {
        alert(data.error || "Failed to send broadcast.");
      }
    } catch {
      alert("Failed to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/user/messages/${id}`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="text-neon" size={30} />
            Notifications & Broadcasts
          </h1>
          <p className="text-silver">Manage system-wide transmissions and private alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Form */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="bg-navy/80 p-6 border-neon/30 sticky top-24">
            <h3 className="text-xl font-bold text-neon mb-6 flex items-center gap-2">
              <Megaphone size={20} /> Event Broadcast
            </h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-accent tracking-widest text-silver uppercase mb-2">Target Event</label>
                <select 
                  className="w-full bg-black/50 border border-border/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  value={formData.eventId}
                  onChange={(e) => setFormData({...formData, eventId: e.target.value})}
                  required
                >
                  <option value="">Select an Event...</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-accent tracking-widest text-silver uppercase mb-2">Message Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Schedule Update"
                  className="w-full bg-black/50 border border-border/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-accent tracking-widest text-silver uppercase mb-2">Message Body</label>
                <textarea 
                  rows={4}
                  placeholder="Enter broadcast details..."
                  className="w-full bg-black/50 border border-border/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                variant="neon" 
                className="w-full py-6 text-lg font-bold"
                disabled={sending}
              >
                {sending ? <Loader2 className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
                {sending ? "TRANSMITTING..." : "SEND BROADCAST"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Received Notifications */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="text-lunar" size={24} /> Received Transmissions
              {unreadCount > 0 && (
                <span className="ml-2 bg-neon text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} NEW
                </span>
              )}
            </h2>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <Card variant="glass" className="bg-navy/30 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-muted" size={32} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No transmissions received.</h3>
                <p className="text-silver text-sm">System terminal is currently silent.</p>
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
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1",
                        notif.isRead ? "bg-white/5 text-muted" : "bg-neon/20 text-neon"
                      )}>
                        <Bell size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("font-bold text-lg", notif.isRead ? "text-silver" : "text-white")}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-muted font-accent uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={cn("text-sm leading-relaxed", notif.isRead ? "text-muted" : "text-silver")}>
                          {notif.message}
                        </p>
                        {!notif.isRead && (
                          <div className="mt-3 flex items-center gap-1 text-[10px] text-neon font-bold uppercase tracking-widest">
                            <CheckCheck size={12} /> Mark as read
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
