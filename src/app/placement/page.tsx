'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Building, Calendar, Users, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

const StudentPlacementPortal = () => {
  const { user } = useAuth();
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
      toast.error('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId: string) => {
    try {
      await api.post(`/placement/apply/${driveId}`);
      toast.success('Application submitted successfully!');
      fetchDrives();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" /> Career Hub
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Placement Drives</h1>
          <p className="text-gray-500 font-medium mt-1">Explore opportunities and kickstart your professional journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold">Loading opportunities...</div>
          ) : drives.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-white rounded-2xl border border-dashed border-gray-200">
              No active drives at the moment. Check back later!
            </div>
          ) : drives.map((drive: any) => {
            const isApplied = drive.studentsApplied?.some((s: any) => s._id === user?._id || s === user?._id);
            const isEligible = (user?.cgpa || 0) >= (drive.eligibility?.minCGPA || 0) && (user?.backlogs || 0) <= (drive.eligibility?.maxBacklogs || 0);

            return (
              <div key={drive._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100 group-hover:scale-105 transition-transform">
                    <Building className="w-8 h-8 text-gray-300" />
                  </div>
                  {isApplied ? (
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Applied</span>
                  ) : !isEligible ? (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Ineligible
                    </span>
                  ) : (
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Open</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-1">{drive.jobRole}</h3>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">{drive.company?.name}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">CTC Package</p>
                      <p className="text-sm font-black text-gray-900">₹{drive.packageLPA} LPA</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Drive Date</p>
                      <p className="text-sm font-black text-gray-900">{new Date(drive.driveDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Min. CGPA</span>
                    <span className="text-xs font-black text-gray-900">{drive.eligibility?.minCGPA || 0}</span>
                  </div>
                  <button
                    disabled={isApplied || !isEligible}
                    onClick={() => handleApply(drive._id)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      isApplied ? 'bg-gray-50 text-gray-400 cursor-not-allowed' :
                      !isEligible ? 'bg-red-50 text-red-400 cursor-not-allowed' :
                      'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                    }`}
                  >
                    {isApplied ? 'Application Sent' : !isEligible ? 'Ineligible' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPlacementPortal;
