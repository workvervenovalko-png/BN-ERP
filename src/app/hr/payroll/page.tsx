'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Wallet, 
  Download, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const PayrollPage = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/salary');
      setSalaries(res.data.salaries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handlePay = async (id: string) => {
    if (confirm('Mark this salary as Paid?')) {
      try {
        await api.put(`/hr/salary/${id}`);
        fetchSalaries();
      } catch (err) {
        alert('Error processing payment');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Payroll Management</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Salaries, Allowances & Deductions
            </p>
          </div>
          <div className="flex gap-4">
             <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Total Paid This Month</p>
                <p className="text-xl font-black text-green-700">₹4,50,000</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {salaries.map((salary) => (
            <div key={salary._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 transition-all group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
               
               <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                 <div className="flex-1 flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">{salary.user?.name}</h3>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{salary.user?.department} | {salary.user?.employeeId}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2]">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Month / Year</p>
                       <p className="text-sm font-black text-gray-900 mt-1">{salary.month} {salary.year}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Salary</p>
                       <p className="text-sm font-black text-gray-900 mt-1">₹{salary.netSalary.toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                       <span className={cn(
                         "flex items-center gap-1 text-sm font-black mt-1",
                         salary.status === 'Paid' ? "text-green-600" : "text-amber-500"
                       )}>
                         {salary.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                         {salary.status}
                       </span>
                    </div>
                    <div className="flex items-center justify-end">
                       {user?.role === 'admin' && salary.status === 'Pending' ? (
                         <button 
                          onClick={() => handlePay(salary._id)}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                         >
                           Pay Now
                         </button>
                       ) : (
                         <button className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                           <Download className="w-5 h-5" />
                         </button>
                       )}
                    </div>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Breakdown</p>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Basic Pay</span>
                      <span className="text-gray-900">₹{salary.basicSalary}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-green-600">Total Allowances</span>
                      <span className="text-green-600">+ ₹{salary.allowances.hra + salary.allowances.da + salary.allowances.special}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-red-500">Total Deductions</span>
                      <span className="text-red-500">- ₹{salary.deductions.pf + salary.deductions.tax + salary.deductions.others}</span>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
