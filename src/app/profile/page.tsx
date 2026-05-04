'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Loader2, 
  Lock, 
  ShieldCheck,
  GraduationCap,
  Building2,
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '',
    // password fields
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
        phone: (user as any).phone || '',
        address: (user as any).address || '',
        profilePhoto: user.profilePhoto || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        profilePhoto: formData.profilePhoto
      });
      updateUser(res.data.user);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      alert('Password changed successfully!');
      setIsChangingPassword(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error changing password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="relative group">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-3xl overflow-hidden shadow-inner uppercase">
                    {formData.profilePhoto ? (
                       <img src={formData.profilePhoto} className="w-full h-full object-cover" />
                    ) : user?.name.charAt(0)}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                       <Camera className="text-white w-8 h-8" />
                    </div>
                 </div>
              </div>
              <div className="space-y-1">
                 <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none uppercase">{user?.name}</h1>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{user?.role} • {user?.email}</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-6 py-4 bg-gray-50 text-gray-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Lock className="w-4 h-4 mr-2 inline" /> {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2">
              {!isChangingPassword ? (
                <form onSubmit={handleUpdateProfile} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                   <div className="flex items-center gap-3 pb-8 border-b border-gray-50">
                      <User className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Personal Information</h3>
                   </div>
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Complete Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Email Identity</label>
                          <input 
                            required
                            type="email" 
                            className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Mobile Contact *</label>
                          <input 
                            required
                            type="text" 
                            className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                       </div>
                    </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Residential Address</label>
                      <textarea 
                        rows={3}
                        className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                   </div>

                   <button 
                     disabled={isSaving}
                     className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                   >
                     {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Confirm Profile Changes</>}
                   </button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10 animate-in slide-in-from-right duration-500">
                   <div className="flex items-center gap-3 pb-8 border-b border-gray-50">
                      <Lock className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Security Protocol</h3>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Current System Password</label>
                         <input 
                           required
                           type="password" 
                           className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                           value={formData.currentPassword}
                           onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                         />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">New Password</label>
                            <input 
                              required
                              type="password" 
                              className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verify New Password</label>
                            <input 
                              required
                              type="password" 
                              className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl text-[15px] font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   <button 
                     disabled={isSaving}
                     className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                   >
                     {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Reset Authentication Code</>}
                   </button>
                </form>
              )}
           </div>

           <div className="space-y-8">
              <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <ShieldCheck className="w-12 h-12 text-indigo-400 mb-8 font-black" />
                 <h4 className="text-xl font-black tracking-tight leading-none mb-4 uppercase italic">Institutional Data</h4>
                 <div className="space-y-6 mt-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300">
                          <GraduationCap className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none">Identity Code</p>
                          <p className="text-[15px] font-black mt-1 uppercase tracking-tighter leading-none">{(user as any).rollNo || (user as any).employeeId || 'ERPoly-ADMIN'}</p>
                       </div>
                    </div>
                    {(user?.role === 'student' || user?.role === 'teacher') && (
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300">
                             <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none">Academic Division</p>
                             <p className="text-[15px] font-black mt-1 uppercase tracking-tighter leading-none">{(user as any).department || (user as any).course || 'GENERAL'}</p>
                          </div>
                       </div>
                    )}
                 </div>
                 <div className="absolute top-0 right-0 p-10 -translate-y-4 translate-x-4 opacity-5 group-hover:opacity-10 transition-all duration-700">
                    <User className="w-64 h-64" />
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex bg-gray-50 p-6 rounded-[2rem] gap-4">
                    <Calendar className="w-10 h-10 text-gray-300 shrink-0" />
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Account Lifespan</p>
                       <p className="text-sm font-black text-gray-600 mt-2 uppercase tracking-tight">Active Member since 2024</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
