"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white mb-2">Transit History</h1>
      <p className="text-silver mb-8">Events you&apos;ve attended in the past.</p>
      
      <Card variant="glass" className="bg-navy/30">
        <CardContent className="p-6 flex items-center gap-4 text-center justify-center py-12">
          <div className="flex flex-col items-center max-w-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
               <Clock className="text-muted" size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No past history found.</h3>
            <p className="text-silver text-sm">Once you attend an event, it will be securely logged here for your records.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
