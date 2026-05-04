'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Building, Calendar, Users, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';

const PlacementAdminPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/placement/drives');
      setDrives(res.data.data);
    } catch (error) {
      toast.error('Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Placement Management</h1>
            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">Post drives and track applications</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">
              <Plus className="w-5 h-5" /> Post Drive
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Company & Role</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Package</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Applications</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold">Loading...</td></tr>
                ) : drives.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold">No drives posted</td></tr>
                ) : drives.map((drive: any) => (
                  <tr key={drive._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{drive.jobRole}</p>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{drive.company?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-600">
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">
                      ₹{drive.packageLPA} LPA
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                           {drive.studentsApplied?.length || 0}
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 justify-end hover:underline">
                        View Apps <ArrowRight className="w-3 h-3" />
                      </button>
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

export default PlacementAdminPage;
