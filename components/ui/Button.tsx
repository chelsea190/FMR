import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-700/20',
    secondary: 'bg-white hover:bg-emerald-50 text-slate-900 border border-emerald-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-emerald-50 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
  } as const;

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
