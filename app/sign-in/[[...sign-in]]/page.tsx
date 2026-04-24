'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-lime-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-200/40 via-teal-200/30 to-teal-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-200/20 via-teal-200/20 to-lime-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>

      {/* Modern Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="relative p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-teal-400 to-lime-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                Find Me RX
              </span>
              <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 rounded-full mt-1"></div>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Sign in to access your personalized healthcare experience
          </p>
        </div>

        {/* Modern Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>{errors.general}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center space-x-1">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
              <span className="px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Don't have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Create one now
                </Link>
              </p>
              <p className="text-slate-500 dark:text-slate-500 font-medium">
                <Link
                  href="/forgot-password"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
