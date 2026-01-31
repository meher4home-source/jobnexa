
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types';
import { generateCoverLetter } from '../services/geminiService';
import { LockClosedIcon, SparklesIcon, PrinterIcon, ArrowDownTrayIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';

interface CoverLetterProps {
  profile: UserProfile;
  isPremium: boolean;
  onGoPremium: () => void;
}

const CoverLetter: React.FC<CoverLetterProps> = ({ profile, isPremium, onGoPremium }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // BUSINESS LOGIC: Limit Free Users
  const FREE_LIMIT = 2;

  const getUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_coverletter_${today}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  };

  const incrementUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `usage_coverletter_${today}`;
    const current = getUsage();
    localStorage.setItem(key, (current + 1).toString());
  };

  const currentUsage = getUsage();
  const hasReachedLimit = !isPremium && currentUsage >= FREE_LIMIT;

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    if (hasReachedLimit) return;

    setIsLoading(true);
    try {
      const content = await generateCoverLetter(profile, jobDescription);
      setLetterContent(content);
      incrementUsage();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterContent);
    alert("Copied to clipboard!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${profile.fullName} - Cover Letter</title>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
              p { margin-bottom: 15px; }
            </style>
          </head>
          <body>
            ${document.getElementById('letter-preview')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    // @ts-ignore
    const html2pdf = window.html2pdf;
    if (!html2pdf) {
      alert("PDF library is loading. Please try again in a moment or use Print.");
      return;
    }
    
    const element = document.getElementById('letter-preview');
    if (!element) return;

    const opt = {
      margin:       [15, 20, 15, 20],
      filename:     `${profile.fullName.replace(/\s+/g, '_')}_CoverLetter.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Input Side */}
      <div className="flex flex-col h-full overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            Job Details
            {!isPremium && <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">Free Limit: {currentUsage}/{FREE_LIMIT}</span>}
            {isPremium && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Unlimited</span>}
        </h2>
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 flex-1 flex flex-col relative overflow-hidden">
          
          {hasReachedLimit && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6">
                 <LockClosedIcon className="w-12 h-12 text-slate-400 mb-4" />
                 <h3 className="text-lg font-bold text-slate-800">Daily Limit Reached</h3>
                 <p className="text-sm text-slate-500 mb-4">You have reached your daily limit of {FREE_LIMIT} cover letters.</p>
                 <button onClick={onGoPremium} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all animate-pulse">
                     Upgrade for Unlimited
                 </button>
              </div>
          )}

          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Paste Job Description</label>
          <textarea
            className="flex-1 w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none mb-4 text-sm bg-white/50 transition-all font-medium"
            placeholder="Paste the job description from LinkedIn/Indeed here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={hasReachedLimit}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !jobDescription || hasReachedLimit}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg
              ${isLoading || !jobDescription || hasReachedLimit ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]'}`}
          >
            {isLoading ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Writing Persuasive Letter...
               </>
            ) : (
                <>
                 <SparklesIcon className="w-5 h-5"/> Generate Cover Letter
                </>
            )}
          </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="flex flex-col h-full overflow-hidden">
         <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-slate-800">Preview</h2>
            {letterContent && (
                <div className="flex gap-2">
                    <button onClick={copyToClipboard} title="Copy" className="p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handlePrint} title="Print" className="p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownloadPDF} title="Download PDF" className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
         </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex-1 overflow-y-auto prose prose-sm max-w-none relative scrollbar-hide">
          {letterContent ? (
            <div id="letter-preview" className="font-serif text-slate-800">
                <ReactMarkdown>{letterContent}</ReactMarkdown>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <SparklesIcon className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-medium">AI-generated content will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
