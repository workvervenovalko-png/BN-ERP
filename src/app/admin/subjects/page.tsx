'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  GraduationCap,
  Calendar,
  Layers,
  User as UserIcon
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [options, setOptions] = useState<{courses: string[], specializations: string[], years: string[], sections: string[]}>({
     courses: [], specializations: [], years: [], sections: []
  });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    course: '',
    specialization: '',
    year: '',
    section: 'A',
    teacherId: ''
  });

  const [customFields, setCustomFields] = useState({
    course: false,
    specialization: false,
    year: false,
    section: false
  });

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [subRes, teachRes, filterRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/users/teachers'),
        api.get('/users/attendance-filters')
      ]);
      if (subRes.data.success) setSubjects(subRes.data.subjects);
      if (teachRes.data.success) setTeachers(teachRes.data.teachers);
      if (filterRes.data.success) setOptions(filterRes.data.options);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const res = await api.post('/subjects', formData);
      if (res.data.success) {
        setSubjects([...subjects, res.data.subject]);
        setMessage({ text: 'Subject created successfully!', type: 'success' });
        setFormData({ name: '', code: '', course: '', specialization: '', year: '', section: 'A', teacherId: '' });
        setShowAddForm(false);
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Error creating subject', type: 'error' });
    } finally {
      setSubmitLoading(false);
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter(s => s._id !== id));
    } catch (err) {
      alert('Error deleting subject');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Subjects Management</h1>
            <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Define courses and academic modules</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
          >
            {showAddForm ? 'Cancel Registration' : <><Plus className="w-4 h-4" /> Add New Subject</>}
          </button>
        </div>

        {message.text && (
          <div className={cn(
            "p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4",
            message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
          )}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="text-sm font-black italic">{message.text}</p>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in zoom-in duration-300">
            <form onSubmit={handleCreateSubject} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-3 h-3" /> Subject Name</label>
                <input 
                  required
                  placeholder="e.g. Data Structures"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash className="w-3 h-3" /> Subject Code</label>
                <input 
                  placeholder="e.g. CS201"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><GraduationCap className="w-3 h-3" /> Course</label>
                  <button type="button" onClick={() => setCustomFields({...customFields, course: !customFields.course})} className="text-[9px] font-black text-indigo-600 uppercase">
                    {customFields.course ? 'Back to List' : '+ New Course'}
                  </button>
                </div>
                {customFields.course ? (
                  <input 
                    required
                    placeholder="Type new course..."
                    className="w-full px-5 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  />
                ) : (
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    <option value="">Select Course</option>
                    {options.courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> Specialization</label>
                  <button type="button" onClick={() => setCustomFields({...customFields, specialization: !customFields.specialization})} className="text-[9px] font-black text-indigo-600 uppercase">
                    {customFields.specialization ? 'Back to List' : '+ New Spec.'}
                  </button>
                </div>
                {customFields.specialization ? (
                  <input 
                    required
                    placeholder="Type new specialization..."
                    className="w-full px-5 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  />
                ) : (
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  >
                    <option value="">Select Specialization</option>
                    {options.specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Year</label>
                  <button type="button" onClick={() => setCustomFields({...customFields, year: !customFields.year})} className="text-[9px] font-black text-indigo-600 uppercase">
                    {customFields.year ? 'Back to List' : '+ New Year'}
                  </button>
                </div>
                {customFields.year ? (
                  <input 
                    required
                    placeholder="Type new year..."
                    className="w-full px-5 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  />
                ) : (
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="">Select Year</option>
                    {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> Section</label>
                  <button type="button" onClick={() => setCustomFields({...customFields, section: !customFields.section})} className="text-[9px] font-black text-indigo-600 uppercase">
                    {customFields.section ? 'Back to List' : '+ New Sec.'}
                  </button>
                </div>
                {customFields.section ? (
                  <input 
                    required
                    placeholder="A"
                    className="w-full px-5 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                  />
                ) : (
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    {options.sections.filter(s => !['A','B','C','D'].includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><UserIcon className="w-3 h-3" /> Assigned Teacher</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">Select Teacher (Optional)</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.department})</option>)}
                </select>
              </div>
              <div className="lg:col-span-3 flex justify-end">
                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="px-10 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                >
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Subject'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
           <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Subjects ({subjects.length})</h2>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                 <button className="p-2 bg-white shadow-sm rounded-xl text-indigo-600"><Filter className="w-4 h-4" /></button>
                 <button className="p-2 text-gray-400"><Search className="w-4 h-4" /></button>
              </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-gray-50/50">
                 <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Info</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Group</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned To</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" /></td></tr>
                  ) : subjects.length > 0 ? subjects.map(s => (
                    <tr key={s._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                              {s.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 leading-none">{s.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 tracking-widest">{s.code || 'NO CODE'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-600">
                         {s.course} • {s.specialization} • {s.year} • Sec {s.section}
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{s.teacher?.name || 'TBA'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                           onClick={() => handleDeleteSubject(s._id)}
                           className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-28 text-center text-gray-400 italic font-bold uppercase tracking-widest">No subjects registered yet</td></tr>
                  )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubjectsPage;
