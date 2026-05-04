'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  X,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const LibrariansContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const [librarians, setlibrarians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const fetchlibrarians = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/librarians');
      setlibrarians(res.data.librarians);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchlibrarians();
  }, []);

  useEffect(() => {
    if (action === 'add' && user?.role === 'admin') {
      handleOpenModal();
    }
  }, [action, user]);


  const handleOpenModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '123123'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/librarians', formData);
      setIsModalOpen(false);
      fetchlibrarians();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating librarian');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this librarian?')) {
      try {
        await api.delete(`/users/librarians/${id}`);
        fetchlibrarians();
      } catch (err) {
        alert('Error deleting librarian');
      }
    }
  };

  const filteredlibrarians = librarians.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none text-indigo-700">Attendance librarians</h1>
          <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Managing staff with attendance marking privileges</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={handleOpenModal}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 group"
          >
            <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add librarian
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-black" />
            <input 
              type="text" 
              placeholder="Search librarians..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">librarian Name</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Email Address</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Contact</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-10"><div className="h-8 bg-gray-100 rounded-lg w-full"></div></td>
                  </tr>
                ))
              ) : filteredlibrarians.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No librarians found</p>
                  </td>
                </tr>
              ) : filteredlibrarians.map((librarian) => (
                <tr key={librarian._id} className="hover:bg-indigo-50/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                         {librarian.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900 leading-none tracking-tight">{librarian.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">ID: {librarian._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-gray-600">{librarian.email}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-700">{librarian.phone || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDelete(librarian._id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
              <div>
                <h3 className="text-2xl font-black tracking-tighter leading-none">New librarian</h3>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-2">Create staff accounts for attendance control.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-indigo-200 hover:text-white hover:bg-indigo-500 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="librarian Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address *</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="librarian@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                  <input 
                    type="password" 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LibrariansPage = () => {
  return (
    <DashboardLayout>
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <LibrariansContent />
      </React.Suspense>
    </DashboardLayout>
  );
};

export default LibrariansPage;
