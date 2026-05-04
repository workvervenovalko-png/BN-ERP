'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Save, 
  Loader2,
  Globe,
  Radio,
  Clock,
  Trash2,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings(res.data.settings);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/settings', settings);
      alert('Settings updated successfully!');
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center p-20 animate-pulse">
         <Loader2 className="w-12 h-12 text-indigo-100 animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                 <SettingsIcon className="w-7 h-7" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Global Settings</h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Manage ERP configurations and geo-fencing</p>
              </div>
           </div>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 disabled:opacity-70"
           >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Configuration</>}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* College Information */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                 <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter">Institution Identity</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">College Name</label>
                       <input 
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.collegeName}
                         onChange={(e) => setSettings({...settings, collegeName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Year</label>
                       <input 
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.academicYear}
                         onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Email</label>
                       <input 
                         type="email" 
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.collegeEmail}
                         onChange={(e) => setSettings({...settings, collegeEmail: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Phone</label>
                       <input 
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.collegePhone}
                         onChange={(e) => setSettings({...settings, collegePhone: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Address</label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none"
                      value={settings.collegeAddress}
                      onChange={(e) => setSettings({...settings, collegeAddress: e.target.value})}
                    />
                 </div>
              </div>

              {/* Geo-fencing Settings */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                 <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-6 h-6 text-indigo-600 font-extrabold" />
                       <h3 className="text-xl font-black text-gray-900 tracking-tighter">Geo-Fence Configuration</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{settings.geoFence.enabled ? 'Active' : 'Disabled'}</span>
                       <button 
                         onClick={() => setSettings({...settings, geoFence: {...settings.geoFence, enabled: !settings.geoFence.enabled}})}
                         className={cn(
                           "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                           settings.geoFence.enabled ? "bg-indigo-600" : "bg-gray-200"
                         )}
                       >
                         <span className={cn(
                           "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                           settings.geoFence.enabled ? "translate-x-6" : "translate-x-1"
                         )} />
                       </button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campus Latitude</label>
                       <input 
                         type="number" 
                         step="0.000001"
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.geoFence.latitude}
                         onChange={(e) => setSettings({...settings, geoFence: {...settings.geoFence, latitude: parseFloat(e.target.value)}})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campus Longitude</label>
                       <input 
                         type="number" 
                         step="0.000001"
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.geoFence.longitude}
                         onChange={(e) => setSettings({...settings, geoFence: {...settings.geoFence, longitude: parseFloat(e.target.value)}})}
                       />
                    </div>
                 </div>
                 <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-50 space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                          <Radio className="w-4 h-4 animate-pulse" /> Allowed Radius
                       </label>
                       <span className="text-xl font-black text-indigo-600">{settings.geoFence.radius} Meters</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="1000" 
                      step="50"
                      className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      value={settings.geoFence.radius}
                      onChange={(e) => setSettings({...settings, geoFence: {...settings.geoFence, radius: parseInt(e.target.value)}})}
                    />
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight text-center italic">Accuracy may vary depending on teacher's device GPS hardware.</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              {/* Logo Upload */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Institution Logo</h3>
                 <div className="w-32 h-32 rounded-3xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 group hover:border-indigo-300 transition-colors cursor-pointer overflow-hidden relative">
                    {settings.collegeLogo ? (
                       <img src={settings.collegeLogo} className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-indigo-400" />
                    )}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <Plus className="text-white w-8 h-8" />
                    </div>
                 </div>
              </div>

              {/* Thresholds */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Policy Rules</h3>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Threshold (%)</label>
                       <input 
                         type="number" 
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                         value={settings.lowAttendanceThreshold}
                         onChange={(e) => setSettings({...settings, lowAttendanceThreshold: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl">
                 <Clock className="w-8 h-8 text-indigo-400 mb-6" />
                 <h4 className="text-lg font-black tracking-tight leading-none mb-4">Audit Log</h4>
                 <p className="text-xs text-gray-400 font-bold leading-relaxed">
                   Changes to institution policy and geo-fencing are logged. Last modified by Super Admin.
                 </p>
                 <button className="mt-8 text-[10px] font-black uppercase text-indigo-400 tracking-widest border-b border-indigo-400/30">View Security Log</button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
