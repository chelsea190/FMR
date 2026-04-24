import Link from 'next/link';
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';

export default function CheckEmailPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ? decodeURIComponent(searchParams.email) : 'your email address';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(135deg,#f8fafc_0%,#ecfdf5_45%,#f0fdfa_100%)] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 md:p-12">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-900/30" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-teal-200/60 blur-3xl dark:bg-teal-900/30" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 ring-8 ring-emerald-50 dark:bg-emerald-950/70 dark:ring-emerald-950/30">
              <MailCheck className="h-10 w-10 text-emerald-700 dark:text-emerald-300" />
            </div>

            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Account verification
            </p>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Verify your email to continue
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              We sent a confirmation link to <span className="font-bold text-slate-950 dark:text-white">{email}</span>. Open the email and click the confirmation button before signing in.
            </p>

            <div className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm font-bold text-slate-950 dark:text-white">Check inbox</p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Look for the FindMeRx confirmation email.</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <Sparkles className="mb-3 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm font-bold text-slate-950 dark:text-white">Confirm email</p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Click the secure link in the message.</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <ArrowRight className="mb-3 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm font-bold text-slate-950 dark:text-white">Sign in</p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">After verification, come back and log in.</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white/70 p-4 text-left dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-sm font-bold text-slate-950 dark:text-white">Didn’t receive the email?</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Check spam or promotions first. If it is still missing, wait a minute and try creating the account again with the same email.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700">
                I have verified, sign in <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sign-up" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Use another email
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
