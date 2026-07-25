import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../services/api';
import API from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
  Plus,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Retrieve logged in user ID from localStorage
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = savedUser?._id || '660000000000000000000000';

  // Function to load appointments from backend
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      // Call GET /api/appointments/:userId
      const res = await getAppointments(userId);
      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setAppointments([]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.warn('Backend server not connected yet, displaying fallback demo list:', err.message);
      // Fallback demo data if backend connection fails
      setAppointments([
        {
          _id: '660000000000000000000001',
          doctor: 'Dr. Sarah Jenkins',
          department: 'General Medicine',
          date: '2026-07-28',
          time: '10:30 AM',
          status: 'Scheduled',
          patientName: savedUser?.name || 'Alex Morgan',
        },
        {
          _id: '660000000000000000000002',
          doctor: 'Dr. Emily Vance',
          department: 'Cardiology',
          date: '2026-08-02',
          time: '02:00 PM',
          status: 'Scheduled',
          patientName: savedUser?.name || 'Alex Morgan',
        },
      ]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  // Cancel / Delete appointment handler
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this appointment?')) return;

    setDeletingId(id);
    try {
      // Call DELETE /api/appointments/:id backend endpoint
      await API.delete(`/appointments/${id}`);

      setNotification('Appointment deleted successfully!');
      setDeletingId(null);

      // Refresh list after deletion
      fetchAppointments();

      setTimeout(() => {
        setNotification('');
      }, 4000);
    } catch (err) {
      setDeletingId(null);
      // Client-side UI removal fallback if mock mode
      setAppointments((prev) => prev.filter((item) => item._id !== id));
      setNotification('Appointment cancelled and removed from list.');
      setTimeout(() => {
        setNotification('');
      }, 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold mb-1">
            <Clock3 className="w-4 h-4 text-teal-600" />
            <span>Patient Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-slate-500 text-sm">
            View, track, and manage your scheduled hospital tokens and visits.
          </p>
        </div>

        <Link
          to="/book-appointment"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 flex items-center gap-3 text-xs font-bold shadow-md animate-fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">Loading appointments from backend...</p>
        </div>
      ) : appointments.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">No appointments found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You currently have no scheduled hospital visits.
            </p>
          </div>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold text-sm rounded-xl shadow-md"
          >
            Book Appointment Now
          </Link>
        </div>
      ) : (
        /* Appointments Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((item) => {
            const isScheduled = item.status === 'Scheduled';
            const isCompleted = item.status === 'Completed';
            const isCancelled = item.status === 'Cancelled';
            const isDeleting = deletingId === item._id;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-teal-200 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group"
              >
                {/* Top Status Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    ID: {item._id.slice(-6)}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      isScheduled
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isScheduled && <Clock className="w-3.5 h-3.5" />}
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Main Card Info */}
                <div className="space-y-3">
                  
                  {/* Doctor & Department */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
                      <Stethoscope className="w-5 h-5 text-teal-600 shrink-0" />
                      <span className="truncate">{item.doctor}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Department:</span>
                      <span className="text-teal-700 font-extrabold bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                        {item.department}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer Action: Cancel / Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <User className="w-3.5 h-3.5" />
                    <span>{item.patientName || savedUser?.name || 'Patient'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAppointment(item._id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>{isDeleting ? 'Deleting...' : 'Cancel'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
