'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter,
  ArrowRight,
  MoreVertical,
  ArrowUpRight,
  Receipt,
  TrendingUp,
  Users
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const StudentFees = ({ user }: { user: any }) => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees').then(res => {
      setFees(res.data.fees);
      setLoading(false);
    });
  }, []);

  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between min-h-[220px]">
            <Wallet className="w-10 h-10 text-indigo-300 mb-6" />
            <div>
               <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest leading-none">Total Fees Paid</p>
               <h3 className="text-4xl font-black mt-2 tracking-tighter">₹{totalPaid.toLocaleString()}</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[220px]">
            <AlertCircle className="w-10 h-10 text-orange-400 mb-6" />
            <div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Pending Amount</p>
               <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tighter">₹{totalPending.toLocaleString()}</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[220px] group transition-all hover:bg-gray-50 cursor-pointer">
            <Receipt className="w-10 h-10 text-indigo-600 mb-6" />
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Last Receipt</p>
                  <h3 className="text-xl font-black text-gray-900 mt-2 tracking-tighter">RCPT-20240801</h3>
               </div>
               <ArrowUpRight className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Fee Transaction History</h3>
            <button className="flex items-center gap-2 text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl uppercase tracking-widest">
               <Download className="w-4 h-4" /> Download Statement
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Fee Type</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Bill Date</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Amount</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {fees.map((fee, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-900 leading-none">{fee.feeType}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{fee.academicYear} • Semester {fee.semester}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-gray-700">{format(new Date(fee.dueDate), 'MMM dd, yyyy')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-gray-900 tracking-tight">₹{fee.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "w-fit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                          fee.status === 'Paid' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                        )}>
                          {fee.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {fee.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Download className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const AdminFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/fees'),
      api.get('/fees/stats')
    ]).then(([resFees, resStats]) => {
      setFees(resFees.data.fees);
      setStats(resStats.data.stats);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[180px]">
            <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
            <div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Total Collection</p>
               <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">₹{stats?.[0]?.totalPaid?.toLocaleString() || 0}</h3>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[180px]">
            <AlertCircle className="w-10 h-10 text-orange-400 mb-4" />
            <div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Pending Amount</p>
               <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">₹{stats?.[1]?.totalAmount?.toLocaleString() || 0}</h3>
            </div>
         </div>
         <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between min-h-[180px]">
            <Users className="w-10 h-10 text-indigo-300 mb-4" />
            <div>
               <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest leading-none">Total Students</p>
               <h3 className="text-3xl font-black mt-2 tracking-tighter">{fees.length} Records</h3>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
         <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Fee Management</h2>
            <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Financial Oversight & Collection Tracking</p>
         </div>
         <button className="px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-2 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Create New Bill
         </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search student or roll no..." 
                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-[1.25rem] text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
               />
            </div>
            <div className="flex gap-2">
               <button className="px-6 py-3 bg-gray-50 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter By Status
               </button>
               <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
                  <Download className="w-5 h-5" />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Student</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Fee Type</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Amount</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {fees.map((fee, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">
                              {fee.student?.name?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 leading-none">{fee.student?.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{fee.student?.rollNo}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-700">{fee.feeType}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Due {format(new Date(fee.dueDate), 'MMM dd')}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-sm font-black text-gray-900 tracking-tight">₹{fee.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className={cn(
                            "w-fit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                            fee.status === 'Paid' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                         )}>
                            {fee.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {fee.status}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="px-4 py-2 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-indigo-100">Update Status</button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const FeesPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.role === 'student' && <StudentFees user={user} />}
      {user?.role === 'admin' && <AdminFees />}
      {user?.role === 'teacher' && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
           <Wallet className="w-16 h-16 text-gray-200" />
           <p className="text-gray-400 font-black uppercase tracking-widest text-center max-w-xs leading-relaxed">
             Teacher View: Use Administrator panel for fee records assessment.
           </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FeesPage;
