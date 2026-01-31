
import React, { useState } from 'react';
import { CheckCircleIcon, SparklesIcon, GlobeAltIcon, ShieldCheckIcon, FireIcon, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/solid';

// --- CONFIGURATION ---
// In a real application, XFlow requires a backend to create a checkout session.
// The frontend would call your backend -> backend calls XFlow -> returns checkout URL.
// ---------------------

const currencies = {
  USD: { symbol: '$', code: 'USD', price: 4.99, original: 29.99, name: 'United States Dollar' },
  EUR: { symbol: '€', code: 'EUR', price: 4.99, original: 29.99, name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', price: 3.99, original: 24.99, name: 'British Pound' },
  INR: { symbol: '₹', code: 'INR', price: 199, original: 1499, name: 'Indian Rupee' },
  CAD: { symbol: 'CA$', code: 'CAD', price: 6.99, original: 39.99, name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', code: 'AUD', price: 7.99, original: 45.99, name: 'Australian Dollar' },
};

type CurrencyKey = keyof typeof currencies;

interface PremiumProps {
  onUpgrade: () => void;
  isPremium: boolean;
}

const Premium: React.FC<PremiumProps> = ({ onUpgrade, isPremium }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey>('USD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);

  const benefits = [
    "Unlimited Resume Generations",
    "Expert Cover Letter Tailoring",
    "Real-time Interview Coaching",
    "LinkedIn Profile Optimization",
    "ATS Score Checker",
    "24/7 Priority Support"
  ];

  const currentCurrency = currencies[selectedCurrency];
  const discountPercentage = Math.round(((currentCurrency.original - currentCurrency.price) / currentCurrency.original) * 100);

  const handleInitiatePayment = async () => {
    setIsProcessing(true);

    // Simulate Network Call to your Backend to get XFlow Session
    setTimeout(() => {
        setIsProcessing(false);
        // In a real app, this would redirect: window.location.href = response.checkoutUrl;
        // For this demo, we open the mock modal.
        setShowMockModal(true);
    }, 1500);
  };

  const confirmMockPayment = () => {
      // Simulate successful callback
      setShowMockModal(false);
      onUpgrade();
  };

  if (isPremium) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4 bg-slate-50">
              <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100 max-w-lg animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SparklesIcon className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">You are a Pro Member!</h2>
                  <p className="text-slate-500 mb-6">Enjoy unlimited access to all AI career tools and an Ad-free experience.</p>
                  <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-200">
                      Your monthly subscription is active. Thank you for supporting JobNexa.
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 px-4 md:py-12 bg-slate-50 relative">
      
      {/* Mock XFlow Checkout Modal */}
      {showMockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                  <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                      <div className="flex items-center gap-2 font-bold text-lg">
                         <span className="text-blue-400">X</span>Flow Checkout
                      </div>
                      <button onClick={() => setShowMockModal(false)} className="text-slate-400 hover:text-white">
                          <XMarkIcon className="w-6 h-6" />
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="mb-6 border-b border-slate-100 pb-4">
                          <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                          <p className="text-3xl font-bold text-slate-800">{currentCurrency.symbol}{currentCurrency.price}</p>
                          <p className="text-xs text-slate-400 mt-1">JobNexa Pro Subscription</p>
                      </div>

                      <div className="space-y-4 mb-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Information (Mock)</label>
                              <div className="relative">
                                  <CreditCardIcon className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                                  <input type="text" readOnly value="4242 4242 4242 4242" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm" />
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="flex-1">
                                  <input type="text" readOnly value="12/25" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm text-center" />
                              </div>
                              <div className="flex-1">
                                  <input type="text" readOnly value="123" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm text-center" />
                              </div>
                          </div>
                      </div>

                      <button 
                          onClick={confirmMockPayment}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                          <ShieldCheckIcon className="w-5 h-5" />
                          Pay {currentCurrency.symbol}{currentCurrency.price}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4">
                          Test Mode • Secure Payment by XFlow
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Upgrade to <span className="text-blue-600">Pro</span>
        </h2>
        <p className="text-base md:text-lg text-slate-500 mb-6">
          Remove ads and get hired faster with unlimited AI tools.
        </p>

        {/* Currency Selector Bubble */}
        <div className="inline-flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm max-w-full">
           <GlobeAltIcon className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
           <select 
             value={selectedCurrency}
             onChange={(e) => setSelectedCurrency(e.target.value as CurrencyKey)}
             className="bg-transparent text-slate-700 text-sm font-semibold outline-none cursor-pointer max-w-[200px]"
           >
             {Object.entries(currencies).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([key, info]) => (
               <option key={key} value={key}>{info.name} ({info.code})</option>
             ))}
           </select>
        </div>
      </div>

      {/* The Single Premium Card */}
      <div className="w-full max-w-sm md:max-w-md relative">
        {/* Deal Badge */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10 w-full text-center">
          <span className="bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wide border-2 border-white flex items-center justify-center gap-1 w-max mx-auto animate-bounce">
            <FireIcon className="w-4 h-4" /> Limited Time Deal
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all hover:scale-[1.02] mt-4">
          {/* Card Header Gradient */}
          <div className="h-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Monthly Plan <SparklesIcon className="w-6 h-6 text-yellow-400" />
              </h3>
            </div>
            
            {/* Amazon/Flipkart Style Price Box */}
            <div className="mb-8 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
               <div className="flex items-center gap-2 text-slate-500 font-medium mb-1 text-xl">
                   <span>M.R.P.:</span>
                   <span className="line-through decoration-red-500 decoration-2 text-slate-500 font-bold">
                       {currentCurrency.symbol}{currentCurrency.original.toLocaleString()}
                   </span>
               </div>
               
               <div className="flex items-baseline gap-2 flex-wrap">
                   <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        {currentCurrency.symbol}{currentCurrency.price.toLocaleString()}
                   </span>
                   <span className="text-lg text-slate-500 font-medium">/mo</span>
               </div>

               <div className="mt-2 text-sm font-bold text-red-600 bg-red-100 inline-block px-2 py-1 rounded">
                   {discountPercentage}% OFF
               </div>
               <p className="text-xs text-slate-400 mt-2">Inclusive of all taxes</p>
            </div>

            <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
              Cancel anytime. No hidden fees. Ad-free.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <button 
                onClick={handleInitiatePayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting XFlow...
                  </>
              ) : (
                  <>
                    <ShieldCheckIcon className="w-5 h-5" />
                    Pay Securely
                  </>
              )}
            </button>
            
            <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <ShieldCheckIcon className="w-3 h-3" /> SSL Encrypted • Powered by XFlow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
