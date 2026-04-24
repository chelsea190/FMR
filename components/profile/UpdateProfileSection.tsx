'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function UpdateProfileSection() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/auth/update-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not update profile');
      await refreshUser();
      toast.success('Profile updated');
    } catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-white/85 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-2xl font-black tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Keep your account details up to date.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {['firstName','lastName','email'].map((key) => <label key={key} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{key === 'firstName' ? 'First name' : key === 'lastName' ? 'Last name' : 'Email'}<input className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950" value={(form as any)[key]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} /></label>)}
        <Button disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
      </form>
    </div>
  );
}
