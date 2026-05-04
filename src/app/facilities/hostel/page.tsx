'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bed, 
  Users, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const HostelPage = () => {
  const { user } = useAuth();
  const [hostels, setHostels] = useState<any[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'hostel' | 'room' | 'allot'>('hostel');

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel');
      setHostels(res.data.hostels);
      if (res.data.hostels.length > 0 && !selectedHostel) {
        setSelectedHostel(res.data.hostels[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (hostelId: string) => {
    try {
      const res = await api.get(`/hostel/${hostelId}/rooms`);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    if (selectedHostel) {
      fetchRooms(selectedHostel._id);
    }
  }, [selectedHostel]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight leading-none">Hostel Management</h1>
            <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Accommodation & Room Allocation
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <button 
                onClick={() => { setModalType('hostel'); setIsModalOpen(true); }}
                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Hostel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Hostel List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Available Hostels</h3>
            {hostels.map((h) => (
              <button
                key={h._id}
                onClick={() => setSelectedHostel(h)}
                className={cn(
                  "w-full p-6 rounded-[2rem] border transition-all text-left group flex items-center justify-between",
                  selectedHostel?._id === h._id 
                    ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100" 
                    : "bg-white border-gray-100 hover:border-indigo-200"
                )}
              >
                <div>
                  <p className={cn("text-lg font-black tracking-tight", selectedHostel?._id === h._id ? "text-white" : "text-gray-900")}>{h.name}</p>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", selectedHostel?._id === h._id ? "text-indigo-200" : "text-gray-400")}>{h.type} Hostel</p>
                </div>
                <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", selectedHostel?._id === h._id ? "text-white" : "text-gray-300")} />
              </button>
            ))}
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-3 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rooms in {selectedHostel?.name}</h3>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => { setModalType('room'); setIsModalOpen(true); }}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Room
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {rooms.map((room) => (
                 <div key={room._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Bed className="w-6 h-6" />
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        room.isFull ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                      )}>
                        {room.isFull ? 'Full' : `${room.capacity - room.occupants.length} Spots Left`}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Room {room.roomNumber}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{room.type} | Capacity: {room.capacity}</p>

                    <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Users className="w-3 h-3" /> Occupants
                          </p>
                          {user?.role === 'admin' && !room.isFull && (
                            <button 
                              onClick={() => { setModalType('allot'); setIsModalOpen(true); }}
                              className="text-[10px] font-black text-indigo-600 hover:underline uppercase"
                            >
                              Allot
                            </button>
                          )}
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {room.occupants.map((occ: any) => (
                           <div key={occ._id} className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-600 border border-gray-100">
                             {occ.name.split(' ')[0]}
                           </div>
                         ))}
                         {room.occupants.length === 0 && <p className="text-xs text-gray-300 italic">No occupants yet</p>}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      {/* Modal for Hostel/Room/Allot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-indigo-600 text-white">
              <h3 className="text-2xl font-black tracking-tighter">
                {modalType === 'hostel' ? 'Add New Hostel' : modalType === 'room' ? 'Add New Room' : 'Allot Room'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-indigo-500 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10">
              {modalType === 'hostel' && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  try {
                    await api.post('/hostel', { name: target.name.value, type: target.type.value });
                    setIsModalOpen(false);
                    fetchHostels();
                  } catch (err) { alert('Error adding hostel'); }
                }} className="space-y-6">
                  <input name="name" placeholder="Hostel Name *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                  <select name="type" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold">
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                  </select>
                  <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all">Save Hostel</button>
                </form>
              )}

              {modalType === 'room' && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  try {
                    await api.post('/hostel/room', { 
                      hostelId: selectedHostel._id,
                      roomNumber: target.roomNumber.value,
                      type: target.type.value,
                      capacity: target.capacity.value
                    });
                    setIsModalOpen(false);
                    fetchRooms(selectedHostel._id);
                  } catch (err) { alert('Error adding room'); }
                }} className="space-y-6">
                  <input name="roomNumber" placeholder="Room Number *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                  <select name="type" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold">
                    <option>AC</option>
                    <option>Non-AC</option>
                  </select>
                  <input name="capacity" type="number" placeholder="Capacity *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                  <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all">Save Room</button>
                </form>
              )}

              {modalType === 'allot' && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  try {
                    await api.post('/hostel/allot', { 
                      roomId: target.roomId.value,
                      studentId: target.studentId.value
                    });
                    setIsModalOpen(false);
                    fetchRooms(selectedHostel._id);
                  } catch (err) { alert('Error allotting room'); }
                }} className="space-y-6">
                   <select name="roomId" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold">
                    {rooms.filter(r => !r.isFull).map(r => (
                      <option key={r._id} value={r._id}>Room {r.roomNumber}</option>
                    ))}
                  </select>
                  <input name="studentId" placeholder="Student ID (MongoDB ID) *" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold" />
                  <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all">Allot Student</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HostelPage;
