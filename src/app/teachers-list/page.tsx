'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  Search, 
  MessageSquare, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const TeachersListPage = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/users/teachers').then(res => {
      setTeachers(res.data.teachers);
      setLoading(false);
    });
  }, []);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tight leading-none">Your Faculty</h1>
              <p className="text-indigo-100 font-bold mt-3 uppercase tracking-widest text-xs">Connect with your teachers and mentors</p>
           </div>
           <div className="relative z-10 w-full max-w-md">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search by name or department..." 
                   className="w-full pl-12 pr-4 py-4 bg-indigo-500/30 border border-indigo-400/30 rounded-2xl text-sm font-bold placeholder:text-indigo-300 focus:outline-none focus:bg-indigo-500/50 focus:border-white transition-all text-white"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
           <GraduationCap className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
              ))
           ) : filteredTeachers.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                 <p className="text-gray-400 font-black uppercase tracking-[0.2em]">No faculty members found</p>
              </div>
           ) : filteredTeachers.map((teacher) => (
              <div key={teacher._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                 <div>
                    <div className="flex items-center justify-between mb-6">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                          {teacher.name.charAt(0)}
                       </div>
                       <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <MessageSquare className="w-5 h-5" />
                       </button>
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors uppercase">{teacher.name}</h3>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{teacher.department || 'Professor'}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                       {teacher.subjects?.map((s: any) => (
                          <span key={s._id} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                             {s.name}
                          </span>
                       ))}
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                       <Mail className="w-4 h-4 text-indigo-400" /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                       <Phone className="w-4 h-4 text-indigo-400" /> {teacher.phone || 'Phone hidden'}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeachersListPage;
