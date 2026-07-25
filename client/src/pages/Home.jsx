import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Activity,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  // Patient name placeholder
  const patientName = 'Alex Morgan';

  return (
    <div className="py-8 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          
          {/* Patient Name Placeholder Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-300 text-xs font-bold border border-white/15 backdrop-blur-md">
            <User className="w-4 h-4 text-teal-400" />
            <span>Patient: {patientName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Welcome to <span className="text-teal-400">Medi-Q</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Your smart queue-free healthcare companion. Analyze your symptoms, get department recommendations, and book instant doctor appointments.
            </p>
          </div>

          {/* Large Button - Start Symptom Analysis */}
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/symptoms"
              className="inline-flex items-center justify-center gap-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <Activity className="w-6 h-6 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Start Symptom Analysis</span>
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-base px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md hover:border-white/30 transition-all"
            >
              <Calendar className="w-5 h-5 text-teal-400" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Card Layout Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Quick Healthcare Services
            </h2>
            <p className="text-slate-500 text-sm">
              Select a service below to manage your visits efficiently
            </p>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Symptom Analysis */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Symptom Checker
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Identify your health symptoms and find the appropriate medical department to consult.
                </p>
              </div>
            </div>
            
            <Link
              to="/symptoms"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 group-hover:text-teal-700 hover:underline pt-2"
            >
              <span>Analyze Symptoms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Book Appointment */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Book Appointment
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Schedule a visit with specialized doctors, choose your slot, and skip waiting lines.
                </p>
              </div>
            </div>

            <Link
              to="/book-appointment"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 hover:underline pt-2"
            >
              <span>Choose Doctor & Slot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: My Appointments */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  My Appointments
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Track your active tokens, review appointment schedules, or cancel visits anytime.
                </p>
              </div>
            </div>

            <Link
              to="/my-appointments"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:text-emerald-700 hover:underline pt-2"
            >
              <span>View Booked Slots</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Zero Waiting Time</h4>
            <p className="text-slate-400 text-xs mt-1">Get precise time slots and skip physical hospital queue lines.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Smart Recommendations</h4>
            <p className="text-slate-400 text-xs mt-1">Instant department suggestions based on your reported symptoms.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Verified Specialists</h4>
            <p className="text-slate-400 text-xs mt-1">Connect with experienced doctors across Cardiology, Neurology, etc.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
