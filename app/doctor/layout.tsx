'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import ClientDashboardLayout from '@/components/layout/ClientDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace('/sign-in');
      return;
    }
    if (user.role !== 'doctor') {
      router.replace(user.role === 'pharmacist' ? '/pharmacist/dashboard' : '/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Heart className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'doctor') return null;

  return (
    <ClientDashboardLayout user={user as any} role={user.role as UserRole}>
      {children}
    </ClientDashboardLayout>
  );
}
