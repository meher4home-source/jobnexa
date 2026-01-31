import React, { useState, useEffect } from 'react';
import { XMarkIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

interface AdBannerProps {
  variant?: 'banner' | 'sidebar';
}

const ADS = [
  {
    title: "Master Full Stack Dev",
    desc: "Become a top 1% developer in 6 months. Join the bootcamp today!",
    cta: "Learn More",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900"
  },
  {
    title: "Cheap Flights",
    desc: "Save up to 40% on your next business trip to Dubai or London.",
    cta: "Book Now",
    color: "bg-orange-50 border-orange-200 text-orange-900"
  },
  {
    title: "High Yield Savings",
    desc: "Get 5.5% APY on your savings. FDIC Insured. Start saving now.",
    cta: "Open Account",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900"
  }
];

const AdBanner: React.FC<AdBannerProps> = ({ variant = 'banner' }) => {
  const [currentAd, setCurrentAd] = useState(ADS[0]);

  useEffect(() => {
    // Rotate ads every 10 seconds
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * ADS.length);
      setCurrentAd(ADS[random]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'sidebar') {
    return (
      <div className={`mx-3 mt-3 p-4 rounded-xl border ${currentAd.color} relative group`}>
        <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-white/50 px-1 rounded">Ad</div>
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
             <MegaphoneIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">{currentAd.title}</h4>
            <p className="text-xs opacity-80 mb-2 leading-relaxed">{currentAd.desc}</p>
            <button className="text-[10px] font-bold uppercase tracking-wider bg-white/80 hover:bg-white px-2 py-1 rounded shadow-sm transition-colors">
              {currentAd.cta} &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Bottom Banner Variant
  return (
    <div className="bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 md:px-8 flex items-center justify-between z-40 animate-in slide-in-from-bottom-5">
       <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:flex bg-slate-100 p-2 rounded-lg text-slate-500 text-xs font-bold uppercase tracking-widest border border-slate-200">
             Ad
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
             <span className="font-bold text-slate-800 text-sm md:text-base">{currentAd.title}:</span>
             <span className="text-slate-600 text-xs md:text-sm">{currentAd.desc}</span>
          </div>
       </div>
       <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg ml-4 whitespace-nowrap transition-colors">
          {currentAd.cta}
       </button>
    </div>
  );
};

export default AdBanner;