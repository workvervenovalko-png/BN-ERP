'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Info,
  User as UserIcon,
  MessageSquare
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const LeavesPage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Leave Form
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/leave');
      setLeaves(res.data.leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/leave', formData);
      setIsModalOpen(false);
      fetchLeaves();
    } catch (err) {
      alert('Error submitting leave request');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/hr/leave/${id}`, { status, reviewRemarks: 'Processed by Admin' });
      fetchLeaves();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Leave Management</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Attendance & Leave Requests
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Request Leave
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaves.map((leave) => (
            <div key={leave._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
               <div className={cn(
                 "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10",
                 leave.status === 'Approved' ? "bg-green-600" : leave.status === 'Rejected' ? "bg-red-600" : "bg-amber-500"
               )}></div>

               <div className="flex justify-between items-start mb-6">
                  <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">
                    {leave.leaveType}
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                    leave.status === 'Approved' ? "bg-green-50 text-green-600" : 
                    leave.status === 'Rejected' ? "bg-red-50 text-red-600" : 
                    "bg-amber-50 text-amber-500"
                  )}>
                    {leave.status}
                  </span>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{leave.user?.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{leave.user?.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 py-4 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From</p>
                      <p className="text-xs font-black text-gray-900 mt-1">{new Date(leave.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To</p>
                      <p className="text-xs font-black text-gray-900 mt-1">{new Date(leave.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Reason
                    </p>
                    <p className="text-xs font-bold text-gray-600 mt-2 line-clamp-2 italic">"{leave.reason}"</p>
                  </div>
               </div>

               {user?.role === 'admin' && leave.status === 'Pending' && (
                 <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                      className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Reject
                    </button>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-2xl font-black tracking-tighter">Request Leave</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleRequest} className="p-10 space-y-6">
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Leave Type</label>
                      <select 
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                        value={formData.leaveType}
                        onChange={e => setFormData({...formData, leaveType: e.target.value})}
                      >
                        <option>Sick Leave</option>
                        <option>Casual Leave</option>
                        <option>Earned Leave</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Start Date</label>
                        <input type="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                       </div>
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">End Date</label>
                        <input type="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                       </div>
                    </div>
                    <textarea 
                      placeholder="Reason for leave..." 
                      required 
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                      value={formData.reason}
                      onChange={e => setFormData({...formData, reason: e.target.value})}
                    ></textarea>
                 </div>
                 <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all">
                   Submit Request
                 </button>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeavesPage;
