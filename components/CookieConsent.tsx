import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      updateGtagConsent('granted');
    }
  }, []);

  const updateGtagConsent = (status: 'granted' | 'denied') => {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': status,
        'ad_storage': status
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    updateGtagConsent('granted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    updateGtagConsent('denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex-grow space-y-2">
          <h4 className="text-xl serif font-bold text-gray-900">Dbamy o Twoją prywatność</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Używamy plików cookie, aby analizować ruch na stronie i lepiej docierać z historią Antosi do nowych osób. Pomóż nam pomagać skuteczniej.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            Tylko niezbędne
          </button>
          <button 
            onClick={handleAccept}
            className="px-8 py-3 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all"
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

// Deklaracja dla TypeScript, aby nie zgłaszał błędów przy window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}