'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  UserPlus, 
  X,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Upload
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import BulkUploadModal from '@/components/BulkUploadModal';

const TeachersPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    subjects: [] as string[],
    specialization: ''
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/teachers?search=${searchTerm}&page=${page}`);
      setTeachers(res.data.teachers);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, searchTerm]);

  useEffect(() => {
    if (action === 'add' && user?.role === 'admin') {
      handleOpenModal();
    }
  }, [action, user]);


  const handleOpenModal = (teacher: any = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || '',
        department: teacher.department || '',
        password: '',
        subjects: teacher.subjects?.map((s: any) => s._id) || [],
        specialization: teacher.specialization || ''
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        password: '123123',
        subjects: [],
        specialization: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.put(`/users/teachers/${editingTeacher._id}`, formData);
      } else {
        await api.post('/users/teachers', formData);
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving teacher');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/users/teachers/${id}`);
        fetchTeachers();
      } catch (err) {
        alert('Error deleting teacher');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Teacher Management</h1>
            <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Managing academic faculty members</p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="px-6 py-4 bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 group"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Bulk Upload
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 group"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Onboard Faculty
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-black" />
              <input 
                type="text" 
                placeholder="Search by name, dept, email..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"><Filter className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Faculty Info</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Department</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Assigned Subjects</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Avg Attendance</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Contact</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-10"><div className="h-8 bg-gray-100 rounded-lg w-full"></div></td>
                    </tr>
                  ))
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No faculty records found</p>
                    </td>
                  </tr>
                ) : teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                           {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 leading-none tracking-tight">{teacher.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">{teacher.department || 'GENERAL'}</span>
                    </td>
                    <td className="px-8 py-6 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                         {teacher.subjects?.length > 0 ? teacher.subjects.map((s: any) => (
                            <span key={s._id} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{s.name}</span>
                         )) : <span className="text-[10px] text-gray-400 font-bold italic">No subjects assigned</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                        <span className="text-sm font-black text-indigo-600 tracking-tighter">
                          {teacher.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-700">{teacher.phone || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(teacher)}
                          className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(teacher._id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{editingTeacher ? 'Update Faculty' : 'Faculty Onboarding'}</h3>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-2">Manage college academic staff details. They can change their password later.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-indigo-200 hover:text-white hover:bg-indigo-500 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                     <input 
                       required
                       type="text" 
                       className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                       placeholder="Faculty Name"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address *</label>
                     <input 
                       required
                       type="email" 
                       className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                       placeholder="teacher@college.edu"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
                     <input 
                       type="text" 
                       className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                       placeholder="Computer Science"
                       value={formData.department}
                       onChange={(e) => setFormData({...formData, department: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialization</label>
                     <input 
                       type="text" 
                       className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                       placeholder="Machine Learning"
                       value={formData.specialization}
                       onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                     />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Phone</label>
                   <input 
                     type="text" 
                     className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                     placeholder="+91 999 888 7777"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>

                {!editingTeacher && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Password</label>
                      <input 
                        type="password" 
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                   </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                >
                  {editingTeacher ? 'Update Faculty' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BulkUploadModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        role="teacher"
        onSuccess={fetchTeachers}
      />
    </DashboardLayout>
  );
};

export default TeachersPage;
