"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, MapPin, Loader2, Edit2, X, Users } from "lucide-react";
import Link from "next/link";
import { Event } from "@/types/next-auth";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{title: string, description: string, location: string, date: string, capacity: string, price: string}>({ title: "", description: "", location: "", date: "2026-11-12T09:00", capacity: "100", price: "299" });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    if (editingId) {
      await fetch(`/api/admin/events/${editingId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      setEditingId(null);
    } else {
      await fetch("/api/admin/events", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
    }
    
    setFormData({ title: "", description: "", location: "", date: "2026-11-12T09:00", capacity: "100", price: "299" });
    await fetchEvents();
    setCreating(false);
  };

  const handleEditClick = (ev: Event) => {
    setEditingId(ev.id);
    const dateStr = new Date(ev.date).toISOString().slice(0, 16);
    setFormData({ 
      title: ev.title, description: ev.description, location: ev.location, date: dateStr, 
      capacity: ev.capacity.toString(), price: ev.price.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Permanent Deletion: Are you sure you want to delete this event? This will destroy associated tickets.")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-heading font-bold text-white">Organization Events</h1>
      </div>

      {loading ? <Loader2 className="animate-spin text-neon mx-auto mt-10" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {events.length === 0 ? (
              <Card variant="glass" className="bg-navy/50 p-6 text-center text-silver font-medium">No live events hosted yet.</Card>
            ) : events.map((ev) => (
              <Card key={ev.id} variant="glass-hover" className="bg-navy/50 flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-lunar/30">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl font-heading font-bold text-white">{ev.title}</h3>
                  <p className="text-muted text-xs font-accent tracking-widest mt-1 mb-2 uppercase">{ev.capacity} SPOTS | ₹{ev.price}</p>
                  <p className="text-silver text-sm flex items-center gap-2 mt-1"><MapPin size={14}/> {ev.location}</p>
                  <p className="text-silver text-sm flex items-center gap-2 mt-1"><Calendar size={14} /> {new Date(ev.date).toLocaleDateString()} at {new Date(ev.date).toLocaleTimeString([], {timeStyle: 'short'})}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link href={`/admin/attendees?eventId=${ev.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-neon hover:text-black hover:bg-neon border-neon w-full sm:w-auto">
                      <Users size={16} className="mr-2 sm:mr-0" /> <span className="sm:hidden">Participants</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-lunar hover:text-white hover:border-lunar w-full sm:w-auto" onClick={() => handleEditClick(ev)}>
                    <Edit2 size={16} className="mr-2 sm:mr-0" /> <span className="sm:hidden">Edit Event</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 hover:border-red-400 hover:bg-red-500/10 w-full sm:w-auto" onClick={() => handleDelete(ev.id)}>
                    <Trash2 size={16} className="mr-2 sm:mr-0" /> <span className="sm:hidden">Delete Event</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <Card variant="glass" className="bg-navy/80 p-6 h-fit border-neon/30 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neon">{editingId ? "Update Existing Event" : "Create New Event"}</h3>
              {editingId && (
                <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setFormData({ title: "", description: "", location: "", date: "2026-11-12T09:00", capacity: "100", price: "299" }); }}>
                  <X size={16} /> Cancel
                </Button>
              )}
            </div>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
               <div>
                  <label className="text-xs text-silver font-accent tracking-widest uppercase">Mission Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
               </div>
               <div>
                  <label className="text-xs text-silver font-accent tracking-widest uppercase">Description</label>
                  <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 resize-none h-24 focus:border-neon transition-colors" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Location</label>
                    <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
                 </div>
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Date/Time</label>
                    <input type="datetime-local" required value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Capacity</label>
                    <input type="number" required value={formData.capacity} onChange={e=>setFormData({...formData, capacity: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
                 </div>
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Price ($)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
                 </div>
               </div>
               
               <Button type="submit" variant="neon" className="w-full h-12 mt-4 text-base font-bold" disabled={creating}>
                 {creating ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (editingId ? <><Edit2 size={18} className="mr-2 -mt-0.5"/> Save Changes</> : <><Plus size={18} className="mr-2 -mt-0.5"/> Launch Event</>)}
               </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
