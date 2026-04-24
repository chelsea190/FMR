import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  // In a real app, you'd check the user's role from auth context
  // For now, we'll use a default role or get it from query params
  // This is a simplified version - you'd want to use a proper auth context
  return <DashboardLayout>{children}</DashboardLayout>;
}
