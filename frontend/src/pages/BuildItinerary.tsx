import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function BuildItinerary() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  const { trips, addTripStop, searchCities } = useStore() as any;
  const navigate = useNavigate();
  
  const trip = trips.find((t: any) => t.id === tripId) || trips[0];
  const [sections, setSections] = useState([{ id: Date.now().toString(), location: trip?.destination || '', dateRange: '', budget: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (tripId) {
      setIsSaving(true);
      // For each section, find a city ID (fallback to Tokyo if not found for hackathon)
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        let cityId = 'default';
        const cities = await searchCities(sec.location || 'Tokyo');
        if (cities.length > 0) {
          cityId = cities[0].id;
        }
        
        // Parse dates roughly from dateRange (mocking dates since the UI uses a single string input for simplicity)
        const startDate = new Date().toISOString();
        const endDate = new Date(Date.now() + 86400000 * 3).toISOString();
        
        if (cityId !== 'default') {
          await addTripStop(tripId, cityId, startDate, endDate, i);
        }
      }
      setIsSaving(false);
    }
    navigate(`/itinerary/${tripId || trip?.id || '1'}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-in fade-in">
      <div className="mb-12 border-b border-stone-200 pb-8 text-center md:text-left">
        <h2 className="text-4xl font-display font-black text-slate mb-3">Build Itinerary Sections</h2>
        <p className="text-stone-500 font-medium text-lg">Break your trip to <span className="text-terracotta font-bold">{trip?.destination || 'your destination'}</span> down into logical phases.</p>
      </div>
      
      <div className="space-y-8 mb-12">
        {sections.map((sec, i) => (
          <div key={sec.id} className="border border-stone-200 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl text-slate">Section {i + 1}:</h3>
              {i > 0 && (
                <button onClick={() => setSections(sections.filter(s => s.id !== sec.id))} className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-full transition-colors">Remove</button>
              )}
            </div>
            <p className="text-slate/60 font-medium mb-8 text-sm max-w-2xl leading-relaxed">
              Define the timeline and budget for this specific part of your trip. This helps in organizing separate cities, weeks, or themes.
            </p>
            <div className="flex flex-col gap-4">
              <input 
                placeholder="Location / City (e.g. Paris)" 
                value={sec.location}
                onChange={(e) => setSections(sections.map(s => s.id === sec.id ? {...s, location: e.target.value} : s))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:border-terracotta focus:bg-white transition-all font-medium text-slate" 
              />
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input 
                    placeholder="Date Range (e.g. Oct 1 - Oct 5)" 
                    value={sec.dateRange}
                    onChange={(e) => setSections(sections.map(s => s.id === sec.id ? {...s, dateRange: e.target.value} : s))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:border-terracotta focus:bg-white transition-all font-medium text-slate" 
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="number"
                    placeholder="Budget of this section ($)" 
                    value={sec.budget}
                    onChange={(e) => setSections(sections.map(s => s.id === sec.id ? {...s, budget: e.target.value} : s))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:border-terracotta focus:bg-white transition-all font-medium text-slate" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pb-12 pt-8">
        <button 
          onClick={() => setSections([...sections, { id: Date.now().toString(), dateRange: '', budget: '' }])} 
          className="w-full md:w-auto border-2 border-stone-200 rounded-full px-10 py-4 font-bold text-stone-600 hover:bg-stone-50 hover:text-slate hover:border-stone-300 transition-all flex justify-center items-center gap-3 text-lg"
        >
          <span className="text-2xl font-light leading-none">+</span> Add another Section
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-slate text-white px-12 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-slate/90 transition-all text-lg disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save & View Itinerary'}
        </button>
      </div>
    </div>
  );
}
