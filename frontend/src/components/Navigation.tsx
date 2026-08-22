import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, Calendar, Grid, Users } from 'lucide-react';
import { useStore } from '../store';

export const Navigation = () => {
  const { user } = useStore();
  const location = useLocation();

  return (
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
              <img src={user?.avatar || 'https://i.pravatar.cc/150'} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-semibold text-slate hidden sm:block">{user?.name || 'Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
