'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  UserCircle2, 
  Clock, 
  LayoutGrid, 
  FileBox, 
  Upload, 
  X,
  BookOpen,
  ArrowRight,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const TimetablePage = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        if (user?.role === 'student') {
          endpoint = `/timetable?course=${user.course}&year=${user.year}&section=${user.section}`;
        } else if (user?.role === 'teacher') {
          endpoint = '/timetable/teacher';
        }

        if (endpoint) {
          const res = await api.get(endpoint);
          setTimetable(res.data.timetable);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTimetable();
  }, [user]);

  const currentSchedule = timetable?.schedule?.find((s: any) => s.day === activeDay)?.periods || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group hover:bg-indigo-600 hover:text-white transition-all duration-500">
                 <CalendarDays className="w-7 h-7" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Class Schedule</h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                    {user?.role === 'student' ? `${user.course} • ${user.year} • Sec ${user.section}` : 'Faculty Timetable Overview'}
                 </p>
              </div>
           </div>
           {user?.role === 'admin' && (
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform"
                >
                   <Upload className="w-4 h-4 text-indigo-400" /> Upload Image/PDF
                </button>
                <button className="px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-indigo-100">
                   <Plus className="w-4 h-4" /> Build Schedule
                </button>
             </div>
           )}
        </div>

        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-sm max-w-fit mx-auto sticky top-24 z-10">
           <div className="flex items-center gap-1">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeDay === day ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
           {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-28 bg-gray-50 rounded-[2rem] border border-gray-50 animate-pulse"></div>
              ))
           ) : currentSchedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                 <FileBox className="w-16 h-16 text-gray-100" />
                 <p className="text-gray-400 font-black uppercase tracking-widest text-sm leading-relaxed">
                   No sessions scheduled for {activeDay}
                 </p>
              </div>
           ) : currentSchedule.map((period: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                 <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center justify-center min-w-[100px] text-center border-r border-gray-50 pr-8">
                       <p className="text-sm font-black text-gray-900 tracking-tighter leading-none">{period.startTime}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{period.endTime}</p>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors uppercase">{period.subject?.name || 'Subject'}</h3>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             <UserCircle2 className="w-3.5 h-3.5 text-indigo-400 font-black" /> {period.teacher?.name || 'Prof. TBD'}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             <MapPin className="w-3.5 h-3.5 text-indigo-400 font-black" /> Room {period.room || 'N/A'}
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-all">
                       <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-900">
              <div>
                <h3 className="text-xl font-black text-white tracking-tighter leading-none">External Timetable</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Upload visual schedule for classes</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 space-y-8">
               <div className="aspect-video bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-8 group hover:border-indigo-300 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-indigo-600 mb-4 animate-bounce" />
                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Drop your file here</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">PDF, JPG or PNG format allowed</p>
               </div>
               <button className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Process & Upload
               </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TimetablePage;
