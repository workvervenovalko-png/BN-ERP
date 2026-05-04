'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, GraduationCap, BookOpen, 
  Wallet, TrendingUp, Bell, Sparkles, 
  ArrowRight, Calendar, UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;
        let endpoint = '/users/admin/stats';
        if (user.role === 'teacher') endpoint = '/users/teacher/stats';
        if (user.role === 'student') endpoint = '/users/student/stats';
        
        const res = await api.get(endpoint);
        setDashboardData(res.data.stats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  let stats = [
    { label: 'Total Students', value: dashboardData?.totalStudents || '0', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Faculty', value: dashboardData?.totalTeachers || '0', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Fees', value: `₹${(dashboardData?.totalFees || 0).toLocaleString()}`, icon: Wallet, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Avg Attendance', value: `${dashboardData?.avgAttendance || 0}%`, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (user?.role === 'teacher') {
    stats = [
      { label: 'Attendance Rate', value: `${dashboardData?.attendanceRate || 0}%`, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Pending Requests', value: dashboardData?.pendingRequests || '0', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];
  } else if (user?.role === 'student') {
    stats = [
      { label: 'My Attendance', value: `${dashboardData?.attendance || 0}%`, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Today Classes', value: dashboardData?.todayClasses?.length || '0', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];
  }

  const recentActivity = dashboardData?.recentActivity || [
    { message: 'System running smoothly', time: 'Just now', type: 'system' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
              Welcome, {user?.name || 'Admin'}
            </h1>
            <p className="text-gray-500 font-medium mt-2">Institutional Management Overview</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
              System Live
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 font-bold py-10">Loading Stats...</div>
          ) : stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Activity</h2>
              <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-6 text-center text-gray-400 font-bold text-sm">Loading activity...</div>
              ) : recentActivity.map((act: any, i: number) => {
                const Icon = act.type === 'attendance' ? UserCheck : act.type === 'onboarding' ? Users : Bell;
                const color = act.type === 'attendance' ? 'text-green-500' : act.type === 'onboarding' ? 'text-blue-500' : 'text-indigo-500';
                return (
                  <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{act.message}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{act.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <Calendar className="w-10 h-10 mb-6 opacity-50" />
            <h3 className="text-xl font-black mb-2">Upcoming Events</h3>
            <p className="text-indigo-100 text-sm mb-8 font-medium">Convocation Ceremony 2026 is scheduled for next month.</p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors">
              Schedule
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
