
import React from 'react';
import { UserProfile, Region } from '../types';
import { CheckBadgeIcon, UserGroupIcon, BuildingOffice2Icon, RocketLaunchIcon } from '@heroicons/react/24/solid';

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onNext: () => void;
  isAuthenticated: boolean;
  onTriggerAuth: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profile, 
  setProfile, 
  onNext, 
  isAuthenticated, 
  onTriggerAuth 
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAction = () => {
    if (isAuthenticated) {
        onNext();
    } else {
        onTriggerAuth();
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
      {/* --- HERO SECTION --- */}
      <div className="text-center mb-10 pt-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-blue-100 shadow-sm">
             <RocketLaunchIcon className="w-4 h-4" /> AI-Powered Career Accelerator
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
          Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Career</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Unlock 3x more interviews with ATS-optimized resumes, tailored cover letters, and smart interview prep—powered by advanced AI.
        </p>
        
        {/* Social Proof */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><UserGroupIcon className="w-4 h-4 text-blue-500"/> 10k+ Users</span>
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><CheckBadgeIcon className="w-4 h-4 text-green-500"/> 95% Success</span>
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><BuildingOffice2Icon className="w-4 h-4 text-purple-500"/> FAANG Ready</span>
        </div>
      </div>

      {/* --- GLASS INPUT FORM --- */}
      <div className="p-6 md:p-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Professional Profile</h2>
                <p className="text-slate-500 text-sm">The AI uses this data to personalize everything.</p>
            </div>
            {!isAuthenticated && (
                <button onClick={onTriggerAuth} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                    Log In to Save Progress
                </button>
            )}
        </div>
        
        {!isAuthenticated && (
            <div className="mb-8 p-4 bg-yellow-50/80 backdrop-blur border border-yellow-200 text-yellow-800 rounded-xl text-sm flex items-start gap-3">
                <div className="mt-0.5 min-w-[20px]">⚠️</div>
                <span>
                    <strong>Guest Mode Active:</strong> You can generate drafts, but your data won't be saved after you close this tab.
                </span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="e.g. Alex Morgan"
                />
            </div>
            <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Target Market</label>
                <div className="relative">
                    <select
                        name="targetRegion"
                        value={profile.targetRegion}
                        onChange={handleChange}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-medium cursor-pointer"
                    >
                        {Object.values(Region).map((r) => (
                        <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-4.5 pointer-events-none text-slate-400">▼</div>
                </div>
            </div>
            <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Email</label>
                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="alex@example.com"
                />
            </div>
            <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Phone</label>
                <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="+1 555 123 4567"
                />
            </div>
        </div>

        <div className="mb-6 group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Target Job Role</label>
            <input
            type="text"
            name="targetRole"
            value={profile.targetRole}
            onChange={handleChange}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="e.g. Senior Product Manager"
            />
        </div>

        <div className="mb-6 group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                Top Skills <span className="normal-case font-normal opacity-60 ml-1">(Comma separated)</span>
            </label>
            <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            rows={2}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium resize-none"
            placeholder="e.g. Python, React, Project Management, Agile, Data Analysis..."
            />
        </div>

        <div className="mb-6 group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                Experience Summary <span className="normal-case font-normal opacity-60 ml-1">(Paste LinkedIn 'About' or old resume summary)</span>
            </label>
            <textarea
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="I have 5 years of experience in..."
            />
        </div>

        <div className="mb-8 group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">Education</label>
            <input
            type="text"
            name="education"
            value={profile.education}
            onChange={handleChange}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="e.g. MBA from Harvard Business School, 2019"
            />
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
            <button
            onClick={handleAction}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-bold text-lg py-4 px-10 rounded-xl shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
            {isAuthenticated ? 'Save & Generate Resume' : 'Continue to Free Builder'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            </button>
        </div>
      </div>
      
      <div className="mt-12 mb-6 text-center text-slate-400 text-xs">
        <p>🔒 256-bit SSL Encrypted • No Data Shared with Recruiters</p>
      </div>
    </div>
  );
};

export default ProfileForm;
