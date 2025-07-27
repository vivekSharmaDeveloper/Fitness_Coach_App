'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* 404 Animation */}
            <div className="relative">
              <div className="text-8xl font-bold text-primary/20 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-bounce">
                  <Search className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Page Not Found</h1>
              <p className="text-muted-foreground">
                Oops! The page you're looking for seems to have wandered off on its own fitness journey.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
            </div>

            {/* Fun Message */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💪 Don't let this stop your fitness goals! Head back to your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
