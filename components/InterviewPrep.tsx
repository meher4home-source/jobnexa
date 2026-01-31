
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateInterviewQuestions } from '../services/geminiService';
import { ChevronDownIcon, ChevronUpIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface InterviewPrepProps {
  profile: UserProfile;
  isPremium: boolean;
  onGoPremium: () => void;
}

interface Question {
  question: string;
  answer: string;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ profile, isPremium, onGoPremium }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  // BUSINESS LOGIC: Limit Free Users
  const FREE_LIMIT = 2;

  const getUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_interview_${today}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  };

  const incrementUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_interview_${today}`;
    const current = getUsage();
    localStorage.setItem(key, (current + 1).toString());
  };

  const currentUsage = getUsage();
  const hasReachedLimit = !isPremium && currentUsage >= FREE_LIMIT;

  const handleGenerate = async () => {
    if (hasReachedLimit) return;
    setIsLoading(true);
    setError('');
    setOpenIndex(null);
    setQuestions([]); // Clear previous

    try {
      const result = await generateInterviewQuestions(profile);
      // Ensure we have a valid JSON string even if the AI adds filler text (now handled by service, but double check)
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        incrementUsage();
      } else {
        throw new Error("Invalid format");
      }
    } catch (error) {
      console.error("Failed to parse questions", error);
      setError("AI response was incomplete. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center justify-center gap-2">
            Interview Coach
            {isPremium && <SparklesIcon className="w-6 h-6 text-yellow-500" />}
            {!isPremium && <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium ml-2 align-middle">Limit: {currentUsage}/{FREE_LIMIT}</span>}
        </h2>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          Get tough, tailored questions for <span className="font-bold text-blue-600">{profile.targetRole}</span> roles in <span className="font-bold text-blue-600">{profile.targetRegion}</span>.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-10 scrollbar-hide">
        {hasReachedLimit ? (
           <div className="mt-8 p-8 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl max-w-md mx-auto text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LockClosedIcon className="w-8 h-8 text-slate-400" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Daily Limit Reached</h3>
               <p className="text-slate-500 mb-6">Upgrade to practice unlimited questions and ace your interview.</p>
               <button 
                  onClick={onGoPremium}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  Upgrade Now
                </button>
           </div>
        ) : (
            <>
                {questions.length === 0 && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50">
                        <p className="text-slate-500 font-medium mb-6">Ready to practice?</p>
                        <button
                            onClick={handleGenerate}
                            className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5" /> Generate Mock Interview
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                         {[1,2,3].map(i => (
                             <div key={i} className="h-24 bg-white/60 rounded-2xl w-full border border-white/40 shadow-sm"></div>
                         ))}
                         <div className="text-center text-slate-500 text-sm mt-4 font-medium">Analyzing job market data...</div>
                    </div>
                )}

                {error && (
                    <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
                        <p className="text-red-600 mb-3 font-medium">{error}</p>
                        <button onClick={handleGenerate} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto">
                            <ArrowPathIcon className="w-4 h-4"/> Try Again
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {questions.map((q, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                        <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full text-left px-6 py-5 flex justify-between items-start focus:outline-none"
                        >
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </span>
                            <span className="font-bold text-slate-800 text-lg leading-tight pt-0.5">{q.question}</span>
                        </div>
                        {openIndex === index ? (
                            <ChevronUpIcon className="w-6 h-6 text-blue-500 flex-shrink-0 ml-4" />
                        ) : (
                            <ChevronDownIcon className="w-6 h-6 text-slate-400 flex-shrink-0 ml-4" />
                        )}
                        </button>
                        
                        {openIndex === index && (
                        <div className="px-6 pb-6 pl-[4.5rem] pr-8">
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                                    <SparklesIcon className="w-3 h-3"/> Expert Strategy
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{q.answer}</p>
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
