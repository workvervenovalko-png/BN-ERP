'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Plus, 
  ArrowRight, 
  UserPlus, 
  ShieldCheck,
  Loader2,
  BookOpen
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const UserManagementHub = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const roles = [
    {
      title: 'Students',
      description: 'Manage enrollments, attendance, and academic profiles of all students.',
      icon: GraduationCap,
      count: stats?.totalStudents ?? 0,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      href: '/students',
      actionText: 'Onboard Student',
      role: 'student'
    },
    {
      title: 'Teachers',
      description: 'Oversee faculty members, department assignments, and subject mapping.',
      icon: Users,
      count: stats?.totalTeachers ?? 0,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/teachers',
      actionText: 'Onboard Faculty',
      role: 'teacher'
    },
    {
      title: 'Controllers',
      description: 'Manage staff members with specialized system access and monitoring rights.',
      icon: UserCheck,
      count: stats?.totalControllers ?? 0,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/controllers',
      actionText: 'Add Controller',
      role: 'controller'
    },
    {
      title: 'Librarians',
      description: 'Manage library staff, book issuance rights, and inventory control access.',
      icon: BookOpen,
      count: stats?.totalLibrarians ?? 0,
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      href: '/librarians',
      actionText: 'Add Librarian',
      role: 'librarian'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Hub...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">User Management Hub</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 italic">Role-based administrative control center</p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Directory</p>
              <p className="text-xl font-black text-indigo-600 mt-1">{(stats?.totalStudents || 0) + (stats?.totalTeachers || 0) + (stats?.totalControllers || 0) + (stats?.totalLibrarians || 0)} Total Users</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50/30 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden group flex flex-col h-full">
              <div className={cn("p-8 flex flex-col flex-1", item.lightColor)}>
                <div className="flex items-start justify-between">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500", item.color)}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none mt-1">{item.count}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed mt-2">{item.description}</p>
                </div>
              </div>

              <div className="p-6 bg-white space-y-3 border-t border-gray-50">
                <Link 
                  href={item.href}
                  className={cn("w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-sm border-2", item.textColor, "border-transparent hover:border-current bg-gray-50 hover:bg-white")}
                >
                  <Users className="w-4 h-4" />
                  Manage {item.title}
                </Link>
                <Link 
                  href={item.href + '?action=add'}
                  className={cn("w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all text-white shadow-lg", item.color, "hover:opacity-90")}
                >
                  <Plus className="w-4 h-4" />
                  {item.actionText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Centralized Security & Control</h2>
                <p className="text-indigo-200 font-bold text-lg leading-relaxed max-w-md">
                   Every account created is strictly monitored. Role-wise segregation ensures that academic and administrative duties never overlap, maintaining system integrity.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Data Logs</p>
                    <p className="text-xl font-black mt-2">100% Secure</p>
                 </div>
                 <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Access Type</p>
                    <p className="text-xl font-black mt-2">RBAC Active</p>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transform translate-x-12 translate-y-12">
              <ShieldCheck className="w-96 h-96" />
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagementHub;
