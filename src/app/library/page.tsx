'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Book as BookIcon, 
  Filter, 
  Info,
  CheckCircle2,
  XCircle,
  Library,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const LibraryPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/library/books', {
        params: { search: searchTerm, category }
      });
      setBooks(res.data.books);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Library size={120} className="text-indigo-600" />
           </div>
           <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none text-indigo-700">Digital Library</h1>
            <p className="text-sm text-gray-500 font-bold mt-3 uppercase tracking-widest flex items-center gap-2">
               <BookIcon className="w-4 h-4" /> Browse and Search Academic Resources
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            {user?.role === 'admin' && (
               <a href="/library/manage" className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
                 Manage Inventory
               </a>
            )}
            <a href="/library/history" className="px-6 py-4 bg-white border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2">
              My History
            </a>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Title, Author or ISBN..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none appearance-none transition-all shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Literature">Literature</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-white rounded-[2rem] border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <BookIcon className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No books found</h3>
             <p className="text-gray-400 font-bold text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book._id} className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {book.category}
                    </span>
                    {book.availableCopies > 0 ? (
                      <span className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-500 mb-6">by {book.author}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Copies</p>
                      <p className="text-sm font-black text-gray-900">{book.availableCopies} / {book.totalCopies}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-black text-indigo-600">{book.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
