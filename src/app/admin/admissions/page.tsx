'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Filter, Phone, Mail, 
  MoreVertical, ArrowRight, UserCheck, 
  Clock, Calendar, Plus 
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';

const AdmissionsPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admission/inquiries');
      setInquiries(res.data.data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq: any) => 
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inq.phone.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admission Inquiries</h1>
            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">Manage potential student leads</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">
            <Plus className="w-5 h-5" /> New Inquiry
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Filter className="w-5 h-5" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Interested</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold">Loading inquiries...</td></tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold">No inquiries found</td></tr>
                ) : filteredInquiries.map((inquiry: any) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{inquiry.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Source: {inquiry.source}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-600 flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {inquiry.phone}</span>
                        <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {inquiry.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {inquiry.courseInterested?.name || 'General Inquiry'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        inquiry.status === 'Converted' ? 'bg-green-50 text-green-600' :
                        inquiry.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:underline text-xs font-black uppercase tracking-widest flex items-center gap-1 justify-end">
                        Follow Up <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdmissionsPage;
