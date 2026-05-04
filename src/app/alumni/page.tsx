'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Filter, 
  Award,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn, getFileUrl } from '@/lib/utils';

const AlumniPage = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await api.get('/alumni', {
        params: { search: searchTerm, year: yearFilter }
      });
      setAlumni(res.data.alumni);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAlumni();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, yearFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 opacity-5 rotate-12">
            <GraduationCap size={200} className="text-indigo-600" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Alumni Network</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" /> Connecting with our Global Success Stories
            </p>
          </div>
          {user?.role === 'admin' && (
             <button 
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
             >
               <Plus className="w-5 h-5" /> Register Alumni
             </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Company or Designation..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
             <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <select 
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-50"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
             >
                <option value="">All Batch Years</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
             </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-72 bg-white rounded-[2.5rem] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((alum) => (
              <div key={alum._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 transition-all group overflow-hidden relative">
                {alum.isFeatured && (
                  <div className="absolute top-6 right-6">
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform overflow-hidden">
                      {alum.user?.profilePhoto ? (
                        <img src={getFileUrl(alum.user.profilePhoto)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-10 h-10" />
                      )}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">{alum.user?.name}</h3>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-3">Batch of {alum.graduationYear}</p>
                   
                   <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <p className="text-xs font-bold text-gray-700">{alum.designation} <span className="text-gray-400">@</span> {alum.currentCompany}</p>
                   </div>

                   <p className="mt-6 text-xs font-bold text-gray-400 line-clamp-3 leading-relaxed italic">
                     "{alum.successStory || 'An inspiring journey from college to career.'}"
                   </p>

                   <div className="mt-8 flex items-center gap-3">
                      {alum.linkedIn && (
                        <a href={alum.linkedIn} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2">
                        View Profile <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Register Alumni Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-2xl font-black tracking-tighter">Register Alumni</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
             </div>

             <form onSubmit={async (e) => {
               e.preventDefault();
               const target = e.target as any;
               try {
                 await api.post('/alumni', { 
                   userId: target.userId.value,
                   graduationYear: target.year.value,
                   currentCompany: target.company.value,
                   designation: target.designation.value,
                   successStory: target.story.value,
                   linkedIn: target.linkedIn.value
                 });
                 setIsModalOpen(false);
                 fetchAlumni();
               } catch (err) { alert('Error registering alumni'); }
             }} className="p-10 space-y-4">
                <input name="userId" placeholder="Student ID (MongoDB ID) *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                <div className="grid grid-cols-2 gap-4">
                   <input name="year" type="number" placeholder="Graduation Year *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                   <input name="company" placeholder="Current Company *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                </div>
                <input name="designation" placeholder="Current Designation *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                <input name="linkedIn" placeholder="LinkedIn URL" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                <textarea name="story" placeholder="Success Story (Briefly) *" required rows={3} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all">Register Success Story</button>
             </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AlumniPage;
