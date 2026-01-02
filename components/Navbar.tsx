import React, { useState } from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Start' },
    { id: 'history', label: 'Historia' },
    { id: 'journal', label: 'Dziennik' },
    { id: 'passions', label: 'Moje pasje' },
  ];

  const handleNavigate = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[60] bg-white/95 backdrop-blur-md border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer group" 
            onClick={() => handleNavigate('home')}
          >
            <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase flex items-center">
              <span className="text-red-500 mr-2 group-hover:scale-125 transition-transform inline-block">♥</span>
              Antosia <span className="text-gray-400 ml-1 font-light hidden sm:inline">Wieczorek</span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 lg:space-x-10 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as View)}
                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${
                  currentView === item.id ? 'text-red-600' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => handleNavigate('support')}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md transition-all hover:scale-105 ${
                currentView === 'support' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Wesprzyj mnie
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 focus:outline-none"
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-8 space-y-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id as View)}
              className={`block w-full text-left text-sm tracking-[0.2em] uppercase font-bold transition-all ${
                currentView === item.id ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4">
            <button 
              onClick={() => handleNavigate('support')}
              className="w-full py-5 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Wesprzyj mnie
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;