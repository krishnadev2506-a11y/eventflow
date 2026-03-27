import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white mb-2">User Settings</h1>
      <p className="text-silver mb-8">Manage your account and preferences dynamically.</p>
      
      <Card variant="glass" className="bg-navy/50 max-w-2xl">
         <CardHeader>
           <CardTitle className="text-white flex items-center gap-2"><User size={20} className="text-neon" /> Personal Information</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div>
              <label className="text-xs text-silver font-accent tracking-widest uppercase">Display Name</label>
              <input type="text" defaultValue={session.user.name || "Anonymous Traveler"} className="w-full bg-black/50 border border-border/50 rounded-md px-4 py-2 text-white outline-none mt-1 focus:border-neon transition-colors" />
           </div>
           <div>
              <label className="text-xs text-silver font-accent tracking-widest uppercase">Email Address (Registry Bound)</label>
              <input type="email" defaultValue={session.user.email} disabled className="w-full bg-black/30 border border-border/50 rounded-md px-4 py-2 text-muted mt-1 cursor-not-allowed opacity-70" />
           </div>
           <Button variant="outline" className="mt-2 text-neon border-neon/30 hover:bg-neon/10">Synchronize Profile</Button>
         </CardContent>
      </Card>
      
      <Card variant="glass" className="bg-navy/50 max-w-2xl">
         <CardHeader>
           <CardTitle className="text-white flex items-center gap-2"><Bell size={20} className="text-neon" /> Notification Architecture</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
              <div>
                 <p className="text-white font-medium text-sm">Email Transmissions</p>
                 <p className="text-silver text-xs mt-1">Receive automated trajectory data and physical event boarding passes.</p>
              </div>
              <div className="w-10 h-5 bg-neon/30 rounded-full relative cursor-pointer border border-neon/50 shrink-0">
                 <div className="w-5 h-5 bg-neon rounded-full absolute right-0 scale-110 shadow-[0_0_8px_var(--color-neon)]" />
              </div>
           </div>
         </CardContent>
      </Card>
    </div>
  );
}
