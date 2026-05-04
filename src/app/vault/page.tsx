'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  FileBadge,
  CreditCard,
  GraduationCap,
  FilePlus,
  Loader2,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn, getFileUrl } from '@/lib/utils';

const VaultPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Upload Form
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'Certificate',
    file: null as File | null
  });

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vault', {
        params: { userId: user?.role === 'admin' ? '' : user?._id }
      });
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) return;

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('category', uploadData.category);
    formData.append('file', uploadData.file);

    try {
      await api.post('/vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setUploadData({ title: '', category: 'Certificate', file: null });
      fetchDocs();
    } catch (err) {
      alert('Error uploading document');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this document permanently?')) {
      try {
        await api.delete(`/vault/${id}`);
        fetchDocs();
      } catch (err) {
        alert('Error deleting document');
      }
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === '' || doc.category === category)
  );

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'ID Card': return <CreditCard className="w-6 h-6" />;
      case 'Certificate': return <FileBadge className="w-6 h-6" />;
      case 'Marksheet': return <GraduationCap className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Document Vault</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure Academic & Personal Storage
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
          >
            <FilePlus className="w-5 h-5" /> Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in vault..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>ID Card</option>
            <option>Certificate</option>
            <option>Marksheet</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse"></div>)
          ) : filteredDocs.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
               <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest">Your vault is empty</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-100 bg-red-600 rounded-lg hover:bg-red-700 shadow-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                   {getIcon(doc.category)}
                </div>

                <h3 className="text-lg font-black text-gray-900 tracking-tight truncate mb-1">{doc.title}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">{doc.category}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  <a 
                    href={getFileUrl(doc.fileUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-2xl font-black tracking-tighter">Secure Upload</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-10 space-y-6">
                 <div className="space-y-4">
                    <input placeholder="Document Title *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
                    <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})}>
                       <option>Certificate</option>
                       <option>ID Card</option>
                       <option>Marksheet</option>
                       <option>Other</option>
                    </select>
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50 text-center group-hover:border-indigo-200 transition-all">
                       <input 
                        type="file" 
                        required 
                        className="hidden" 
                        id="fileInput"
                        onChange={e => setUploadData({...uploadData, file: e.target.files ? e.target.files[0] : null})}
                       />
                       <label htmlFor="fileInput" className="cursor-pointer">
                          <Upload className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{uploadData.file ? uploadData.file.name : 'Select PDF or Image'}</p>
                       </label>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 transition-all">
                   Upload to Vault
                 </button>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VaultPage;
