
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types';
import { generateMarketInsights } from '../services/geminiService';
import { LockClosedIcon, SparklesIcon, GlobeAltIcon, BriefcaseIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface JobMarketInsightsProps {
  profile: UserProfile;
  isPremium: boolean;
  onGoPremium: () => void;
}

const JobMarketInsights: React.FC<JobMarketInsightsProps> = ({ profile, isPremium, onGoPremium }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    // Removed explicit error state, now handled by service fallback
    try {
      const result = await generateMarketInsights(profile);
      setAnalysis(result);
    } catch (err) {
      // Service now guarantees a string return, but just in case:
      setAnalysis("## Market Data Unavailable\nPlease try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="text-center mb-4 shrink-0">
         <h2 className="text-3xl font-extrabold text-slate-900 mb-1 flex items-center justify-center gap-2">
            Job Market Intelligence
            {isPremium && <SparklesIcon className="w-5 h-5 text-yellow-500" />}
         </h2>
         <p className="text-slate-600 text-sm">Strategic analysis for <span className="font-bold text-blue-600">{profile.targetRole}</span></p>
      </div>

      {!analysis && !isLoading && (
         <div className="flex-1 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-100/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <BriefcaseIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Decode Your Career Path</h3>
            <p className="text-slate-600 mb-6 text-sm">
                Analyze trends for {profile.targetRole} in {profile.targetRegion}.
            </p>
            <button 
                onClick={handleAnalyze}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 text-white font-bold rounded-full shadow-lg transition-all flex items-center gap-2"
            >
                <SparklesIcon className="w-5 h-5" />
                Analyze Market Fit
            </button>
         </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-slate-800">Analyzing Market Trends...</p>
        </div>
      )}

      {analysis && (
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50">
           <div className="bg-slate-800 p-4 text-white shrink-0">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-blue-400" />
                    Market Report
                </h3>
           </div>
           
           <div className="p-6 prose prose-sm prose-slate max-w-none flex-1 overflow-y-auto">
                <ReactMarkdown>{analysis}</ReactMarkdown>
           </div>
           
           {/* Footer Fixed to Bottom of Card */}
           <div className="bg-white p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
               <div className="text-xs text-slate-500 font-medium">
                   {isPremium ? "Premium Insight Generated." : "Upgrade to unlock detailed regional breakdown."}
               </div>
               
               <button 
                   onClick={isPremium ? handleAnalyze : onGoPremium}
                   className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-colors ${isPremium ? 'bg-white border border-slate-300 text-slate-700 hover:text-blue-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'}`}
               >
                   {isPremium ? <><ArrowPathIcon className="w-3 h-3"/> Refresh</> : <><LockClosedIcon className="w-3 h-3"/> Unlock More</>}
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default JobMarketInsights;
