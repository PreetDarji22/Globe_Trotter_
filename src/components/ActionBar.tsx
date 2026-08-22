import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router-dom';

export const ActionBar = () => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filterBy, setFilterBy, groupBy, setGroupBy } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/search') {
      navigate('/search');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full mb-10 mt-4 bg-white p-3 rounded-full shadow-md border border-stone-200">
      <div className="flex-1 flex items-center px-4 bg-stone-50 rounded-full border border-transparent focus-within:border-terracotta focus-within:bg-white transition-all">
        <Search size={20} className="text-stone-400 shrink-0" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search destinations, activities..." 
          className="w-full bg-transparent border-none px-4 py-3 outline-none font-medium text-slate placeholder:text-stone-400" 
        />
      </div>
      <div className="flex gap-2 items-center px-2 shrink-0 overflow-x-auto custom-scrollbar">
        
        <select 
          value={groupBy}
          onChange={(e) => { setGroupBy(e.target.value); if(location.pathname !== '/search') navigate('/search'); }}
          className="rounded-full px-4 py-2.5 text-sm font-bold text-stone-600 bg-stone-100 outline-none hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <option value="None">Group by...</option>
          <option value="Region">Region</option>
          <option value="Category">Category</option>
        </select>
        
        <div className="w-px h-6 bg-stone-200 mx-1"></div>
        
        <select 
          value={filterBy}
          onChange={(e) => { setFilterBy(e.target.value); if(location.pathname !== '/search') navigate('/search'); }}
          className="rounded-full px-4 py-2.5 text-sm font-bold text-stone-600 bg-stone-100 outline-none hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <option value="All">Filter by...</option>
          <option value="Food">Food</option>
          <option value="Adventure">Adventure</option>
          <option value="Culture">Culture</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="Relaxation">Relaxation</option>
        </select>
        
        <div className="w-px h-6 bg-stone-200 mx-1"></div>
        
        <select 
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); if(location.pathname !== '/search') navigate('/search'); }}
          className="rounded-full px-4 py-2.5 text-sm font-bold text-stone-600 bg-stone-100 outline-none hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <option value="Recommended">Sort by...</option>
          <option value="PriceLow">Price: Low to High</option>
          <option value="PriceHigh">Price: High to Low</option>
          <option value="Rating">Top Rated</option>
        </select>
        
      </div>
    </div>
  );
};
