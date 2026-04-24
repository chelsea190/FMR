'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LayoutDashboard, Package, FileText, Bell, User, LogOut, MessageCircle, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { User as AppUser, UserRole } from '@/types';

export default function ClientDashboardLayout({ children, user, role }: { children: React.ReactNode; user: AppUser; role: UserRole }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const base = role === 'doctor' ? '/doctor' : role === 'pharmacist' ? '/pharmacist' : '/dashboard';
  const items = role === 'doctor'
    ? [ ['Dashboard', `${base}/dashboard`, LayoutDashboard], ['Complaints', `${base}/complaints`, FileText], ['Prescriptions', `${base}/prescriptions`, FileText], ['Analytics', `${base}/analytics`, Bell], ['Profile', `${base}/profile`, User] ]
    : role === 'pharmacist'
      ? [ ['Dashboard', `${base}/dashboard`, LayoutDashboard], ['Inventory', `${base}/inventory`, Package], ['Orders', `${base}/orders`, FileText], ['Notifications', `${base}/notifications`, Bell], ['Profile', `${base}/profile`, User] ]
      : [ ['Dashboard', '/dashboard', LayoutDashboard], ['Pharmacies', '/dashboard/pharmacies', Building2], ['Orders', '/dashboard/orders', Package], ['Prescriptions', '/dashboard/prescriptions', FileText], ['Chat', '/dashboard/chat', MessageCircle], ['Profile', '/dashboard/profile', User] ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/40 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-emerald-100/80 bg-white/85 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:block">
        <Link href={base} className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20"><Heart className="h-6 w-6" /></span>
          <span className="text-xl font-black tracking-tight">FindMeRx</span>
        </Link>
        <nav className="space-y-2">
          {items.map(([label, href, Icon]: any) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900'}`}><Icon className="h-5 w-5" />{label}</Link>;
          })}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </aside>
      <main className="lg:pl-72">
        <div className="border-b border-emerald-100/80 bg-white/70 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:hidden">
          <div className="flex items-center justify-between"><span className="font-black">FindMeRx</span><span className="text-sm text-slate-500">{user?.firstName || user?.email}</span></div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
