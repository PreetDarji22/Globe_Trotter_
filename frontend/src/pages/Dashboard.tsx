import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ActionBar } from '../components/ActionBar';
import { useStore } from '../store';
import { MapPin, Plus } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function Dashboard() {
  const { trips, fetchTrips } = useStore() as any;

  useEffect(() => {
    fetchTrips();
  }, []);
  
  const regions = [
    { name: 'Kyoto, Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', desc: 'Ancient Temples & Gardens' },
    { name: 'Amalfi Coast', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', desc: 'Coastal Paradise Escapes' },
    { name: 'Swiss Alps', img: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=800&q=80', desc: 'Majestic Winter Peaks' },
    { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', desc: 'Tropical Wellness Retreats' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col min-h-screen relative pb-24 animate-in fade-in duration-500">
      
      {/* Banner */}
      <div className="w-full h-[28rem] rounded-[2rem] overflow-hidden relative mb-4 shadow-xl group">
        <SafeImage src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" alt="Discover the world" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-10">
          <div>
            <span className="bg-terracotta text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-sm">Featured Adventure</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight drop-shadow-lg">Discover the World</h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mt-4 font-medium drop-shadow-md">Plan your next adventure with intelligent itineraries, precise budget tracking, and an inspiring community.</p>
          </div>
        </div>
      </div>
      
      <ActionBar />

      {/* Top Regional Selections */}
      <div className="mb-16 mt-4">
        <h3 className="text-3xl font-display font-bold text-slate mb-6">Top Regional Selections</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((r, idx) => (
            <div key={idx} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <SafeImage src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/20 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-white font-bold text-xl">{r.name}</h4>
                <p className="text-white/80 text-sm font-medium mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
          <h3 className="text-3xl font-display font-bold text-slate">Previous Trips</h3>
          <Link to="/trips" className="text-terracotta font-bold hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.slice(0,3).map((trip) => (
            <Link to={`/itinerary/${trip.id}`} key={trip.id} className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white border border-stone-100 flex flex-col">
              <div className="h-3/5 overflow-hidden relative">
                <SafeImage src={trip.image || ''} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate shadow-sm">
                  {trip.status}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-2xl text-slate mb-2 group-hover:text-terracotta transition-colors">{trip.name}</h4>
                  <p className="text-stone-500 text-sm font-medium flex items-center gap-1.5"><MapPin size={16}/>{trip.destination}</p>
                </div>
                <div className="text-sm font-bold text-stone-400 border-t border-stone-100 pt-4 mt-4">
                  {new Date(trip.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link to="/create-trip" className="fixed bottom-8 right-8 bg-slate text-white rounded-full px-8 py-4 font-bold hover:bg-slate/90 transition-all flex items-center gap-3 shadow-2xl hover:scale-105 hover:-translate-y-1 z-50 text-lg border-4 border-white/20 backdrop-blur-sm">
        <Plus size={24} /> Plan a trip
      </Link>
    </div>
  );
}
