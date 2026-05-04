'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  Plus, 
  Navigation,
  CheckCircle,
  Users
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const TransportPage = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transport/routes');
      setRoutes(res.data.routes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Transport System</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <Bus className="w-4 h-4" /> Bus Routes & Vehicle Tracking
            </p>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Route
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {routes.map((route) => (
            <div key={route._id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-indigo-50 transition-all group">
              <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight leading-none">{route.routeName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-indigo-200">Bus Route Info</p>
                 </div>
                 <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
                   <Navigation className="w-8 h-8" />
                 </div>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Stops */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Route Stops</p>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-indigo-50"></div>
                    {route.stops.map((stop: string, idx: number) => (
                      <div key={idx} className="relative flex items-center gap-4">
                        <div className={cn(
                          "absolute -left-[1.35rem] w-3 h-3 rounded-full border-2 border-white shadow-sm",
                          idx === 0 || idx === route.stops.length - 1 ? "bg-indigo-600" : "bg-indigo-200"
                        )}></div>
                        <p className="text-sm font-bold text-gray-700">{stop}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts At</p>
                        <p className="text-sm font-black text-gray-900">{route.startTime || '08:00 AM'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fees</p>
                        <p className="text-sm font-black text-gray-900">₹{route.feePerSemester || '5000'}</p>
                      </div>
                   </div>
                </div>

                <button className="w-full py-4 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
                  View Assigned Vehicles <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-2xl font-black tracking-tighter">Add New Route</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const target = e.target as any;
                try {
                  await api.post('/transport/route', { 
                    routeName: target.routeName.value,
                    stops: target.stops.value.split(','),
                    feePerSemester: target.fee.value
                  });
                  setIsModalOpen(false);
                  fetchRoutes();
                } catch (err) { alert('Error adding route'); }
              }} className="p-10 space-y-6">
                 <input name="routeName" placeholder="Route Name (e.g. Route 1) *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                 <textarea name="stops" placeholder="Stops (comma separated) *" required rows={3} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                 <input name="fee" type="number" placeholder="Fee Per Semester *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                 <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all">Save Route</button>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TransportPage;
