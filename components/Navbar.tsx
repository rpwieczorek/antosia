
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div 
            className="flex-shrink-0 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <h1 className="text-xl font-bold tracking-tight uppercase flex items-center">
              <span className="text-red-500 mr-2 group-hover:scale-125 transition-transform inline-block">♥</span>
              Antosia <span className="text-gray-400 ml-1 font-light">Wieczorek</span>
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-10 items-center">
            {[
              { id: 'home', label: 'Start' },
              { id: 'history', label: 'Historia' },
              { id: 'journal', label: 'Dziennik' },
              { id: 'how-to-help', label: 'Jak pomóc?' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${
                  currentView === item.id ? 'text-red-600' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => setView('how-to-help')}
              className="bg-red-500 text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-red-600 transition-colors"
            >
              Wesprzyj nas
            </button>
          </div>

          <button onClick={() => setView('migration')} className="text-[8px] text-gray-200 uppercase tracking-tighter hover:text-gray-400 transition-colors">
            Admin/Migracja
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
