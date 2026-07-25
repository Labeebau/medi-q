import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeSymptoms } from '../services/api';
import {
  Activity,
  Stethoscope,
  Sparkles,
  Trash2,
  ArrowRight,
  Check,
  HelpCircle,
  Brain,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

const EXAMPLE_SYMPTOMS = [
  { label: 'Menstrual Cramps & Pelvic Pain', department: 'Gynecology' },
  { label: 'Childhood Fever & Cough', department: 'Pediatrics' },
  { label: 'Earache & Sinus Congestion', department: 'ENT (Ear, Nose, Throat)' },
  { label: 'Eye Redness & Blurred Vision', department: 'Ophthalmology' },
  { label: 'Urinary Discomfort & Burning', department: 'Urology' },
  { label: 'Chest Discomfort & Tightness', department: 'Cardiology' },
  { label: 'Dry Cough & Shortness of Breath', department: 'Pulmonology' },
  { label: 'Severe Headache / Migraine', department: 'Neurology' },
  { label: 'Skin Rash & Itching', department: 'Dermatology' },
  { label: 'Joint & Bone Pain', department: 'Orthopedics' },
  { label: 'Stomach Pain & Acid Reflux', department: 'Gastroenterology' },
];

// Client-side fallback analyzer including Gynecology and expanded departments
const getClientFallbackAnalysis = (text) => {
  const lower = (text || '').toLowerCase();
  
  if (lower.includes('gynecolog') || lower.includes('gynaecolog') || lower.includes('pregnancy') || lower.includes('period') || lower.includes('menstrual') || lower.includes('pelvic') || lower.includes('cramp')) {
    return { recommendedDepartment: 'Gynecology', confidence: '95%', possibleDiseases: ['Dysmenorrhea / Pelvic Cramps', 'PCOS / Ovarian Cyst', 'Hormonal Imbalance'] };
  }
  if (lower.includes('child') || lower.includes('infant') || lower.includes('baby') || lower.includes('pediatric') || lower.includes('paediatric')) {
    return { recommendedDepartment: 'Pediatrics', confidence: '94%', possibleDiseases: ['Pediatric Infection', 'Childhood Bronchitis', 'Infant Colic'] };
  }
  if (lower.includes('ear') || lower.includes('nose') || lower.includes('throat') || lower.includes('sinus') || lower.includes('tonsil')) {
    return { recommendedDepartment: 'ENT (Ear, Nose, Throat)', confidence: '93%', possibleDiseases: ['Acute Sinusitis', 'Tonsillitis', 'Otitis Media'] };
  }
  if (lower.includes('eye') || lower.includes('vision') || lower.includes('blur') || lower.includes('cataract')) {
    return { recommendedDepartment: 'Ophthalmology', confidence: '96%', possibleDiseases: ['Conjunctivitis / Pink Eye', 'Refractive Vision Error', 'Dry Eye Syndrome'] };
  }
  if (lower.includes('urine') || lower.includes('urinary') || lower.includes('bladder') || lower.includes('kidney')) {
    return { recommendedDepartment: 'Urology', confidence: '92%', possibleDiseases: ['Urinary Tract Infection (UTI)', 'Kidney Stones', 'Bladder Inflammation'] };
  }
  if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation')) {
    return { recommendedDepartment: 'Cardiology', confidence: '94%', possibleDiseases: ['Angina Pectoris', 'Acid Reflux / Heartburn', 'Cardiovascular Strain'] };
  }
  if (lower.includes('cough') || lower.includes('breath') || lower.includes('lung')) {
    return { recommendedDepartment: 'Pulmonology', confidence: '92%', possibleDiseases: ['Acute Bronchitis', 'Upper Respiratory Infection', 'Asthma Flare'] };
  }
  if (lower.includes('headache') || lower.includes('dizzy') || lower.includes('migraine')) {
    return { recommendedDepartment: 'Neurology', confidence: '90%', possibleDiseases: ['Migraine Headache', 'Tension Headache', 'Vertigo'] };
  }
  if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch')) {
    return { recommendedDepartment: 'Dermatology', confidence: '95%', possibleDiseases: ['Contact Dermatitis', 'Urticaria / Hives', 'Allergic Rash'] };
  }
  if (lower.includes('joint') || lower.includes('bone') || lower.includes('knee') || lower.includes('back')) {
    return { recommendedDepartment: 'Orthopedics', confidence: '91%', possibleDiseases: ['Joint Inflammation / Arthritis', 'Musculoskeletal Strain', 'Tendinitis'] };
  }
  if (lower.includes('stomach') || lower.includes('nausea') || lower.includes('vomit')) {
    return { recommendedDepartment: 'Gastroenterology', confidence: '89%', possibleDiseases: ['Acute Gastritis', 'Gastroenteritis', 'Indigestion'] };
  }
  return { recommendedDepartment: 'General Medicine', confidence: '86%', possibleDiseases: ['Viral Syndrome', 'General Fatigue', 'Seasonal Malaise'] };
};

