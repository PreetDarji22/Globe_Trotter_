import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, Calendar, Grid, Users, Sparkles, X } from 'lucide-react';
import { useStore } from '../store';

export const Navigation = () => {
  const { user, welcomeMessage, setWelcomeMessage } = useStore() as any;
  const location = useLocation();

  useEffect(() => {
    if (welcomeMessage) {
      const timer = setTimeout(() => {
        setWelcomeMessage(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage, setWelcomeMessage]);

  return (
    <>
      {welcomeMessage && (
        <div className="fixed top-20 right-6 z-[100] bg-slate text-white px-6 py-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 animate-in slide-in-from-top-5 duration-300">
          <div className="w-10 h-10 rounded-full bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-terracotta shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-white">{welcomeMessage}</p>
            <p className="text-xs text-stone-400">Discover new itineraries & connect with travel buddies!</p>
          </div>
          <button onClick={() => setWelcomeMessage(null)} className="ml-2 text-stone-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl tracking-tight text-slate">Global<span className="text-terracotta">Trotter</span></span>
            </Link>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center space-x-8">
              {/* Search Bar - Global Shell requirement */}
              <div className="relative flex-1 group">
                <div className="flex items-center bg-white border border-stone-200 rounded-full px-4 py-2 shadow-sm focus-within:shadow-md focus-within:border-terracotta transition-all">
                  <Search size={18} className="text-stone-400 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search destinations, activities..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate placeholder:text-stone-400"
                  />
                  <div className="flex gap-3 ml-4 border-l border-stone-200 pl-4 shrink-0">
                    <button className="text-xs font-semibold text-stone-500 hover:text-terracotta transition-colors">Group by</button>
                    <button className="text-xs font-semibold text-stone-500 hover:text-terracotta transition-colors">Filter</button>
                    <button className="text-xs font-semibold text-stone-500 hover:text-terracotta transition-colors">Sort by...</button>
                  </div>
                </div>
              </div>
              
              {/* Nav Links */}
              <div className="flex space-x-6 shrink-0">
                 <Link to="/trips" className={`text-sm font-semibold transition-colors ${location.pathname.includes('/trips') ? 'text-terracotta' : 'text-stone-600 hover:text-slate'}`}>My Trips</Link>
                 <Link to="/community" className={`text-sm font-semibold transition-colors ${location.pathname === '/community' ? 'text-terracotta' : 'text-stone-600 hover:text-slate'}`}>Community</Link>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link to="/profile" className="flex items-center gap-2 bg-white rounded-full p-1 pr-4 shadow-sm border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all">
                <img src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-semibold text-slate hidden sm:block">{user?.name || 'Login'}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
