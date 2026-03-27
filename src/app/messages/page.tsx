"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, Send, MoreVertical, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const chats = [
  { id: 1, name: "Cosmic Summit Updates", type: "broadcast", lastMsg: "Keynote starting in 10 mins!", time: "10:50 AM", unread: 2, online: true },
  { id: 2, name: "Elena Rostova", type: "direct", lastMsg: "See you at the VR booth?", time: "09:30 AM", unread: 0, online: true },
  { id: 3, name: "Tech Enthusiasts Group", type: "group", lastMsg: "Marcus: That AI talk was mind-blowing.", time: "Yesterday", unread: 5, online: false },
  { id: 4, name: "Event Support", type: "support", lastMsg: "Your VIP pass has been upgraded.", time: "Mon", unread: 0, online: true },
];

const messages = [
  { id: 1, sender: "admin", text: "Welcome to the Cosmic Tech Summit!", time: "09:00 AM", isBroadcast: true },
  { id: 2, sender: "admin", text: "Please ensure your digital passes are ready for scanning at Hall B.", time: "09:15 AM", isBroadcast: true },
  { id: 3, sender: "admin", text: "Keynote starting in 10 mins! Make your way to the Main Stage.", time: "10:50 AM", isBroadcast: true },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [msgText, setMsgText] = useState("");

  return (
    <div className="relative min-h-screen bg-background pt-28 pb-10 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 h-screen">
      
      {/* Left Pane: Chat List */}
      <Card variant="glass" className="w-full md:w-[380px] flex flex-col h-[calc(100vh-10rem)] shrink-0 overflow-hidden bg-navy/80 backdrop-blur-xl">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Transmissions</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-black/50 border border-border/50 rounded-full pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`p-5 border-b border-border/30 cursor-pointer transition-colors flex items-center gap-4 ${activeChat.id === chat.id ? 'bg-lunar/15 shadow-[inset_4px_0_0_var(--color-lunar)]' : 'hover:bg-white/5'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${chat.type === 'broadcast' ? 'bg-gold/20 text-gold border border-gold/50 shadow-[0_0_15px_rgba(245,200,66,0.2)]' : 'bg-navy border border-lunar'}`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-neon rounded-full border-2 border-navy shadow-[0_0_8px_var(--color-neon)]" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-medium truncate ${chat.type === 'broadcast' ? 'text-gold' : 'text-white'}`}>{chat.name}</h3>
                  <span className="text-xs text-muted shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-silver truncate pr-2">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-neon text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Right Pane: Active Chat */}
      <Card variant="glass" className="flex-1 flex flex-col h-[calc(100vh-10rem)] bg-black/40 backdrop-blur-md overflow-hidden border-lunar/20 relative shadow-2xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-navy/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${activeChat.type === 'broadcast' ? 'bg-gold/20 text-gold border border-gold/50' : 'bg-navy border border-lunar'}`}>
              {activeChat.name.charAt(0)}
            </div>
            <div>
              <h2 className={`text-xl font-bold font-heading ${activeChat.type === 'broadcast' ? 'text-gold text-glow' : 'text-white'}`}>{activeChat.name}</h2>
              {activeChat.type === 'broadcast' ? (
                <p className="text-xs text-gold/70 font-accent uppercase tracking-widest mt-1">Official Organizer Announcements</p>
              ) : (
                <p className="text-xs text-neon font-accent tracking-widest mt-1">ONLINE</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-silver hover:text-white rounded-full">
            <MoreVertical size={20} />
          </Button>
        </div>

        {/* Messages Auto Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 hide-scrollbar flex flex-col">
          {activeChat.type === 'broadcast' ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex flex-col items-center w-full">
                <div className="bg-gold/10 border border-gold/40 rounded-3xl p-6 max-w-xl w-full text-center shadow-[0_0_20px_rgba(245,200,66,0.1)] backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <p className="text-gold font-medium mb-3 text-lg leading-relaxed">{msg.text}</p>
                  <span className="text-xs text-gold/60 font-accent tracking-widest block mt-4">{msg.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 my-auto">
              <div className="w-20 h-20 rounded-full bg-lunar/10 border border-lunar/30 flex items-center justify-center mb-6">
                <div className="w-10 h-10 rounded-full bg-lunar animate-pulse-slow blur-md" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">Connect with {activeChat.name}</h3>
              <p className="text-silver text-sm max-w-sm text-center leading-relaxed">No messages yet. Send an orbital transmission to start the conversation.</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeChat.type !== 'broadcast' && (
          <div className="p-5 border-t border-border/50 bg-navy/80 backdrop-blur-md relative z-10">
            <div className="flex gap-3">
              <Button variant="outline" className="shrink-0 h-12 w-12 rounded-full p-0 flex items-center justify-center border-border/50 bg-black/50 hover:bg-white/10 hover:border-silver">
                <ImageIcon size={20} className="text-silver" />
              </Button>
              <input 
                type="text" 
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setMsgText("")}
                placeholder="Transmit message..." 
                className="flex-1 bg-black/50 border border-border/50 rounded-full px-6 py-3 text-white focus:outline-none focus:border-neon focus:shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all font-sans"
              />
              <Button variant="neon" className="shrink-0 rounded-full w-12 h-12 p-0 flex items-center justify-center" onClick={() => setMsgText("")}>
                <Send size={18} className="translate-x-[-2px] translate-y-[2px]" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
