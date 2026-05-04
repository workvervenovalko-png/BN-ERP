'use client';

import React, { useState } from 'react';
import { 
  X, Upload, FileText, CheckCircle, AlertCircle, 
  Loader2, FileSpreadsheet, File as FileIcon 
} from 'lucide-react';
import api from '@/lib/api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'student' | 'teacher';
  onSuccess: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, role, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    try {
      const response = await api.post('/users/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      if (response.data.results.success > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            Bulk {role.charAt(0).toUpperCase() + role.slice(1)} Upload
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {!result ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.pdf,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {file ? (
                  <div className="text-center overflow-hidden w-full">
                    {file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? (
                      <FileSpreadsheet className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    ) : file.name.endsWith('.pdf') ? (
                      <FileText className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    ) : (
                      <FileIcon className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    )}
                    <p className="text-slate-900 dark:text-white font-medium truncate">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-slate-300 group-hover:text-indigo-500 transition-colors mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-300 font-medium font-outfit">Click or drag to upload</p>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest italic">
                      {role === 'student' ? 'Roll No, Name, Email, DOB' : 'Name, Email, Emp ID'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Excel, CSV, or Word files</p>
                  </div>
                )}
              </div>

              {role === 'student' && !file && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                   <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Automated Rules</p>
                   <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium">
                      <li className="flex gap-2"><span>•</span> Login ID will be the <strong>Roll Number</strong></li>
                      <li className="flex gap-2"><span>•</span> Password will be set as <strong>DOB</strong></li>
                      <li className="flex gap-2"><span>•</span> Email will be sent if address is provided</li>
                   </ul>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 ${
                  !file || loading 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {loading ? 'Processing...' : 'Upload & Process'}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Complete</h3>
                <p className="text-slate-500 mt-1">{result.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                  <span className="block text-2xl font-bold text-green-600">{result.results.success}</span>
                  <span className="text-xs font-semibold text-green-700/70 uppercase">Success</span>
                </div>
                <div className={result.results.failed > 0 ? "bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30" : "bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700"}>
                  <span className={`block text-2xl font-bold ${result.results.failed > 0 ? 'text-red-600' : 'text-slate-400'}`}>{result.results.failed}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Failed</span>
                </div>
              </div>

              {result.results.errors.length > 0 && (
                <div className="text-left max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Error Details</p>
                  <ul className="space-y-1">
                    {result.results.errors.slice(0, 10).map((err: string, i: number) => (
                      <li key={i} className="text-xs text-red-500 flex gap-2">
                        <span>•</span> {err}
                      </li>
                    ))}
                    {result.results.errors.length > 10 && (
                      <li className="text-xs text-slate-400 italic">...and {result.results.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
