import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { addTrip } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tripId = Date.now().toString();
    addTrip({
      id: tripId,
      ...formData,
      budget: 0,
      expenses: 0,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800'
    });
    navigate(`/build-itinerary?tripId=${tripId}`);
  };

  const suggestions = [
    { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80', desc: 'City of Light' },
    { name: 'Santorini, Greece', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80', desc: 'Stunning Sunsets' },
    { name: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', desc: 'Neon & Tradition' },
    { name: 'New York, USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', desc: 'The Big Apple' },
    { name: 'Banff, Canada', img: 'https://images.unsplash.com/photo-1517934421021-396489370643?auto=format&fit=crop&w=600&q=80', desc: 'Mountain Vistas' },
    { name: 'Sydney, Australia', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80', desc: 'Harbour Views' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="mb-10 border-b border-stone-200 pb-8">
        <h2 className="text-4xl font-display font-black text-slate">Plan a new trip</h2>
        <p className="text-stone-500 font-medium mt-3 text-lg">Let's map out the basics for your next big adventure.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-stone-100 mb-16">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <label className="w-36 font-bold text-slate text-sm uppercase tracking-wide">Trip Name:</label>
            <div className="relative flex-1">
              <Navigation className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-terracotta focus:bg-white focus:shadow-sm transition-all font-medium text-slate" placeholder="e.g. Summer Eurotrip" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <label className="w-36 font-bold text-slate text-sm uppercase tracking-wide">Select a Place:</label>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-terracotta focus:bg-white focus:shadow-sm transition-all font-medium text-slate" placeholder="City or Country" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <label className="w-36 font-bold text-slate text-sm uppercase tracking-wide">Start Date:</label>
            <div className="relative flex-1">
              <Calendar className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-terracotta focus:bg-white focus:shadow-sm transition-all font-medium text-slate" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <label className="w-36 font-bold text-slate text-sm uppercase tracking-wide">End Date:</label>
            <div className="relative flex-1">
              <Calendar className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-terracotta focus:bg-white focus:shadow-sm transition-all font-medium text-slate" />
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-8">
        <h3 className="font-display font-bold text-3xl text-slate">Suggestions for Places to Visit</h3>
        <button onClick={handleSubmit} className="bg-slate text-white px-8 py-3 rounded-xl font-bold shadow-md hover:-translate-y-1 hover:shadow-lg transition-all hidden md:block">
          Proceed to Builder
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {suggestions.map((s, idx) => (
          <div key={idx} className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-stone-100">
            <SafeImage src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/20 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-xl mb-1">{s.name}</h4>
              <p className="text-white/80 font-medium text-sm">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 md:hidden">
        <button onClick={handleSubmit} className="w-full bg-slate text-white px-8 py-4 rounded-xl font-bold shadow-md hover:-translate-y-1 transition-all">
          Proceed to Builder
        </button>
      </div>
    </div>
  );
}
