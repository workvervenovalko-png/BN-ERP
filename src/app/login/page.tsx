'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, GraduationCap, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import api from '@/lib/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.token, response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Side: Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[#4f46e5] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/20 p-2">
               <img 
                src={process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png"} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const icon = document.createElement('div');
                    icon.className = 'text-indigo-600 font-black text-xl';
                    icon.innerText = 'B';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">{process.env.NEXT_PUBLIC_APP_NAME || 'BNCET'}</span>
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-1">Institutional Portal</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              Next-Gen Academic Engine
            </div>
            <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter max-w-lg">
              {process.env.NEXT_PUBLIC_COLLEGE_NAME || 'B.N. College Of Engineering & Technology'}
            </h1>
            <p className="text-indigo-100 text-lg max-w-md font-medium leading-relaxed opacity-90">
              Centralized intelligence for the modern campus. Empowering students, faculty, and administrators with a unified data ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="p-5 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <ShieldCheck className="w-6 h-6 text-indigo-200 mb-2" />
              <p className="text-white font-black text-sm">Secure Access</p>
              <p className="text-indigo-200 text-[10px] font-medium leading-tight mt-1">Multi-layer RBAC authentication system.</p>
            </div>
            <div className="p-5 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <Loader2 className="w-6 h-6 text-indigo-200 mb-2" />
              <p className="text-white font-black text-sm">Real-time Data</p>
              <p className="text-indigo-200 text-[10px] font-medium leading-tight mt-1">Live monitoring and instant notifications.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-indigo-200 text-[10px] font-black uppercase tracking-widest pt-8 border-t border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex gap-4">
              <span>© 2026 {process.env.NEXT_PUBLIC_APP_NAME}</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <a href="https://www.vervenovatech.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              Developed by Verve Nova Technologies
            </a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>

      {/* Right Side: Login Component */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-indigo-100">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain invert brightness-0" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Account Login</h2>
            <p className="text-gray-500 font-bold text-xs tracking-tight italic">Access your institutional workspace securely.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-600" htmlFor="email">
                  Identifier (Email or Roll No)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-all" />
                  <input
                    id="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-bold"
                    placeholder="e.g. admin@college.edu"
                  />
                </div>
              </div>

              <div className="group space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600" htmlFor="password">
                    Security Key
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-all" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-bold"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border-2 border-red-100 rounded-xl text-[10px] text-red-600 font-black uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shrink-0"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] leading-relaxed">
              If you face any issues, please{' '}
              <Link href="/support" className="text-indigo-600 hover:underline transition-all">
                contact the Administration
              </Link>. <br />
              <span className="text-gray-900 mt-1 block opacity-40">System monitored by Digital Governance Cell.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
