'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User as UserIcon, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="h-20 bg-white/40 backdrop-blur-xl border-b border-gray-100/50 px-10 flex items-center justify-between sticky top-0 z-[90]">
      <div className="flex items-center gap-8 flex-1">
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Node</h1>
          <p className="text-[10px] font-bold text-indigo-600 mt-1">{process.env.NEXT_PUBLIC_COLLEGE_NAME || 'B.N. College Of Engineering & Technology'}</p>
        </div>
        
        <div className="h-8 w-px bg-gray-200/50 hidden lg:block"></div>

        <div className="relative group max-w-sm w-full">
          <div className="absolute inset-0 bg-indigo-100/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10" />
          <input 
            type="text" 
            placeholder="Quick search (⌘+K)" 
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-gray-300 relative z-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <button className="relative p-3 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-100/50 group">
             <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-600 border-2 border-white rounded-full animate-pulse"></span>
           </button>
        </div>

        <div className="h-8 w-px bg-gray-200/50"></div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-4 group cursor-pointer p-1.5 pr-3 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-indigo-200 transition-all overflow-hidden shadow-sm">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-xs bg-indigo-50">
                     {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-none group-hover:text-indigo-600 transition-colors">{user.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{user.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-all duration-500 ${isDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-4 w-72 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.12)] p-3 z-[100] animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="px-6 py-6 bg-gray-50/50 rounded-[2rem] mb-2">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-1 border border-gray-100">
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                           {user.name[0]}
                        </div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate leading-none">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate mt-1.5 lowercase">{user.email}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <div className="flex-1 bg-white px-3 py-2 rounded-xl border border-gray-100 text-center">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Role</p>
                      <p className="text-[10px] font-black text-indigo-600 uppercase mt-0.5">{user.role}</p>
                   </div>
                   <div className="flex-1 bg-white px-3 py-2 rounded-xl border border-gray-100 text-center">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                      <p className="text-[10px] font-black text-green-600 uppercase mt-0.5">Active</p>
                   </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Link 
                  href="/profile"
                  className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all rounded-2xl group/item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                  My Profile
                </Link>
                <Link 
                  href="/settings"
                  className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all rounded-2xl group/item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                  Account Settings
                </Link>
                
                <div className="h-px bg-gray-50 my-2 mx-4"></div>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-all rounded-2xl group/item"
                >
                  <LogOut className="w-4 h-4 group-hover/item:translate-x-1 transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
