'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          if (!userData.user.onboardingCompleted) {
            router.push('/onboarding');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [session, status, router]);

  if (status === 'loading' || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      {children}
    </div>
  );
}
