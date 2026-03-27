'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card variant="glass" className="max-w-md w-full p-8 text-center border-red-500/30">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">System Interruption</h2>
        <p className="text-silver mb-8">
          The celestial uplink encountered an unexpected error. This is often due to a database connection timeout or missing environment variables.
        </p>
        
        {error.digest && (
          <div className="bg-black/40 rounded-lg p-3 mb-8 font-mono text-[10px] text-muted-foreground break-all">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            variant="primary" 
            onClick={() => reset()}
            className="w-full"
          >
            <RefreshCcw size={16} className="mr-2" /> Attempt Re-sync
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home size={16} className="mr-2" /> Return to Base
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
