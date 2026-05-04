'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Book as BookIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const LibraryHistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/library/transactions');
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none text-indigo-700">Library History</h1>
            <p className="text-sm text-gray-500 font-bold mt-3 uppercase tracking-widest flex items-center gap-2">
               <History className="w-4 h-4" /> Tracking your borrowed resources
            </p>
          </div>
          <a href="/library" className="p-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl transition-all">
            <ArrowLeft className="w-6 h-6" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
            ))
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Clock className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No history found</h3>
               <p className="text-gray-400 font-bold text-sm mt-2">You haven't borrowed any books yet.</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                    tx.status === 'Returned' ? "bg-green-50 text-green-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <BookIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{tx.book?.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Due: {new Date(tx.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-12">
                   <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <span className={cn(
                      "flex items-center gap-1 text-sm font-black mt-1",
                      tx.status === 'Returned' ? "text-green-600" : "text-indigo-600"
                    )}>
                      {tx.status === 'Returned' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {tx.status}
                    </span>
                  </div>

                  {tx.returnDate && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Returned On</p>
                      <p className="text-sm font-black text-gray-900 mt-1">{new Date(tx.returnDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {tx.fineAmount > 0 && (
                    <div className="px-4 py-2 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Fine Paid</p>
                      <p className="text-sm font-black text-red-600 mt-1">₹{tx.fineAmount}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LibraryHistoryPage;
