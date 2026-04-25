'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Heart,
  LayoutDashboard,
  Package,
  FileText,
  Bell,
  User,
  LogOut,
  MessageCircle,
  Building2,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { User as AppUser, UserRole } from '@/types';

export default function ClientDashboardLayout({
  children,
  user,
  role,
}: {
  children: React.ReactNode;
  user: AppUser;
  role: UserRole;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const base = role === 'doctor' ? '/doctor' : role === 'pharmacist' ? '/pharmacist' : '/dashboard';
  const items = role === 'doctor'
    ? [
        ['Dashboard', `${base}/dashboard`, LayoutDashboard],
        ['Complaints', `${base}/complaints`, FileText],
        ['Prescriptions', `${base}/prescriptions`, FileText],
        ['Analytics', `${base}/analytics`, Bell],
        ['Profile', `${base}/profile`, User],
      ]
    : role === 'pharmacist'
      ? [
          ['Dashboard', `${base}/dashboard`, LayoutDashboard],
          ['Inventory', `${base}/inventory`, Package],
          ['Orders', `${base}/orders`, FileText],
          ['Notifications', `${base}/notifications`, Bell],
          ['Profile', `${base}/profile`, User],
        ]
      : [
          ['Dashboard', '/dashboard', LayoutDashboard],
          ['Pharmacies', '/dashboard/pharmacies', Building2],
          ['Orders', '/dashboard/orders', Package],
          ['Prescriptions', '/dashboard/prescriptions', FileText],
          ['Chat', '/dashboard/chat', MessageCircle],
          ['Profile', '/dashboard/profile', User],
        ];

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <>
      <Link href={base} className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20">
          <Heart className="h-6 w-6" />
        </span>
        <span className="text-xl font-black tracking-tight">FindMeRx</span>
      </Link>

      <nav className="space-y-2">
        {items.map(([label, href, Icon]: any) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <LogOut className="h-5 w-5" /> Sign out
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/40 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-emerald-100/80 bg-white/85 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!sidebarOpen}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[min(18rem,85vw)] border-r border-emerald-100 bg-white p-5 shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent />
        </aside>
      </div>

      <main className="lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Open sidebar menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-white text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-300"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link
              href={base}
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
                <Heart className="h-5 w-5" />
              </span>
              <span className="font-black tracking-tight">FindMeRx</span>
            </Link>

            <span className="max-w-[35vw] truncate text-right text-xs font-medium text-slate-500 dark:text-slate-400">
              {user?.firstName || user?.email}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
