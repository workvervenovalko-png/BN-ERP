'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  ClipboardCheck,
  Wallet,
  Bell,
  CalendarDays,
  Settings,
  LogOut,
  GraduationCap,
  UserCheck,
  BookOpen,
  ShieldAlert,
  Building2,
  UserPlus,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'teacher', 'student', 'controller', 'librarian'] },
    { type: 'header', name: 'Identity Hub', roles: ['admin'] },
    { name: 'Users', icon: UserSquare2, href: '/admin/users', roles: ['admin'] },
    { type: 'header', name: 'Academics', roles: ['admin', 'teacher', 'controller', 'student', 'librarian'] },
    { name: 'Students', icon: GraduationCap, href: '/students', roles: ['admin', 'teacher', 'controller'] },
    { name: 'Teachers', icon: Users, href: '/teachers', roles: ['admin', 'controller'] },
    { name: 'Attendance', icon: ClipboardCheck, href: '/attendance', roles: ['admin', 'teacher', 'student', 'controller'] },
    { name: 'Timetable', icon: CalendarDays, href: '/timetable', roles: ['admin', 'teacher', 'student'] },
    { type: 'header', name: 'University Admin', roles: ['admin'] },
    { name: 'Hierarchy', icon: Building2, href: '/admin/hierarchy', roles: ['admin'] },
    { name: 'Admissions', icon: UserPlus, href: '/admin/admissions', roles: ['admin'] },
    { name: 'Placement', icon: Briefcase, href: '/admin/placement', roles: ['admin'] },
    { type: 'header', name: 'Resources', roles: ['admin', 'student', 'librarian'] },
    { name: 'Library', icon: BookOpen, href: '/library', roles: ['admin', 'student', 'librarian'] },
    { name: 'Fees', icon: Wallet, href: '/fees', roles: ['admin', 'student'] },
    { type: 'header', name: 'Career Path', roles: ['student'] },
    { name: 'Placements', icon: Briefcase, href: '/placement', roles: ['student'] },
    { type: 'header', name: 'Support', roles: ['admin', 'teacher', 'student', 'controller', 'librarian'] },
    { name: 'Notifications', icon: Bell, href: '/notifications', roles: ['admin', 'teacher', 'student', 'controller', 'librarian'] },
    { name: 'Help Desk', icon: ShieldAlert, href: '/admin/issues', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-[100] flex flex-col shadow-sm">
      <div className="p-6 mb-2 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm border border-gray-100">
             <img 
               src={process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png"} 
               alt="Logo" 
               className="w-full h-full object-contain" 
             />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">{process.env.NEXT_PUBLIC_APP_NAME || 'EduCore'}</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <nav className="space-y-1">
          {filteredMenu.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <div key={idx} className="px-4 pt-6 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {item.name}
                </div>
              );
            }
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href || idx}
                href={item.href || '#'}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {Icon && <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
