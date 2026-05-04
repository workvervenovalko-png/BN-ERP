'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Building2, BookOpen, Layers, 
  Edit2, Trash2, ShieldCheck, Cpu, 
  Globe, FlaskConical, Search 
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';

const HierarchyPage = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'departments') {
        const res = await api.get('/hierarchy/departments');
        setDepartments(res.data.data);
      } else if (activeTab === 'courses') {
        const res = await api.get('/hierarchy/courses');
        setCourses(res.data.data);
      } else if (activeTab === 'batches') {
        const res = await api.get('/hierarchy/batches');
        setBatches(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Institutional Hierarchy</h1>
            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">Manage Departments, Courses and Batches</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">
            <Plus className="w-5 h-5" /> Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-100 w-fit">
          {[
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'batches', label: 'Batches', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-400 font-bold">Loading...</td></tr>
                ) : (activeTab === 'departments' ? departments : activeTab === 'courses' ? courses : batches).map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                          {activeTab === 'departments' ? <Building2 className="w-5 h-5" /> : activeTab === 'courses' ? <BookOpen className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.name || `${item.course?.name} (${item.startYear}-${item.endYear})`}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.code || 'BATCH'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500">
                        {activeTab === 'departments' && `HOD: ${item.headOfDepartment?.name || 'TBA'}`}
                        {activeTab === 'courses' && `${item.degreeType} • ${item.durationYears} Years`}
                        {activeTab === 'batches' && `Semester: ${item.currentSemester}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
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

export default HierarchyPage;
