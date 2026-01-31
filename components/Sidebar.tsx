
import React from 'react';
import { AppSection } from '../types';
import AdBanner from './AdBanner';
import { 
  UserCircleIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon, 
  StarIcon,
  XMarkIcon,
  SparklesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onTriggerAuth: () => void;
  isPremium?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  onNavigate, 
  isOpen, 
  onClose, 
  isAuthenticated, 
  onTriggerAuth,
  isPremium = false
}) => {
  const navItems = [
    { id: AppSection.PROFILE, label: 'Profile Input', icon: UserCircleIcon, free: true, limit: '' },
    { id: AppSection.RESUME, label: 'Generate Resume', icon: DocumentTextIcon, free: false, limit: isPremium ? '∞' : '1/day' },
    { id: AppSection.COVER_LETTER, label: 'Cover Letter', icon: EnvelopeIcon, free: false, limit: isPremium ? '∞' : '2/day' },
    { id: AppSection.INTERVIEW, label: 'Interview Prep', icon: AcademicCapIcon, free: false, limit: isPremium ? '∞' : '2/day' },
    { id: AppSection.MARKET_ANALYSIS, label: 'Job Market Insights', icon: GlobeAltIcon, free: false, limit: isPremium ? '∞' : '1/day' },
    { id: AppSection.CHAT, label: 'Doubt Chat', icon: ChatBubbleLeftRightIcon, free: false, limit: isPremium ? '∞' : '5 msgs' },
    { id: AppSection.PREMIUM, label: 'Premium Plan', icon: StarIcon, free: true, limit: '' },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (isAuthenticated) {
      onNavigate(item.id);
      onClose();
      return;
    }

    if (item.free || item.id === AppSection.PREMIUM) {
       onNavigate(item.id);
       onClose();
    } else {
       onTriggerAuth();
       onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center tracking-tight">
              <span className="text-white">Job</span>
              <span className="text-blue-500">Nexa</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
                {isAuthenticated && isPremium ? (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" /> PRO MEMBER
                    </span>
                ) : (
                    <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        FREE TIER
                    </span>
                )}
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </div>
                    {item.limit && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {item.limit}
                        </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {!isPremium && <AdBanner variant="sidebar" />}
        </nav>

        {!isAuthenticated && (
            <div className="p-4 m-3 bg-gradient-to-r from-blue-900 to-slate-800 rounded-xl border border-blue-700/50">
                <p className="text-xs text-blue-100 mb-2">Save your progress</p>
                <button 
                    onClick={onTriggerAuth}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                    Sign Up / Login
                </button>
            </div>
        )}

        {isAuthenticated && !isPremium && (
            <div className="p-4 m-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-lg">
                <p className="text-xs text-white mb-2 font-bold flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3"/> Unlock Unlimited
                </p>
                <p className="text-[10px] text-yellow-100 mb-3 leading-tight">Remove daily limits & ads.</p>
                <button 
                    onClick={() => {
                        onNavigate(AppSection.PREMIUM);
                        onClose();
                    }}
                    className="w-full py-1.5 bg-white text-orange-600 text-xs font-bold rounded shadow-sm hover:gray-50 transition-colors"
                >
                    Upgrade Now
                </button>
            </div>
        )}

        <div className="p-4 bg-slate-800 m-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Status: Online
          </div>
          <p className="text-[10px] text-slate-500">AI Model: Pollinations (GPT-4o)</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
