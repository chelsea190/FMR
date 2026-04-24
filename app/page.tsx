'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Search, MessageCircle, Heart, Sparkles, ArrowRight, User, Building2, Stethoscope } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their role-based dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'pharmacist') {
        router.push('/pharmacist/dashboard');
      } else if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show modern loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-lime-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-200/40 via-teal-200/30 to-teal-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
            <Heart className="h-12 w-12 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-lime-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-200/40 via-teal-200/30 to-teal-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-200/20 via-teal-200/20 to-lime-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>

      {/* Modern Glassmorphism Header */}
      <header className="relative z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative p-2 sm:p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-teal-400 to-lime-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                  Find Me RX
                </span>
                <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 rounded-full mt-1"></div>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <ThemeToggle />
              <Link
                href="/sign-in"
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors duration-200 hover:underline underline-offset-4 text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 mb-8 animate-fade-in-down shadow-lg">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Your Health, Our Priority
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-fade-in-up leading-tight" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent">
              Find Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 bg-clip-text text-transparent">
              Medications
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent">
              Near You
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto animate-fade-in-up leading-relaxed font-medium" style={{ animationDelay: '0.2s' }}>
            Connect with nearby pharmacies, search for medications, and get your prescriptions delivered or ready for pickup with our modern healthcare platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s'}}>
            <Link
              href="/sign-up"
              className="px-8 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-3">
                <span>Get Started Free</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/sign-in"
              className="px-8 py-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-2 border-white/20 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Modern Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-center mb-8">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-300">
                <MapPin className="h-10 w-10 text-white" />
                <div className="absolute -inset-2 bg-emerald-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Find Nearby Pharmacies
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Discover pharmacies in your area with real-time location-based search and instant availability
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.5s' }}>
            <div className="flex justify-center mb-8">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-teal-500 to-lime-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-teal-500/30 transition-all duration-300">
                <Search className="h-10 w-10 text-white" />
                <div className="absolute -inset-2 bg-teal-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Search Medications
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Quickly find the medications you need with our comprehensive, up-to-date drug database
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.6s' }}>
            <div className="flex justify-center mb-8">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-teal-500/30 transition-all duration-300">
                <MessageCircle className="h-10 w-10 text-white" />
                <div className="absolute -inset-2 bg-teal-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Real-time Chat
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Communicate directly with pharmacists and doctors for instant support and guidance
            </p>
          </div>
        </div>

        {/* Modern User Roles */}
        <div className="mt-32">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              For Everyone
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
              Tailored solutions for every healthcare professional and patient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center mb-8">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-300 mr-4">
                  <User className="h-8 w-8 text-white" />
                  <div className="absolute -inset-2 bg-emerald-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Patients
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Find medications, place orders, track deliveries, and manage your prescriptions all in one place.
              </p>
              <ul className="space-y-4">
                {[
                  'Location-based pharmacy search',
                  'Real-time drug availability',
                  'Emergency Mode access',
                  'Predictive stock alerts',
                  'Voice + multi-language support',
                  'Gamified rewards points',
                  'Offline / low-data mode'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center mb-8">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-green-500/30 transition-all duration-300 mr-4">
                  <Building2 className="h-8 w-8 text-white" />
                  <div className="absolute -inset-2 bg-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Pharmacists
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Manage your pharmacy inventory, handle orders, and communicate with customers efficiently.
              </p>
              <ul className="space-y-4">
                {[
                  'Inventory management (real-time stock)',
                  'Low-stock alerts to patients',
                  'Order processing & fulfillment',
                  'Demand insights & analytics',
                  'Gamified points for updates',
                  'Quick response & high ratings'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 group hover:scale-105 transition-all duration-500 animate-fade-in-up shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center mb-8">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-lime-600 shadow-lg group-hover:shadow-2xl group-hover:shadow-teal-500/30 transition-all duration-300 mr-4">
                  <Stethoscope className="h-8 w-8 text-white" />
                  <div className="absolute -inset-2 bg-teal-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Doctors
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Upload prescriptions, review patient requests, and approve medication orders.
              </p>
              <ul className="space-y-4">
                {[
                  'Patient complaint handling',
                  'Review medical info & requests',
                  'Issue prescriptions to associated pharmacies',
                  'Quick response & quality ratings',
                  'Secure communication & file review',
                  'Gamified rewards points'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
                <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400 transition-transform hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-teal-400 to-lime-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-700 dark:from-slate-100 dark:via-emerald-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                  Find Me RX
                </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
              &copy; 2024 Find Me RX. Revolutionizing healthcare access, one prescription at a time.
            </p>
            <div className="mt-8 flex justify-center space-x-8">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}