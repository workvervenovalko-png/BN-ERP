'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Users, 
  Trash2,
  PartyPopper,
  Snowflake,
  Info
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Event Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'Event',
    targetAudience: 'All',
    location: ''
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events', {
        params: { 
          month: currentDate.getMonth() + 1, 
          year: currentDate.getFullYear() 
        }
      });
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Error deleting event');
      }
    }
  };

  // Calendar Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                <CalendarIcon className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{monthName} <span className="text-indigo-700">{currentDate.getFullYear()}</span></h1>
                <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" /> Academic Events & Holiday Calendar
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-gray-50 p-2 rounded-2xl">
                <button onClick={handlePrevMonth} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextMonth} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600"><ChevronRight className="w-5 h-5" /></button>
             </div>
             {user?.role === 'admin' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Event
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-5 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
             <div className="grid grid-cols-7 gap-4 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
             </div>
             <div className="grid grid-cols-7 gap-4">
                {Array(firstDayOfMonth).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="h-32"></div>
                ))}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
                  const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                  
                  return (
                    <div key={day} className={cn(
                      "h-32 p-4 rounded-2xl border transition-all relative group",
                      isToday ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100" : "bg-gray-50/50 border-gray-50 hover:bg-white hover:border-indigo-100"
                    )}>
                      <span className={cn("text-sm font-black", isToday ? "text-white" : "text-gray-900")}>{day}</span>
                      <div className="mt-2 space-y-1">
                        {dayEvents.map(ev => (
                          <div key={ev._id} className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase truncate",
                            ev.type === 'Holiday' ? "bg-red-500 text-white" : isToday ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"
                          )}>
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Events List Sidebar */}
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Upcomming This Month</h3>
             <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No events scheduled</p>
                  </div>
                ) : (
                  events.map(ev => (
                    <div key={ev._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            ev.type === 'Holiday' ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
                          )}>
                             {ev.type === 'Holiday' ? <Snowflake className="w-5 h-5" /> : <PartyPopper className="w-5 h-5" />}
                          </div>
                          {user?.role === 'admin' && (
                            <button onClick={() => handleDelete(ev._id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                       </div>
                       <h4 className="text-lg font-black text-gray-900 tracking-tight">{ev.title}</h4>
                       <p className="text-xs font-bold text-gray-500 mt-1 line-clamp-2">{ev.description}</p>
                       <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             <CalendarIcon className="w-3 h-3" /> {new Date(ev.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             <MapPin className="w-3 h-3" /> {ev.location || 'College Campus'}
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-2xl font-black tracking-tighter">Add Event / Holiday</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div className="space-y-4">
                    <input placeholder="Event Title *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <textarea placeholder="Description" rows={2} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Date *</label>
                        <input type="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                       </div>
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Type</label>
                        <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="Event">Event</option>
                          <option value="Holiday">Holiday</option>
                        </select>
                       </div>
                    </div>
                    <input placeholder="Location" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all">
                   Save to Calendar
                 </button>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CalendarPage;
