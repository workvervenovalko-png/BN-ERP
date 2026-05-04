'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="p-10 flex-grow animate-in fade-in duration-700">
            {children}
          </main>

          <footer className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center bg-white/50 backdrop-blur-sm border-t border-gray-100 gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span>© 2026 {process.env.NEXT_PUBLIC_APP_NAME} LUCKNOW • ERP CORE v2.0</span>
              <a href="https://www.vervenovatech.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline transition-all">
                Developed by Verve Nova Technologies
              </a>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> System Optimized</span>
              <span className="opacity-50">Support: admin@bncet.ac.in</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
