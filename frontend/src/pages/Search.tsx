import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ActionBar } from '../components/ActionBar';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../store';
import { MapPin, Star } from 'lucide-react';
import { fetchDestinations, Destination } from '../api';

export default function Search() {
  const { searchQuery, sortBy, filterBy, groupBy, communityTrips, fetchCommunityTrips } = useStore() as any;
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // added useNavigate

  useEffect(() => {
    fetchDestinations().then(res => {
      setData(res);
      setLoading(false);
    });
    if (communityTrips.length === 0) {
      fetchCommunityTrips();
    }
  }, []);

  let processed = [...data];
  let searchedTrips = [...communityTrips];

  // 1. Search Query
  if (searchQuery) {
    const lower = searchQuery.toLowerCase();
    processed = processed.filter(d => 
      d.title.toLowerCase().includes(lower) || 
      d.location.toLowerCase().includes(lower)
    );
    searchedTrips = searchedTrips.filter(t => 
      t.name.toLowerCase().includes(lower) ||
      (t.description && t.description.toLowerCase().includes(lower))
    );
  }

  // 2. Filter
  if (filterBy && filterBy !== 'All') {
    processed = processed.filter(d => d.category === filterBy);
  }

  // 3. Sort
  if (sortBy === 'PriceLow') {
    processed.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'PriceHigh') {
    processed.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    processed.sort((a, b) => b.rating - a.rating);
  }

  // 4. Group
  let groups: Record<string, Destination[]> = { 'Activities & Tours': processed };
  if (groupBy && groupBy !== 'None') {
    groups = {};
    processed.forEach(d => {
      const key = d[groupBy.toLowerCase() as keyof Destination] as string;
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      {loading ? (
        <div className="flex justify-center items-center h-64 font-bold text-slate">Loading destinations API...</div>
      ) : (
        <>
          {searchedTrips.length > 0 && searchQuery && (
            <div className="mb-12">
              <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
                <h2 className="font-display font-black text-3xl text-slate">Community Trips</h2>
                <span className="text-stone-500 font-medium">{searchedTrips.length} found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchedTrips.map(trip => (
                  <div key={trip.id} onClick={() => navigate('/community')} className="group bg-white border border-stone-200 rounded-3xl p-4 hover:shadow-lg cursor-pointer transition-all flex flex-col gap-4">
                    <div className="w-full h-40 rounded-2xl overflow-hidden shrink-0">
                      <SafeImage src={trip.coverPhoto || 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000'} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate group-hover:text-terracotta transition-colors">{trip.name}</h3>
                      <p className="text-stone-500 text-sm mt-1 line-clamp-2">{trip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName} className="mb-12">
              <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
                <h2 className="font-display font-black text-3xl text-slate capitalize">{groupName}</h2>
                <span className="text-stone-500 font-medium">{items.length} activities found</span>
              </div>
              
              {items.length === 0 ? (
                <p className="text-stone-500 bg-white p-8 rounded-3xl text-center shadow-sm border border-stone-200 font-medium">No results found for your specific filters.</p>
              ) : (
                <div className="space-y-6">
                  {items.map((r) => (
                    <div key={r.id} className="group bg-white border border-stone-200 rounded-3xl p-4 hover:shadow-lg cursor-pointer transition-all flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                        <SafeImage src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center py-2 pr-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-display font-bold text-2xl text-slate group-hover:text-terracotta transition-colors">{r.title}</h3>
                          <span className="font-black text-xl text-slate">${r.price}</span>
                        </div>
                        <p className="text-stone-500 font-medium flex items-center gap-1.5 mb-4"><MapPin size={16}/>{r.location}</p>
                        <div className="flex items-center gap-4 mt-auto border-t border-stone-100 pt-4">
                          <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{r.category}</span>
                          <span className="flex items-center gap-1 text-sm font-bold text-slate"><Star size={16} className="fill-mustard text-mustard"/> {r.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