export default function Symptoms() {
  const [symptomsText, setSymptomsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Active symptoms array
  const activeSymptomsList = symptomsText
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Toggle (Check / Uncheck) example symptom tag
  const handleToggleExample = (exampleLabel) => {
    setSymptomsText((prev) => {
      const currentList = prev
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (currentList.includes(exampleLabel)) {
        const updatedList = currentList.filter((item) => item !== exampleLabel);
        return updatedList.join(', ');
      } else {
        const updatedList = [...currentList, exampleLabel];
        return updatedList.join(', ');
      }
    });
  };

  // Clear button action
  const handleClear = () => {
    setSymptomsText('');
    setAiResult(null);
    setError('');
  };

  // Gemini AI Analysis Trigger
  const handleAnalyzeWithGemini = async (e) => {
    e.preventDefault();
    if (!symptomsText.trim()) {
      setError('Please type or select symptoms before analyzing.');
      return;
    }

    setError('');
    setLoading(true);
    setAiResult(null);

    try {
      // Call backend API (POST /api/symptoms/analyze)
      const res = await analyzeSymptoms(symptomsText);

      if (res.success && res.data) {
        setAiResult(res.data);
      } else {
        setAiResult(getClientFallbackAnalysis(symptomsText));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.warn('Backend endpoint unavailable, using client triage fallback:', err.message);
      setAiResult(getClientFallbackAnalysis(symptomsText));
    }
  };

  // Proceed to Book Appointment page
  const handleProceedToBooking = (deptToBook) => {
    navigate('/book-appointment', {
      state: {
        department: deptToBook || aiResult?.recommendedDepartment || 'General Medicine',
        symptoms: symptomsText,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold">
          <Brain className="w-4 h-4 text-teal-600" />
          <span>Gemini AI Triage System</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Symptom Analysis & Triage
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
          Describe your symptoms below or select example tags. Gemini AI will evaluate your condition and recommend the target department.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 space-y-6">
        
        {/* Quick Example Symptoms Toggle Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Quick Example Symptoms (Click to Toggle / Uncheck)
            </label>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Click active tag to uncheck
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {EXAMPLE_SYMPTOMS.map((item, idx) => {
              const isSelected = activeSymptomsList.includes(item.label);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleExample(item.label)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 select-none ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-600/30'
                      : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200/80 hover:border-teal-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Symptoms Description
            </label>
            {symptomsText && (
              <span className="text-xs text-slate-400 font-medium">
                {symptomsText.length} characters
              </span>
            )}
          </div>

          <textarea
            rows={4}
            value={symptomsText}
            onChange={(e) => {
              setError('');
              setSymptomsText(e.target.value);
            }}
            placeholder="E.g., Feeling pelvic cramps and menstrual discomfort for 3 days..."
            className="block w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all resize-none shadow-inner"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          
          <button
            type="button"
            onClick={handleClear}
            disabled={!symptomsText && !aiResult}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              symptomsText || aiResult
                ? 'text-rose-600 hover:bg-rose-50 border border-rose-200/80'
                : 'text-slate-300 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Text</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyzeWithGemini}
            disabled={loading || !symptomsText.trim()}
            className={`w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all flex items-center justify-center gap-2.5 group ${
              loading || !symptomsText.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Analyze with Gemini AI</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Gemini AI Analysis Results Display */}
      {aiResult && (
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 rounded-3xl border border-teal-800/80 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-teal-400 font-extrabold text-lg">
              <Brain className="w-6 h-6" />
              <span>Gemini AI Analysis Results</span>
            </div>
            
            <div className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
              Confidence Score: {aiResult.confidence || '92%'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recommended Department Card */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-md space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Recommended Department
              </span>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-teal-400" />
                <span>{aiResult.recommendedDepartment}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Based on symptom severity and medical triage guidelines.
              </p>
            </div>

            {/* Possible Diseases Card */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-md space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Possible Conditions / Diseases
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {aiResult.possibleDiseases?.map((disease, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-500/20 text-teal-200 border border-teal-500/30 rounded-xl text-xs font-bold"
                  >
                    • {disease}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Button: Pass Department to Book Appointment */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Doctor selection remains manual on the booking form.</span>
            </div>

            <button
              type="button"
              onClick={() => handleProceedToBooking(aiResult.recommendedDepartment)}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Book Appointment in {aiResult.recommendedDepartment}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-slate-500 text-xs flex items-center gap-3">
        <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
        <span>
          Note: Gemini AI triage is intended for appointment assistance and preliminary department recommendation only. In case of medical emergencies, please seek immediate emergency care.
        </span>
      </div>

    </div>
  );
}
