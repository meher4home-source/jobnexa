
import React, { useState, useRef } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { UserProfile } from '../types';
import { generateResume } from '../services/geminiService';
import { SparklesIcon, LockClosedIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/solid';

interface ResumeBuilderProps {
  profile: UserProfile;
  isPremium: boolean;
  onGoPremium: () => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ profile, isPremium, onGoPremium }) => {
  const [resumeContent, setResumeContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const FREE_LIMIT = 1;

  const getUsage = () => {
      const today = new Date().toISOString().split('T')[0];
      return parseInt(localStorage.getItem(`usage_resume_${today}`) || '0', 10);
  };

  const handleGenerate = async () => {
    if (!isPremium && getUsage() >= FREE_LIMIT) return;

    setIsLoading(true);
    try {
      const content = await generateResume(profile);
      setResumeContent(content);
      localStorage.setItem(`usage_resume_${new Date().toISOString().split('T')[0]}`, (getUsage() + 1).toString());
    } catch (err) {
      // Fallback handled in service
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // @ts-ignore
    const html2pdf = window.html2pdf;
    if (!html2pdf || !resumeRef.current) {
        alert("PDF tool loading... try Print button instead.");
        return;
    }
    
    // Config optimized to avoid cutting off content
    const opt = {
      margin: 0,
      filename: `${profile.fullName.replace(/\s+/g,'_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeRef.current).save();
  };

  // Compact Renderers for Perfect Fit
  const markdownRenderers: Components = {
    h2: ({node, ...props}) => (
        <h2 className="text-sm font-bold uppercase text-slate-900 border-b-2 border-slate-800 mt-4 mb-2 pb-0.5 tracking-wider" {...props} />
    ),
    h3: ({node, ...props}) => (
        <h3 className="text-xs font-bold text-slate-800 mt-2 mb-0.5" {...props} />
    ),
    ul: ({node, ...props}) => (
        <ul className="list-disc ml-4 text-[11px] leading-relaxed text-slate-700 marker:text-slate-500" {...props} />
    ),
    li: ({node, ...props}) => (
        <li className="mb-0.5 pl-1" {...props} />
    ),
    p: ({node, ...props}) => (
        <p className="text-[11px] leading-relaxed text-slate-700 mb-1 text-justify" {...props} />
    ),
    strong: ({node, ...props}) => (
        <strong className="font-bold text-slate-900" {...props} />
    )
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6 animate-in fade-in">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-72 flex flex-col gap-4 shrink-0 no-print">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-2">Resume Actions</h2>
            <p className="text-xs text-slate-500 mb-4">ATS-Optimized Single Page.</p>
            
            {(!isPremium && getUsage() >= FREE_LIMIT) ? (
                <button onClick={onGoPremium} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                   <LockClosedIcon className="w-4 h-4" /> Unlock Unlimited
                </button>
            ) : (
                <button onClick={handleGenerate} disabled={isLoading} className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isLoading ? "Generating..." : <><SparklesIcon className="w-4 h-4" /> Generate AI Resume</>}
                </button>
            )}

            {resumeContent && (
             <div className="mt-4 flex flex-col gap-2">
                 <button onClick={() => window.print()} className="w-full py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                    <PrinterIcon className="w-4 h-4" /> Print
                </button>
                <button onClick={handleDownloadPDF} className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 flex items-center justify-center gap-2">
                        <ArrowDownTrayIcon className="w-4 h-4" /> Download PDF
                </button>
             </div>
            )}
          </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-200 rounded-2xl p-4 md:p-8 flex justify-center overflow-y-auto no-print">
         {isLoading ? (
            <div className="self-center flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-slate-600">Drafting Resume...</p>
            </div>
         ) : resumeContent ? (
             <div className="w-full max-w-[210mm] shadow-2xl">
                <div 
                    id="resume-content"
                    ref={resumeRef}
                    className="print-resume-container bg-white w-full min-h-[297mm] p-[15mm] text-slate-900 box-border"
                >
                    <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                        <h1 className="text-2xl font-bold uppercase tracking-wide mb-1 font-serif">{profile.fullName}</h1>
                        <p className="text-xs text-slate-600 font-medium tracking-wide">
                            {profile.email} • {profile.phone}
                        </p>
                    </div>
                    <ReactMarkdown components={markdownRenderers}>{resumeContent}</ReactMarkdown>
                </div>
             </div>
         ) : (
            <div className="self-center text-center text-slate-500 max-w-sm">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <SparklesIcon className="w-8 h-8 text-blue-200" />
                </div>
                <p className="text-sm font-medium">Click "Generate" to build your resume.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
