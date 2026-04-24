import Link from 'next/link';
import { BadgeCheck, ArrowRight } from 'lucide-react';

export default function AuthConfirmedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/60 dark:border-slate-700/70 bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl shadow-2xl shadow-emerald-950/10 p-8 md:p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 ring-8 ring-emerald-50 dark:ring-emerald-950/30"><BadgeCheck className="h-9 w-9 text-emerald-700 dark:text-emerald-300" /></div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Email confirmed</p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-white">Your account is ready</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Your email has been confirmed. You can now sign in and continue using FindMeRx.</p>
        <Link href="/sign-in" className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700">Sign in <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </main>
  );
}
