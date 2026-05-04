'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { 
  ShieldAlert, Clock, CheckCircle2, MessageSquare, 
  ExternalLink, Trash2, Loader2, Search, X, Image as ImageIcon
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues');
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleUpdate = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await api.put(`/issues/${id}`, { status, adminNote });
      setSelectedIssue(null);
      setAdminNote('');
      fetchIssues();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/issues/${id}`);
      fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIssues = issues.filter(i => 
    i.email.toLowerCase().includes(search.toLowerCase()) || 
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Support Requests</h1>
              <p className="text-sm font-bold text-gray-400 mt-1">Manage and resolve user-reported technical issues.</p>
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by email or subject..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Requests</p>
            <p className="text-4xl font-black text-red-600 mt-2">{issues.filter(i => i.status === 'Pending').length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
            <p className="text-4xl font-black text-amber-500 mt-2">{issues.filter(i => i.status === 'In Progress').length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved</p>
            <p className="text-4xl font-black text-green-500 mt-2">{issues.filter(i => i.status === 'Resolved').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Issue Details</th>
                  <th className="px-8 py-5">Reported By</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : filteredIssues.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold italic">No support requests found.</td></tr>
                ) : filteredIssues.map(issue => (
                  <tr key={issue._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{issue.subject}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{issue.description}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-700">{issue.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        issue.status === 'Pending' ? 'bg-red-50 text-red-600' :
                        issue.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedIssue(issue)}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(issue._id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Issue Details Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 lg:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">{selectedIssue.subject}</h2>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Reported by {selectedIssue.email}</p>
                  </div>
                  <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed italic">"{selectedIssue.description}"</p>
                  </div>

                  {selectedIssue.screenshot && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attachment</p>
                      <a 
                        href={`${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${selectedIssue.screenshot}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                      >
                        <ImageIcon className="w-4 h-4" /> View Screenshot <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Resolution Note (Optional)</p>
                    <textarea 
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add a note for the user..."
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleUpdate(selectedIssue._id, 'In Progress')}
                      disabled={updating}
                      className="py-4 bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Set In Progress
                    </button>
                    <button 
                      onClick={() => handleUpdate(selectedIssue._id, 'Resolved')}
                      disabled={updating}
                      className="py-4 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Resolve & Notify User</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
