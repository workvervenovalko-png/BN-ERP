'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus, 
  X,
  Loader2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import BulkUploadModal from '@/components/BulkUploadModal';

const StudentsPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [options, setOptions] = useState<{courses: string[], specializations: string[], years: string[], sections: string[]}>({
     courses: [], specializations: [], years: [], sections: []
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    course: '',
    year: '',
    section: '',
    phone: '',
    password: '',
    guardianName: '',
    address: '',
    specialization: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/students?search=${searchTerm}&page=${page}`);
      setStudents(res.data.students);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const fetchOptions = async () => {
      try {
        const res = await api.get('/users/attendance-filters');
        if (res.data.success) setOptions(res.data.options);
      } catch (err) {
        console.error('Filter Fetch Error:', err);
      }
    };
    fetchOptions();
  }, [page, searchTerm]);

  useEffect(() => {
    if (action === 'add' && user?.role === 'admin') {
      handleOpenModal();
    }
  }, [action, user]);


  const handleOpenModal = (student: any = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        course: student.course || '',
        year: student.year || '',
        section: student.section || '',
        phone: student.phone || '',
        password: '', // Don't show password
        guardianName: student.guardianName || '',
        address: student.address || '',
        specialization: student.specialization || ''
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        rollNo: '',
        course: '',
        year: '',
        section: '',
        phone: '',
        password: '123123',
        guardianName: '',
        address: '',
        specialization: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/users/students/${editingStudent._id}`, formData);
      } else {
        await api.post('/users/students', formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/users/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert('Error deleting student');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Student Management</h1>
            <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Total {students.length} Records found</p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl transition-all flex items-center gap-2 group shrink-0"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Bulk Upload
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 group shrink-0"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add New Student
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, roll no..." 
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
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Student</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Roll No</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Course/Year</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Attendance</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Contact</th>
                  <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-10"><div className="h-6 bg-gray-100 rounded-lg w-full"></div></td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-gray-400 font-bold uppercase tracking-widest">No student found</p>
                    </td>
                  </tr>
                ) : students.map((student) => (
                  <tr key={student._id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-8 py-5 min-w-[240px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">
                           {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-gray-900 leading-tight tracking-tight">{student.name}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase truncate max-w-[150px]">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">{student.rollNo}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-700">{student.course || 'N/A'}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase">{student.year || 'N/A'} • {student.section || 'A'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          parseFloat(student.attendance) >= 75 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        )} />
                        <span className={cn(
                          "text-sm font-black tracking-tighter",
                          parseFloat(student.attendance) >= 75 ? "text-green-600" : "text-red-600"
                        )}>
                          {student.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-700">{student.phone || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(student)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(student._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
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
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{editingStudent ? 'Edit Student' : 'Onboard Student'}</h3>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Fill relevant student credentials</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="Enter student name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address *</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Roll Number *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="2024001"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Course *</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    <option value="">Select Course</option>
                    {options.courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Specialization</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  >
                    <option value="">Select Specialization</option>
                    {options.specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Year *</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="">Select Year</option>
                    {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Section</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    {options.sections.filter(s => !['A','B','C'].includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {!editingStudent && (
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Initial Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              )}

              <div className="flex items-center gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 text-sm font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {editingStudent ? 'Update Details' : 'Onboard Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BulkUploadModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        role="student"
        onSuccess={fetchStudents}
      />
    </DashboardLayout>
  );
};

export default StudentsPage;
