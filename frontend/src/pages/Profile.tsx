import React from 'react';
import { useStore } from '../store';
import { Settings, MapPin, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/SafeImage';

export default function Profile() {
  const { user, trips, logout } = useStore();

  const buddies: any[] = [];

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b border-stone-200 pb-12 mt-8">
        <div className="relative">
          <SafeImage src={user?.avatar || ''} alt="Profile" className="w-48 h-48 rounded-full border-4 border-white shadow-xl object-cover" />
          <button className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-md text-slate hover:text-terracotta transition-colors border border-stone-100">
            <Edit3 size={20} />
          </button>
        </div>
        <div className="flex-1 bg-white border border-stone-200 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div>
            <h1 className="text-4xl font-display font-black text-slate mb-2">{user?.name}</h1>
            <p className="text-stone-500 font-medium flex items-center justify-center md:justify-start gap-1.5 mb-2"><MapPin size={16}/> New York, USA</p>
            <p className="text-slate/60 text-sm font-medium">{user?.email}</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button className="border-2 border-slate text-slate px-8 py-3 rounded-full font-bold hover:bg-slate hover:text-white transition-colors flex items-center gap-2">
              <Settings size={18} /> Edit Profile
            </button>
            <button 
              onClick={() => logout()} 
              className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-full font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="mb-16">
        <h3 className="font-display font-bold text-3xl mb-8 text-slate">Travel Buddies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {buddies.map((buddy, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-shadow text-center">
              <SafeImage src={buddy.img} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-stone-100" alt={buddy.name} />
              <div className="mb-6">
                <h4 className="font-bold text-lg text-slate">{buddy.name}</h4>
                <p className="text-stone-500 text-sm font-medium">{buddy.trips} shared trips</p>
              </div>
              <button className="w-full border border-stone-200 rounded-xl py-2.5 font-bold text-slate hover:bg-stone-50 transition-colors">View Profile</button>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div className="mb-12">
        <h3 className="font-display font-bold text-3xl mb-8 text-slate">Previous Trips</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trips.map((trip, i) => (
            <div key={i} className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[3/4]">
              <SafeImage src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/20 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-white font-bold text-xl mb-1">{trip.name}</h4>
                <p className="text-white/80 text-sm font-medium mb-4">{trip.destination}</p>
                <Link to={`/itinerary/${trip.id}`} className="w-full bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl py-2.5 font-bold hover:bg-white hover:text-slate transition-colors text-center">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
