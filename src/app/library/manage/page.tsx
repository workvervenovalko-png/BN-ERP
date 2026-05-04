'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import {
  BookOpen, Upload, Clock, CheckCircle2, AlertTriangle,
  RotateCcw, Search, Plus, X, BookMarked
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'issue', label: 'Issue Book' },
  { id: 'active', label: 'Active Issues' },
  { id: 'returned', label: 'Returned' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'bulk', label: 'Bulk Add Books' },
];

export default function LibraryManagePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [students, setStudents] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [searchTx, setSearchTx] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [studentRes, bookRes, txRes] = await Promise.all([
        api.get('/users/students', { params: { limit: 200 } }),
        api.get('/library/books'),
        api.get('/library/transactions'),
      ]);
      setStudents(studentRes.data.students || []);
      setBooks(bookRes.data.books || []);
      setTransactions(txRes.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const issuedTx = transactions.filter(t => t.status === 'Issued' || t.status === 'Overdue');
  const returnedTx = transactions.filter(t => t.status === 'Returned');
  const overdueTx = issuedTx.filter(t => new Date(t.dueDate) < new Date());

  const filterTx = (list: any[]) => list.filter(t =>
    !searchTx ||
    t.book?.title?.toLowerCase().includes(searchTx.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(searchTx.toLowerCase()) ||
    t.user?.rollNo?.toLowerCase().includes(searchTx.toLowerCase())
  );

  const handleIssue = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/library/issue', { bookId: selectedBook, userId: selectedStudent, dueDate });
      showAlert('success', 'Book issued successfully!');
      setSelectedBook(''); setSelectedStudent(''); setDueDate('');
      fetchAll();
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturn = async (transactionId: string) => {
    try {
      const res = await api.put(`/library/return/${transactionId}`);
      const fine = res.data.transaction?.fineAmount;
      showAlert('success', `Book returned!${fine > 0 ? ` Fine: ₹${fine}` : ' No fine.'}`);
      fetchAll();
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Error returning book');
    }
  };

  const handleBulkUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/library/books/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showAlert('success', res.data.message);
      setFile(null);
      fetchAll();
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Error uploading file');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'librarian')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 font-bold">Access Denied. Librarian or Admin role required.</p>
        </div>
      </DashboardLayout>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, bg, onClick }: any) => (
    <button
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-3 text-left hover:shadow-md transition-all group ${onClick ? 'cursor-pointer' : 'cursor-default'} ${color === 'red' ? 'border-red-100' : 'border-gray-100'}`}
    >
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div>
        <p className={`text-3xl font-black ${color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </button>
  );

  const TxRow = ({ t, showReturn = false }: { t: any; showReturn?: boolean }) => {
    const isLate = new Date(t.dueDate) < new Date() && t.status !== 'Returned';
    const lateDays = isLate ? Math.ceil((Date.now() - new Date(t.dueDate).getTime()) / 86400000) : 0;
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-5 py-4">
          <p className="font-bold text-gray-900 text-sm">{t.book?.title}</p>
          <p className="text-xs text-gray-400">{t.book?.isbn}</p>
        </td>
        <td className="px-5 py-4">
          <p className="font-bold text-gray-900 text-sm">{t.user?.name}</p>
          <p className="text-xs text-gray-400">{t.user?.rollNo || t.user?.email}</p>
        </td>
        <td className="px-5 py-4">
          <p className={`text-sm font-bold ${isLate ? 'text-red-600' : 'text-gray-700'}`}>
            {new Date(t.dueDate).toLocaleDateString()}
          </p>
          {isLate && <p className="text-xs text-red-500 mt-0.5">₹{lateDays * 50} fine</p>}
        </td>
        <td className="px-5 py-4">
          {t.status === 'Returned' ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-lg">Returned</span>
          ) : isLate ? (
            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg">Overdue</span>
          ) : (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-lg">Active</span>
          )}
        </td>
        {showReturn && (
          <td className="px-5 py-4">
            <button
              onClick={() => handleReturn(t._id)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black uppercase rounded-lg transition-colors"
            >
              Mark Returned
            </button>
          </td>
        )}
      </tr>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* Alert */}
        {alert && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-2 ${alert.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {alert.msg}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight">Library Operations Desk</h1>
            <p className="text-indigo-200 mt-1 font-medium">Issue, Return & Manage the entire book inventory.</p>
          </div>
          <div className="absolute right-8 top-4 opacity-10"><BookMarked className="w-36 h-36" /></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              {tab.label}
              {tab.id === 'active' && issuedTx.length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>{issuedTx.length}</span>
              )}
              {tab.id === 'overdue' && overdueTx.length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>{overdueTx.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ====== OVERVIEW ====== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={BookOpen} label="Total Books" value={books.reduce((s, b) => s + b.totalCopies, 0)} color="indigo" bg="bg-indigo-50" onClick={() => setActiveTab('issue')} />
              <StatCard icon={CheckCircle2} label="Available Now" value={books.reduce((s, b) => s + b.availableCopies, 0)} color="green" bg="bg-green-50" />
              <StatCard icon={RotateCcw} label="Total Issued" value={issuedTx.length} color="blue" bg="bg-blue-50" onClick={() => setActiveTab('active')} />
              <StatCard icon={AlertTriangle} label="Overdue" value={overdueTx.length} color="red" bg="bg-red-50" onClick={() => setActiveTab('overdue')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Returns</p>
                <p className="text-4xl font-black text-gray-900 mt-2">{returnedTx.length}</p>
                <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: transactions.length > 0 ? `${(returnedTx.length / transactions.length) * 100}%` : '0%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-2 font-bold">
                  {transactions.length > 0 ? Math.round((returnedTx.length / transactions.length) * 100) : 0}% return rate
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Book Inventory</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {books.map(b => (
                    <div key={b._id} className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[60%]">{b.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(b.availableCopies / b.totalCopies) * 100}%` }} />
                        </div>
                        <span className="text-xs font-black text-gray-500">{b.availableCopies}/{b.totalCopies}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== ISSUE BOOK ====== */}
        {activeTab === 'issue' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" /> Issue a Book</h2>
            <form onSubmit={handleIssue} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Student</label>
                <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50">
                  <option value="">-- Choose Student --</option>
                  {students.map((s: any) => <option key={s._id} value={s._id}>{s.name} — {s.rollNo}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Book</label>
                <select required value={selectedBook} onChange={e => setSelectedBook(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50">
                  <option value="">-- Choose Book --</option>
                  {books.filter(b => b.availableCopies > 0).map((b: any) => <option key={b._id} value={b._id}>{b.title} (Available: {b.availableCopies})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Return Due Date</label>
                <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-100">Issue Book</button>
            </form>
          </div>
        )}

        {/* ====== ACTIVE ISSUES ====== */}
        {activeTab === 'active' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Active Issues <span className="text-indigo-600">({issuedTx.length})</span></h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTx} onChange={e => setSearchTx(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400 font-black">
                  <tr>
                    <th className="px-5 py-4">Book</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filterTx(issuedTx).length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-gray-400 italic font-bold">No active issues found.</td></tr>
                  ) : filterTx(issuedTx).map(t => <TxRow key={t._id} t={t} showReturn={true} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== RETURNED ====== */}
        {activeTab === 'returned' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Returned Books <span className="text-green-600">({returnedTx.length})</span></h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTx} onChange={e => setSearchTx(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400 font-black">
                  <tr>
                    <th className="px-5 py-4">Book</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filterTx(returnedTx).length === 0 ? (
                    <tr><td colSpan={4} className="py-16 text-center text-gray-400 italic font-bold">No returned books yet.</td></tr>
                  ) : filterTx(returnedTx).map(t => <TxRow key={t._id} t={t} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== OVERDUE ====== */}
        {activeTab === 'overdue' && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/30">
              <div>
                <h2 className="font-black text-gray-900 text-lg">Overdue Books <span className="text-red-600">({overdueTx.length})</span></h2>
                <p className="text-xs text-red-500 font-bold mt-1">Fine: ₹50 per day</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTx} onChange={e => setSearchTx(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-red-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400 font-black">
                  <tr>
                    <th className="px-5 py-4">Book</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filterTx(overdueTx).length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-gray-400 italic font-bold">No overdue books. All clear!</td></tr>
                  ) : filterTx(overdueTx).map(t => <TxRow key={t._id} t={t} showReturn={true} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== BULK ADD ====== */}
        {activeTab === 'bulk' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Books</h2>
              <p className="text-gray-500 text-sm mt-2">Upload an Excel (.xlsx) file. Columns: Title, Author, ISBN, Category, TotalCopies, Location.</p>
            </div>
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                required
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
              />
              <button type="submit" disabled={!file} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors">
                Upload & Add Books
              </button>
            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
