'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, ArrowRight, Loader2, User, Building2, Stethoscope } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import toast from 'react-hot-toast';

const userTypes = [
  {
    id: 'patient',
    label: 'Patient',
    description: 'Find medications and manage prescriptions',
    icon: User,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'pharmacist',
    label: 'Pharmacist',
    description: 'Manage pharmacy inventory and orders',
    icon: Building2,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'doctor',
    label: 'Doctor',
    description: 'Upload prescriptions and approve orders',
    icon: Stethoscope,
    color: 'from-teal-500 to-teal-600',
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      toast.success('Account created successfully!');
      router.push('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error: any) {
      setErrors({ general: error.message });
      toast.error(error.message);
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

  const handleUserTypeSelect = (userType: string) => {
    setFormData(prev => ({ ...prev, userType }));
    if (errors.userType) {
      setErrors(prev => ({ ...prev, userType: '' }));
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

      <div className="w-full max-w-2xl relative z-10">
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
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Join our healthcare community and get started today
          </p>
        </div>

        {/* Modern Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Modern User Type Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase text-center">
                Choose Your Role
              </label>
              <div className="grid grid-cols-1 gap-4">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.userType === type.id;
                  return (
                    <label
                      key={type.id}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg ${
                        isSelected
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-lime-50/60 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-lime-950/40 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type.id}
                        checked={isSelected}
                        onChange={() => handleUserTypeSelect(type.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4">
                        <div className={`relative p-3 rounded-xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'
                            : `bg-gradient-to-br ${type.color} opacity-80 group-hover:opacity-100`
                        }`}>
                          <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg transition-colors ${
                            isSelected
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {type.label}
                          </div>
                          <div className={`text-sm leading-relaxed transition-colors ${
                            isSelected
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.userType && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1 justify-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  <span>{errors.userType}</span>
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                First Name
              </label>
              <div className="relative group">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Enter your first name"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.firstName}</span>
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Last Name
              </label>
              <div className="relative group">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Enter your last name"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.lastName}</span>
                </p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Create a password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-lime-500/0 group-focus-within:from-emerald-500/5 group-focus-within:via-teal-500/5 group-focus-within:to-lime-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{errors.confirmPassword}</span>
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
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
              <span className="px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">Already have an account?</span>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
            </div>

            <Link
              href="/sign-in"
              className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition-colors duration-200 hover:underline underline-offset-4"
            >
              <span>Sign in to your account</span>
              <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
