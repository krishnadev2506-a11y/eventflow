"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, ChevronDown, Mail, CreditCard, QrCode, Box, Send } from "lucide-react";
import { Ticket } from "@/types/next-auth";

export default function AdminAttendeesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);
  // Individual DM state
  const [dmTarget, setDmTarget] = useState<{ userId: string; name: string } | null>(null);
  const [dmData, setDmData] = useState({ title: '', message: '' });
  const [dmSending, setDmSending] = useState(false);

  useEffect(() => { fetchAttendees(); }, []);

  const fetchAttendees = async () => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const eventIdFilter = params.get('eventId');
      if (eventIdFilter) setSelectedEventId(eventIdFilter);

      const res = await fetch("/api/admin/attendees");
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to fetch attendees");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEventId === "ALL") return alert("Please select a specific event first.");
    setSending(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedEventId, ...messageData })
      });
      const data = await res.json();
      if(res.ok) {
         alert(`Successfully sent message to ${data.count} attendees.`);
         setShowMessageModal(false);
         setMessageData({title: '', message: ''});
      } else alert(data.error || "Failed to send message.");
    } catch {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmTarget) return;
    setDmSending(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: dmTarget.userId, ...dmData })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Message sent to ${dmTarget.name}.`);
        setDmTarget(null);
        setDmData({ title: '', message: '' });
      } else alert(data.error || "Failed to send.");
    } catch {
      alert("Failed to send message.");
    } finally {
      setDmSending(false);
    }
  };

  const toggleCheckIn = async (ticketId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/admin/attendees", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, checkedIn: !currentStatus })
      });
      if(res.ok) { fetchAttendees(); }
    } catch {
      alert("Failed to log attendance presence.");
    }
  };

  const uniqueEvents = Array.from(new Set(tickets.map(t => t.event?.id)))
    .filter(Boolean)
    .map(id => {
      const t = tickets.find(t => t.event?.id === id);
      return { id: id as string, title: t?.event?.title || "Unknown" };
    });

  const displayedTickets = selectedEventId === "ALL" 
    ? tickets 
    : tickets.filter(t => t.event?.id === selectedEventId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Attendee Manifest</h1>
          <p className="text-silver text-sm mt-1">Track participant data and mark physical presence instantly.</p>
        </div>
        
        <div className="w-full sm:w-80 shrink-0">
           <label className="text-[10px] font-accent text-neon uppercase tracking-widest block mb-1 pl-1">Sort & Filter Feed</label>
           <div className="relative">
             <select 
               value={selectedEventId}
               onChange={(e) => setSelectedEventId(e.target.value)}
               className="w-full bg-black/80 border border-border/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-neon cursor-pointer appearance-none transition-all shadow-[0_5px_15px_rgba(0,0,0,0.5)] font-medium text-sm"
             >
               <option value="ALL">-- Show All Cross-Event Attendees --</option>
               {uniqueEvents.map(ev => (
                 <option key={ev.id} value={ev.id}>{ev.title}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
           </div>
           
           <div className="flex gap-2 mt-4">
               <Button variant="outline" size="sm" onClick={() => setShowMessageModal(true)} disabled={selectedEventId === 'ALL'} className="w-full border-neon/50 text-neon hover:bg-neon/10 hover:border-neon transition-colors"><Mail size={16} className="mr-2"/> Broadcast Message Notification</Button>
           </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <Card variant="glass" className="bg-navy border-neon/50 p-6 max-w-md w-full animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-bold text-neon mb-1">Broadcast Message</h2>
              <p className="text-silver text-xs mb-4">Sends to all participants of the selected event.</p>
              <form onSubmit={handleSendMessage} className="space-y-4">
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Message Title</label>
                    <input required value={messageData.title} onChange={e=>setMessageData({...messageData, title: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors" />
                 </div>
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Content</label>
                    <textarea required rows={4} value={messageData.message} onChange={e=>setMessageData({...messageData, message: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-neon transition-colors resize-none" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setShowMessageModal(false)}>Cancel</Button>
                    <Button type="submit" variant="neon" className="w-1/2" disabled={sending}>{sending ? <Loader2 className="animate-spin text-black mx-auto" /> : "Send Broadcast"}</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {/* Individual DM Modal */}
      {dmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <Card variant="glass" className="bg-navy border-cosmic/50 p-6 max-w-md w-full animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-bold text-lunar mb-1">Message <span className="text-neon">{dmTarget.name}</span></h2>
              <p className="text-silver text-xs mb-4">This message will only be sent to this attendee.</p>
              <form onSubmit={handleSendDM} className="space-y-4">
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Subject</label>
                    <input required value={dmData.title} onChange={e=>setDmData({...dmData, title: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-cosmic transition-colors" />
                 </div>
                 <div>
                    <label className="text-xs text-silver font-accent tracking-widest uppercase">Message</label>
                    <textarea required rows={4} value={dmData.message} onChange={e=>setDmData({...dmData, message: e.target.value})} className="w-full bg-black/50 border border-border/50 rounded px-4 py-3 text-white outline-none mt-1 focus:border-cosmic transition-colors resize-none" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setDmTarget(null)}>Cancel</Button>
                    <Button type="submit" className="w-1/2 bg-cosmic/80 text-white hover:bg-cosmic border-cosmic" disabled={dmSending}>{dmSending ? <Loader2 className="animate-spin mx-auto" /> : <><Send size={14} className="mr-2" /> Send</>}</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {loading ? <Loader2 className="animate-spin text-neon mx-auto mt-10" /> : (
        <div className="space-y-4">
          {displayedTickets.length === 0 ? (
            <Card variant="glass" className="bg-navy/50 p-6 text-center text-silver font-medium mt-8">No active participants found in the registry.</Card>
          ) : displayedTickets.map((ticket) => (
            <Card key={ticket.id} variant="glass-hover" className={`overflow-hidden cursor-pointer border transition-all ${expandedId === ticket.id ? 'bg-navy border-neon/50 shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'bg-navy/80 border-border/50 hover:bg-navy/90'}`} onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}>
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg text-white ${ticket.checkedIn ? 'bg-neon/20 border-neon shadow-[0_0_10px_var(--color-neon)]' : 'bg-black border-lunar'}`}>
                    {ticket.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{ticket.user?.name || "Anonymous Guest"}</h3>
                    <p className="text-silver text-sm font-accent tracking-widest">{ticket.event?.title || "Unknown Terminal"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-6">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-muted font-accent uppercase">Pass Type</div>
                      <div className="text-gold font-bold">{ticket.ticketType}</div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-cosmic/50 text-cosmic hover:bg-cosmic/10"
                      onClick={(e) => { e.stopPropagation(); if (ticket.user?.id) setDmTarget({ userId: ticket.user.id, name: ticket.user.name || 'Attendee' }); }}
                    >
                      <Send size={14} />
                    </Button>

                    <Button 
                      variant={ticket.checkedIn ? "outline" : "primary"} 
                      size="sm" 
                      className={`shrink-0 ${ticket.checkedIn ? "border-neon text-neon hover:bg-neon/10" : ""}`}
                      onClick={(e) => toggleCheckIn(ticket.id, ticket.checkedIn, e)}
                    >
                       {ticket.checkedIn ? <UserCheck size={16} className="mr-0 sm:mr-2"/> : <Box size={16} className="mr-0 sm:mr-2"/>}
                       <span className="hidden sm:inline">{ticket.checkedIn ? "Checked In" : "Mark Present"}</span>
                    </Button>

                    <ChevronDown className={`text-muted transition-transform ${expandedId === ticket.id ? "rotate-180" : ""}`} size={20} />
                </div>
              </div>

              {expandedId === ticket.id && (
                <div className="border-t border-neon/20 bg-black/60 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                  <div>
                    <span className="text-xs text-silver font-accent uppercase tracking-widest flex items-center gap-2 mb-1"><Mail size={12}/> Direct Comms</span>
                    <p className="text-white font-medium">{ticket.user?.email || "No email on record"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-silver font-accent uppercase tracking-widest flex items-center gap-2 mb-1"><CreditCard size={12}/> Transaction State</span>
                    <p className="text-neon font-medium capitalize">{ticket.paymentStatus}</p>
                  </div>
                  <div>
                     <span className="text-xs text-silver font-accent uppercase tracking-widest flex items-center gap-2 mb-1"><QrCode size={12}/> Registry Reference ID</span>
                     <p className="text-white font-medium truncate font-mono text-sm opacity-80">{ticket.qrCode}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
