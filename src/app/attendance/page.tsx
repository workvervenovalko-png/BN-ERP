'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileSpreadsheet, 
  Camera, 
  ClipboardList,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  History as HistoryIcon,
  User2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const TeacherAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isInCollege, setIsInCollege] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [step, setStep] = useState(1); // 1: Verify Location, 2: Select Class, 3: Mark Students
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/users/teacher/subjects');
        setSubjects(res.data.subjects);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
    if (user?.role === 'teacher') fetchSubjects();
  }, [user]);

  if (!isMounted) return null;

  const verifyLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await api.post('/auth/verify-location', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsInCollege(res.data.isInside);
        setDistance(res.data.distance);
        if (res.data.isInside) setStep(2);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      alert("Please enable location access to mark attendance");
      setLoading(false);
    });
  };

  const fetchClassStudents = async (subjectId: string) => {
    try {
      setLoading(true);
      setSelectedSubject(subjectId);
      // In a real app, you'd fetch students specifically for this subject/section
      const res = await api.get('/users/students?limit=50');
      setStudents(res.data.students);
      
      // Initialize all as present
      const init: Record<string, 'Present' | 'Absent'> = {};
      res.data.students.forEach((s: any) => init[s._id] = 'Present');
      setAttendanceData(init);
      
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAttendance = async () => {
    try {
      setLoading(true);
      const payload = {
        subjectId: selectedSubject,
        date: new Date().toISOString(),
        students: Object.entries(attendanceData).map(([id, status]) => ({ studentId: id, status }))
      };
      await api.post('/attendance/mark', payload);
      alert('Attendance marked successfully!');
      setStep(1);
    } catch (err) {
      alert('Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-700",
            isInCollege === false ? "bg-red-50 text-red-600 animate-bounce" : "bg-indigo-50 text-indigo-600"
          )}>
            <MapPin className="w-12 h-12" />
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Verification Required</h2>
            <p className="text-gray-500 font-bold tracking-tight">To ensure integrity, you must be within the college premises (200m radius) to mark attendance.</p>
          </div>
          
          {isInCollege === false && (
             <div className="p-4 bg-red-50 border border-red-100 rounded-2xl w-full flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
               <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
               <div className="text-left">
                 <p className="text-sm font-black text-red-600 uppercase tracking-widest leading-none">Access Denied</p>
                 <p className="text-xs text-red-500 font-bold mt-1">You are {distance}m away. Please move inside the campus.</p>
               </div>
             </div>
          )}

          <button 
            onClick={verifyLocation}
            disabled={loading}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 disabled:opacity-70 group"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify My Location <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Select Your Class</h2>
              <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Marking attendance for {format(new Date(), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl text-green-600 font-black text-[10px] uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" /> Location Verified
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {subjects.length > 0 ? subjects.map(sub => (
               <div key={sub._id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]" onClick={() => fetchClassStudents(sub._id)}>
                 <div>
                   <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] bg-indigo-50 px-2 py-1 rounded-md">{sub.code}</span>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tighter mt-4 leading-none group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                   <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Section {sub.section} • {sub.studentCount} Students</p>
                 </div>
                 <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-50">
                    <span className="text-xs font-black text-gray-900 uppercase">Ready for Attendance</span>
                    <button className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
               </div>
             )) : (
               <div className="col-span-full h-40 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                 <p className="text-gray-400 font-bold uppercase tracking-widest">No subjects assigned to you</p>
               </div>
             )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-10">
            <div className="flex items-center gap-4">
               <button onClick={() => setStep(2)} className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">Software Engineering</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-widest">CS301 • Section A • {students.length} Total</p>
               </div>
            </div>
            
            <div className="flex bg-gray-50 p-1.5 rounded-2xl">
               <div className="px-4 py-2 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                  Present: {Object.values(attendanceData).filter(s => s === 'Present').length}
               </div>
               <div className="px-4 py-2 flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest border-l border-gray-200">
                  Absent: {Object.values(attendanceData).filter(s => s === 'Absent').length}
               </div>
            </div>

            <button 
              onClick={submitAttendance}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all"
            >
              Submit Attendance
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
             <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Student Info</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {students.map(s => (
                     <tr key={s._id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-indigo-600 text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {s.rollNo.slice(-2)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 leading-none">{s.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{s.rollNo}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1 bg-gray-100 rounded-2xl p-1.5 w-fit ml-auto">
                            <button 
                              onClick={() => setAttendanceData({...attendanceData, [s._id]: 'Present'})}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                attendanceData[s._id] === 'Present' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:text-indigo-600"
                              )}
                            >
                              {attendanceData[s._id] === 'Present' && <CheckCircle2 className="w-3 h-3" />} Present
                            </button>
                            <button 
                              onClick={() => setAttendanceData({...attendanceData, [s._id]: 'Absent'})}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                attendanceData[s._id] === 'Absent' ? "bg-red-600 text-white shadow-lg shadow-red-100" : "text-gray-500 hover:text-red-600"
                              )}
                            >
                              {attendanceData[s._id] === 'Absent' && <XCircle className="w-3 h-3" />} Absent
                            </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ControllerAttendance = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk' | 'report' | 'logs'>('manual');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent'>>({});
  
  const [options, setOptions] = useState<{courses: string[], specializations: string[], years: string[], sections: string[]}>({
     courses: [], specializations: [], years: [], sections: []
  });

  const [filters, setFilters] = useState({
    course: '',
    year: '',
    section: 'A',
    specialization: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{message: string, type: 'success' | 'error' | null}>({message: '', type: null});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/users/subjects');
        if (res.data.success) setSubjects(res.data.subjects);
      } catch (err) {
        console.error('Subject Fetch Error:', err);
      }
    };
    const fetchFilters = async () => {
      try {
        const res = await api.get('/users/attendance-filters');
        if (res.data.success) setOptions(res.data.options);
      } catch (err) {
        console.error('Filter Fetch Error:', err);
      }
    };
    fetchSubjects();
    fetchFilters();
  }, []);

  const fetchStudents = async () => {
    if (!filters.course || !filters.year) {
       return alert('Please select Course and Year');
    }
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/users/attendance-students?${query}`);
      setStudents(res.data.students);
      
      const init: Record<string, 'Present' | 'Absent'> = {};
      res.data.students.forEach((s: any) => init[s._id] = 'Present');
      setAttendanceData(init);
    } catch (err) {
      alert('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/history');
      if (res.data.success) setHistory(res.data.history);
    } catch (err) {
      console.error('History Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!selectedSubject) return alert('Please select a subject');
    try {
      setLoading(true);
      const payload = {
        subjectId: selectedSubject,
        date: new Date().toISOString(),
        students: Object.entries(attendanceData).map(([id, status]) => ({ studentId: id, status }))
      };
      await api.post('/attendance/mark', payload);
      alert('Attendance marked successfully for today!');
    } catch (err) {
      alert('Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedSubject) return alert('Please select a file and subject');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', selectedSubject);
    formData.append('date', new Date().toISOString());
    formData.append('course', filters.course);
    formData.append('year', filters.year);
    formData.append('section', filters.section);

    try {
      setLoading(true);
      setUploadStatus({message: 'Analyzing file and syncronizing record...', type: null});
      const res = await api.post('/attendance/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus({message: res.data.message || 'File processed successfully!', type: 'success'});
      alert('File processed successfully!');
    } catch (err: any) {
      setUploadStatus({message: err.response?.data?.message || 'Error processing file', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex w-fit">
         <button 
           onClick={() => setActiveTab('manual')}
           className={cn(
             "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
             activeTab === 'manual' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-600"
           )}
         >
           Manual Entry
         </button>
         <button 
           onClick={() => setActiveTab('bulk')}
           className={cn(
             "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
             activeTab === 'bulk' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-600"
           )}
         >
           Bulk Upload
         </button>
         <button 
           onClick={() => {
             setActiveTab('report');
             if (filters.course && filters.year) fetchStudents();
           }}
           className={cn(
             "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
             activeTab === 'report' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-600"
           )}
         >
           Attendance Report
         </button>
         <button 
           onClick={() => {
             setActiveTab('logs');
             fetchHistory();
           }}
           className={cn(
             "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
             activeTab === 'logs' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-600"
           )}
         >
           Attendance Logs
         </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pb-8 border-b border-gray-50">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1. Course</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value, specialization: '', year: '', section: ''})}
              >
                <option value="">Course</option>
                {options.courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">2. Spec.</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={filters.specialization}
                onChange={(e) => setFilters({...filters, specialization: e.target.value, year: '', section: ''})}
              >
                <option value="">Spec.</option>
                {options.specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3. Year</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value, section: ''})}
              >
                <option value="">Year</option>
                {options.years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4. Section</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
              >
                <option value="">Section</option>
                {options.sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">5. Subject</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Subject</option>
                {subjects.filter(s => 
                  (filters.course ? s.course === filters.course : true) && 
                  (filters.specialization ? s.specialization === filters.specialization : true) && 
                  (filters.year ? s.year === filters.year : true) && 
                  (filters.section ? s.section === filters.section : true)
                ).map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                ))}
              </select>
           </div>
        </div>

        {activeTab === 'manual' ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
               <div className="flex gap-4">
                  <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <ClipboardList className="w-4 h-4" /> Ready to Mark: {students.length}
                  </div>
                  <button 
                    onClick={() => {
                        const allPresent: Record<string, 'Present' | 'Absent'> = {};
                        students.forEach(s => allPresent[s._id] = 'Present');
                        setAttendanceData(allPresent);
                    }}
                    className="text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    Select All Present
                  </button>
               </div>
               <button 
                onClick={fetchStudents}
                className="px-6 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all"
               >
                 Search Students
               </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-50">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-300 uppercase tracking-widest">Roll No</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-300 uppercase tracking-widest">Full Name</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-300 uppercase tracking-widest">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.length > 0 ? students.map(s => (
                    <tr key={s._id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wide">{s.rollNo}</td>
                      <td className="px-8 py-4">
                         <p className="text-sm font-black text-gray-900">{s.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.course} • {s.section}</p>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 bg-gray-100 rounded-xl p-1 w-fit ml-auto">
                          <button 
                             onClick={() => setAttendanceData({...attendanceData, [s._id]: 'Present'})}
                             className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", attendanceData[s._id] === 'Present' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400")}
                          >P</button>
                          <button 
                             onClick={() => setAttendanceData({...attendanceData, [s._id]: 'Absent'})}
                             className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", attendanceData[s._id] === 'Absent' ? "bg-white text-red-600 shadow-sm" : "text-gray-400")}
                          >A</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest italic">Apply filters to list students</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {students.length > 0 && (
               <div className="flex justify-end pt-8">
                  <button 
                    onClick={handleManualSubmit}
                    disabled={loading}
                    className="px-10 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Submit {students.length} Records</>}
                  </button>
               </div>
            )}
          </div>
        ) : activeTab === 'report' ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                 <ClipboardList className="w-6 h-6 text-indigo-600" />
                 Attendance Status Report
              </h3>
              <button 
                onClick={fetchStudents}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all"
              >
                Refresh Report
              </button>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll No</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance %</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {students.length > 0 ? students.map(s => (
                     <tr key={s._id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-8 py-5">
                          <p className="text-sm font-black text-gray-900">{s.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{s.specialization || 'General'}</p>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-tight">{s.rollNo}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-full max-w-[100px] bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full transition-all duration-1000", parseFloat(s.stats?.percent) >= 75 ? "bg-green-500" : "bg-red-500")} 
                                style={{ width: `${s.stats?.percent}%` }}
                              ></div>
                            </div>
                            <span className={cn("text-sm font-black tracking-tighter", parseFloat(s.stats?.percent) >= 75 ? "text-green-600" : "text-red-600")}>
                               {s.stats?.percent}%
                            </span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <p className="text-xs font-black text-gray-600 uppercase tracking-widest">{s.stats?.present}/{s.stats?.total} Classes</p>
                       </td>
                     </tr>
                   )) : (
                     <tr><td colSpan={4} className="py-24 text-center text-gray-300 font-bold uppercase tracking-widest italic flex flex-col items-center gap-4">
                        <AlertCircle className="w-10 h-10 text-gray-200" />
                        Select Course and Year to view report
                     </td></tr>
                   )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'logs' ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                 <HistoryIcon className="w-6 h-6 text-indigo-600" />
                 Marked Sessions Log
              </h3>
              <button 
                onClick={fetchHistory}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all"
              >
                Refresh Logs
              </button>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Subject</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Course & Year</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Marked By</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Presence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length > 0 ? history.map((session, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                         <p className="text-sm font-black text-gray-900">{format(new Date(session.date), 'MMM dd, yyyy')}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session.subject.name}</p>
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{session.subject.course}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{session.subject.year} • Section {session.subject.section}</p>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                             <User2 className="w-4 h-4" />
                           </div>
                           <div>
                             <p className="text-xs font-black text-gray-900">{session.marker.name}</p>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tight">{session.marker.role}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="inline-flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900 tracking-tighter">{session.present}/{session.total} Present</span>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                               <div className="h-full bg-indigo-600" style={{ width: `${(session.present/session.total)*100}%` }}></div>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-24 text-center text-gray-300 font-bold uppercase tracking-widest italic flex flex-col items-center gap-4">
                        <HistoryIcon className="w-10 h-10 text-gray-200" />
                        No marked sessions found.
                     </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFileUpload} className="space-y-8 animate-in zoom-in duration-300">
            <div className="relative group flex flex-col items-center justify-center p-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-all cursor-pointer">
              <input 
                 type="file" 
                 className="absolute inset-0 opacity-0 cursor-pointer"
                 onChange={(e) => setFile(e.target.files?.[0] || null)}
                 accept=".xlsx,.pdf,.docx,.jpg,.png"
              />
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                 {file ? <CheckCircle2 className="w-10 h-10 text-green-500" /> : <Camera className="w-10 h-10" />}
              </div>
              <p className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                {file ? file.name : "Choose Attendance File"}
              </p>
              <p className="text-xs text-gray-400 font-bold mt-3 uppercase tracking-widest">Excel, PDF, Word, or Image Sheets</p>
            </div>

            {uploadStatus.message && (
               <div className={cn(
                 "p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4",
                 uploadStatus.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : 
                 uploadStatus.type === 'error' ? "bg-red-50 text-red-700 border border-red-100" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
               )}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                  <p className="text-sm font-black tracking-tight">{uploadStatus.message}</p>
               </div>
            )}

            <div className="flex justify-center pt-4">
               <button 
                 type="submit"
                 disabled={loading || !file}
                 className="px-12 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Process and Sync Attendance"}
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const StudentAttendance = ({ user }: { user: any }) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/attendance/student/${user._id}`);
        setAttendance(res.data.attendance);
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user._id]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
         <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Your Attendance Record</h2>
            <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">Roll No: {user?.rollNo}</p>
         </div>
         <button className="px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-transform active:scale-95">
            Request Correction
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {Object.entries(stats).length > 0 ? Object.entries(stats).map(([subName, data]: [string, any], i) => (
           <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-all">
              <div className="space-y-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black", 
                  (data.present/data.total) >= 0.75 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                   {data.total > 0 ? Math.round((data.present/data.total)*100) : 0}%
                </div>
                <h3 className="font-black text-gray-900 tracking-tight leading-none truncate">{subName}</h3>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{data.present}/{data.total} Classes</p>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
           </div>
         )) : (
           <div className="col-span-full py-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
              <p className="text-sm font-bold text-gray-400 italic">No subject attendance records found.</p>
           </div>
         )}
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Detailed History</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 tracking-widest"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-red-600 tracking-widest"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {attendance.length > 0 ? attendance.map((rec, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-gray-900">{format(new Date(rec.date), 'MMM dd, yyyy')}</td>
                      <td className="px-8 py-4 text-sm font-bold text-gray-600">{rec.subject?.name}</td>
                      <td className="px-8 py-4 text-right">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          rec.status === 'Present' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>{rec.status}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">No attendance marked yet.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const AttendancePage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.role === 'teacher' && <TeacherAttendance />}
      {(user?.role === 'controller' || user?.role === 'admin') && <ControllerAttendance />}
      {user?.role === 'student' && <StudentAttendance user={user} />}
    </DashboardLayout>
  );
};

export default AttendancePage;
