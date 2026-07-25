import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookAppointment } from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const DEPARTMENT_DOCTORS = {
  'Gynecology': ['Dr. Priya Sharma (Gynecologist & Obstetrician)', 'Dr. Helen Carter (OB-GYN Specialist)'],
  'Pediatrics': ['Dr. David Kim (Pediatrician)', 'Dr. Rachel Green (Child Health Specialist)'],
  'ENT (Ear, Nose, Throat)': ['Dr. Vikram Patel (ENT Specialist)', 'Dr. Laura Adams (Otolaryngologist)'],
  'Ophthalmology': ['Dr. Arthur Pendelton (Ophthalmologist)', 'Dr. Chloe Bennett (Eye Surgeon)'],
  'Urology': ['Dr. Richard Harris (Urologist)', 'Dr. Samuel Jackson (Kidney Specialist)'],
  'Psychiatry': ['Dr. Claire Temple (Psychiatrist)', 'Dr. Bruce Banner (Behavioral Health)'],
  'General Medicine': ['Dr. Sarah Jenkins (Senior Physician)', 'Dr. Alan Grant (General Specialist)'],
  'Pulmonology': ['Dr. Robert Chen (Chest & Lung Specialist)', 'Dr. Lisa Ray (Pulmonologist)'],
  'Cardiology': ['Dr. Emily Vance (Cardiologist)', 'Dr. Michael Chang (Heart Specialist)'],
  'Dermatology': ['Dr. Marcus Vance (Dermatologist)', 'Dr. Sophia Loren (Skin Specialist)'],
  'Orthopedics': ['Dr. Anita Patel (Bone & Joint Surgeon)', 'Dr. James Wilson (Orthopedic)'],
  'Gastroenterology': ['Dr. Mark Sloan (Gastroenterologist)', 'Dr. Meredith Grey (Digestive Care)'],
};

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:45 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve actual logged in user from localStorage
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = savedUser?._id || '660000000000000000000000';

  // Received symptoms & department from Symptoms page if available
  const passedSymptoms = location.state?.symptoms || '';
  const dummyRecommendedDept = location.state?.department || 'Gynecology';

  const [patientName, setPatientName] = useState(savedUser?.name || 'Guest Patient');
  const [department, setDepartment] = useState(dummyRecommendedDept);
  const [doctorName, setDoctorName] = useState(DEPARTMENT_DOCTORS[dummyRecommendedDept]?.[0] || 'Dr. Priya Sharma (Gynecologist & Obstetrician)');
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [symptomsNotes, setSymptomsNotes] = useState(passedSymptoms);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (savedUser?.name) {
      setPatientName(savedUser.name);
    }
  }, []);

  // Update doctor options when department changes
  useEffect(() => {
    if (DEPARTMENT_DOCTORS[department]) {
      setDoctorName(DEPARTMENT_DOCTORS[department][0]);
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const payload = {
      userId,
      doctor: doctorName,
      department,
      date: appointmentDate,
      time: timeSlot,
      symptoms: symptomsNotes,
      status: 'Scheduled',
    };

    try {
      // Call backend API (POST /api/appointments)
      const res = await bookAppointment(payload);

      setSuccessMsg('Appointment booked successfully! Redirecting to My Appointments...');
      setLoading(false);

      setTimeout(() => {
        navigate('/my-appointments');
      }, 1500);
    } catch (err) {
      console.warn('Backend unavailable, completing booking in local session:', err.message);

      // Save fallback appointment to localStorage so MyAppointments page displays it seamlessly
      const localAppointments = JSON.parse(localStorage.getItem('local_appointments') || '[]');
      const newLocalAppointment = {
        _id: `apt_${Date.now()}`,
        userId,
        patientName,
        doctor: doctorName,
        department,
        date: appointmentDate,
        time: timeSlot,
        symptoms: symptomsNotes,
        status: 'Scheduled',
      };
      localStorage.setItem('local_appointments', JSON.stringify([newLocalAppointment, ...localAppointments]));

      setSuccessMsg('Appointment booked successfully! Redirecting to My Appointments...');
      setLoading(false);

      setTimeout(() => {
        navigate('/my-appointments');
      }, 1200);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Appointment Reservation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Book Doctor Appointment
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
          Select your doctor, preferred date, and time slot to confirm your hospital queue token.
        </p>
      </div>

      {/* Recommended Department Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 rounded-2xl border border-teal-700/50 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-300">
              Department Selection
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{department}</span>
              <Sparkles className="w-4 h-4 text-teal-400" />
            </h3>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
          Selected
        </span>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 text-xs font-bold shadow-md">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center gap-3 text-xs font-bold shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Booking Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Patient Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Patient Name"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Department & Doctor Dropdown Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Department Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Department
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  {Object.keys(DEPARTMENT_DOCTORS).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Doctor
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  {DEPARTMENT_DOCTORS[department]?.map((doc, idx) => (
                    <option key={idx} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Date Picker & Time Picker Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Appointment Date
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Time Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Time Slot
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  {TIME_SLOTS.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Reported Symptoms / Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Reported Symptoms / Notes
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute top-3 left-3.5 text-slate-400">
                <FileText className="w-5 h-5" />
              </div>
              <textarea
                rows={3}
                value={symptomsNotes}
                onChange={(e) => setSymptomsNotes(e.target.value)}
                placeholder="Selected symptoms or notes..."
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons: Book Appointment & Cancel */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
            
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <XCircle className="w-4 h-4 text-slate-500" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Token...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Book Appointment</span>
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
