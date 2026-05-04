'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  GraduationCap, 
  UserCircle2, 
  Globe,
  Trash2,
  Clock,
  Loader2,
  CheckCircle2,
  Megaphone
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // New Notification Form
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    targetRole: 'all'
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post('/notifications', formData);
      setFormData({
        title: '',
        message: '',
        type: 'announcement',
        targetRole: 'all'
      });
      fetchNotifications();
    } catch (err) {
      alert('Error sending notification');
    } finally {
      setIsSending(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500 pb-12">
        {/* Left: Compose (Admin Only) */}
        <div className={cn(
          "space-y-6 lg:col-span-1",
          user?.role !== 'admin' && "hidden"
        )}>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Megaphone className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tighter leading-none">Broadcast</h2>
             </div>

             <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                   <input 
                     required
                     type="text" 
                     className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                     placeholder="Urgent Update"
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                   <textarea 
                     required
                     rows={4}
                     className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 resize-none"
                     placeholder="Type your message here..."
                     value={formData.message}
                     onChange={(e) => setFormData({...formData, message: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Role</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['all', 'teacher', 'student', 'controller'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({...formData, targetRole: role})}
                          className={cn(
                            "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.targetRole === role ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {role}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                  disabled={isSending}
                  type="submit"
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Announcement <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                </button>
             </form>
          </div>
        </div>

        {/* Right: Notification Feed */}
        <div className={cn(
           "space-y-6",
           user?.role === 'admin' ? "lg:col-span-2" : "lg:col-span-3"
        )}>
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[600px]">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Notifications Center</h2>
                 <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                   {notifications.length} Total Messages
                 </span>
              </div>

              <div className="space-y-6">
                 {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-4 animate-pulse p-6 bg-gray-50/50 rounded-3xl">
                         <div className="w-12 h-12 bg-gray-200 rounded-2xl outline-none"></div>
                         <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-100 rounded w-full"></div>
                         </div>
                      </div>
                    ))
                 ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                       <Bell className="w-16 h-16 text-gray-100" />
                       <p className="text-gray-400 font-black uppercase tracking-widest">No messages found</p>
                    </div>
                 ) : notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={cn(
                        "group p-6 rounded-[2rem] border transition-all cursor-pointer",
                        notif.readBy.includes(user?._id) ? "bg-white border-transparent" : "bg-indigo-50/30 border-indigo-50 shadow-sm shadow-indigo-100/50"
                      )}
                      onClick={() => !notif.readBy.includes(user?._id) && markRead(notif._id)}
                    >
                       <div className="flex gap-6">
                          <div className={cn(
                             "w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 duration-500",
                             notif.type === 'announcement' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                          )}>
                             {notif.type === 'announcement' ? <Megaphone className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                   <p className="text-lg font-black text-gray-900 tracking-tight leading-none truncate max-w-[300px]">{notif.title}</p>
                                   {!notif.readBy.includes(user?._id) && <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                   <Clock className="w-3 h-3" /> {format(new Date(notif.createdAt), 'MMM dd, HH:mm')}
                                </span>
                             </div>
                             <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-2xl">{notif.message}</p>
                             <div className="mt-4 flex items-center gap-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                   <UserCircle2 className="w-3.5 h-3.5" /> Sent By {notif.sentBy?.name}
                                </span>
                                <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1.5">
                                   {notif.targetRole === 'all' ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />} To {notif.targetRole}
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
