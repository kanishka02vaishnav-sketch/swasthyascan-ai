import React, { useState, useMemo } from 'react';
import { AppStage, PatientProfile, AssessmentReport } from './types';
import IntakeForm from './components/IntakeForm';
import InterviewSession from './components/InterviewSession';
import MedicalReport from './components/MedicalReport';
import { GeminiMedicalService } from './services/geminiService';
import { Activity, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INTAKE);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);

  // Initialize service once
  const service = useMemo(() => new GeminiMedicalService(), []);

  const handleIntakeSubmit = (profile: PatientProfile) => {
    setPatientProfile(profile);
    setStage(AppStage.INTERVIEW);
  };

  const handleInterviewComplete = async () => {
    setStage(AppStage.ANALYZING);
    try {
      const result = await service.generateReport();
      setReport(result);
      setStage(AppStage.REPORT);
    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Something went wrong generating the diagnosis. Please try again.");
      setStage(AppStage.INTAKE); // Reset on critical failure
    }
  };

  const handleReset = () => {
    setPatientProfile(null);
    setReport(null);
    setStage(AppStage.INTAKE);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-fuchsia-200 selection:text-fuchsia-900 relative flex flex-col">
      {/* Vibrant Animated Background */}
      <div className="fixed inset-0 z-0 animated-gradient-bg opacity-10"></div>
      
      {/* Abstract Shapes */}
      <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* App Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-white/50 sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2.5 rounded-2xl text-white shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform">
               <Activity size={26} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-800 leading-none">
                Swasthya<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Scan</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Medical Assistant</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-violet-800 bg-violet-50 px-4 py-2 rounded-full border border-violet-100 shadow-sm">
            <Sparkles size={14} className="text-fuchsia-500 fill-fuchsia-500" />
            Intelligent Diagnosis
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full flex flex-col justify-center">
        
        {stage === AppStage.INTAKE && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="mb-12 text-center max-w-3xl animate-fade-in-up">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wide uppercase border border-orange-200 shadow-sm">
                Next-Gen Healthcare
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                Understand your health <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500">in seconds.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                SwasthyaScan combines advanced AI with medical knowledge to provide instant, interactive, and personalized health assessments.
              </p>
            </div>
            <IntakeForm onSubmit={handleIntakeSubmit} />
          </div>
        )}

        {stage === AppStage.INTERVIEW && patientProfile && (
           <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
              <InterviewSession 
                profile={patientProfile} 
                service={service} 
                onComplete={handleInterviewComplete} 
              />
           </div>
        )}

        {stage === AppStage.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse text-center px-4">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-fuchsia-300 z-10 relative">
                <Loader2 className="w-16 h-16 animate-spin" />
              </div>
              <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-20 delay-75"></div>
              <div className="absolute -inset-4 bg-fuchsia-400 rounded-full animate-ping opacity-10 delay-150"></div>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Analyzing Symptoms</h2>
            <p className="text-slate-500 text-xl max-w-md mx-auto leading-relaxed">
              We are consulting our medical database to generate a comprehensive report for you.
            </p>
          </div>
        )}

        {stage === AppStage.REPORT && report && patientProfile && (
          <MedicalReport 
            report={report} 
            profile={patientProfile} 
            onReset={handleReset} 
          />
        )}

      </main>
      
      {/* Simple Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm relative z-10">
        <p>&copy; 2025 SwasthyaScan AI. Made only for presenting as College project, by team 6.</p>
      </footer>
    </div>
  );
};

export default App;