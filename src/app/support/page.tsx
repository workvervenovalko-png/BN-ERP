'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Upload, CheckCircle2, AlertCircle, Loader2, ShieldQuestion } from 'lucide-react';
import api from '@/lib/api';

export default function SupportPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('description', description);
    if (file) formData.append('screenshot', file);

    try {
      await api.post('/issues/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-indigo-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Report Submitted!</h2>
          <p className="text-gray-500 font-bold leading-relaxed mb-10">
            Thank you for bringing this to our attention. Our team will review your report and get back to you via email shortly.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden">
          <div className="p-10 lg:p-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <ShieldQuestion className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Support & Issues</h1>
                <p className="text-gray-500 font-bold text-xs mt-1 italic opacity-60">Help us improve your institutional experience.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-gray-900"
                    placeholder="Where should we reply?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-gray-900"
                    placeholder="Short summary of issue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-gray-900 resize-none"
                  placeholder="Explain the problem in detail..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Screenshot (Optional)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label 
                    htmlFor="screenshot-upload"
                    className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-300 group-hover:text-indigo-500 mb-2 transition-colors" />
                    <p className="text-xs font-bold text-gray-500">{file ? file.name : 'Upload Screenshot (JPEG, PNG)'}</p>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-[10px] text-red-600 font-black uppercase tracking-wider flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit Report
                    <Send className="w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
