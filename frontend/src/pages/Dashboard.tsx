import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ActionBar } from '../components/ActionBar';
import { useStore } from '../store';
import { MapPin, Plus, Compass, Calendar, Sparkles, Heart, GitFork, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, trips, fetchTrips, communityTrips, fetchCommunityTrips, forkTrip } = useStore() as any;

  useEffect(() => {
    fetchTrips();
    fetchCommunityTrips();
  }, []);

  const handleFork = async (tripId: string) => {
    const newTripId = await forkTrip(tripId);
    if (newTripId) {
      navigate(`/itinerary/${newTripId}`);
    }
  };

  const regions = [
    { name: 'Kyoto, Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', desc: 'Ancient Temples & Shrines', cost: '$110/day', tag: 'Culture' },
    { name: 'Amalfi Coast, Italy', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', desc: 'Coastal Cliffside Escapes', cost: '$160/day', tag: 'Luxury' },
    { name: 'Swiss Alps, Switzerland', img: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=800&q=80', desc: 'Majestic Alpine Peaks', cost: '$190/day', tag: 'Adventure' },
    { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', desc: 'Tropical Beach & Wellness', cost: '$65/day', tag: 'Budget' },
  ];

  const uniqueDestinations = new Set(trips.map((t: any) => t.destination || t.name)).size;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col min-h-screen relative pb-24 animate-in fade-in duration-500">
      
      {/* Logged-In User Banner & Greeting */}
      <div className="w-full bg-gradient-to-r from-slate via-slate/95 to-slate/90 text-white rounded-[2rem] p-8 md:p-10 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-terracotta/20 text-terracotta border border-terracotta/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} /> Logged In as {user?.email || 'User'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight drop-shadow-sm">
              Welcome back, <span className="text-terracotta">{user?.name || 'Explorer'}</span>! ✈️
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mt-2 font-medium">
              Manage your personal itineraries, track travel budgets, and clone curated community trips.
            </p>
          </div>
          
          <Link to="/create-trip" className="bg-terracotta text-white px-6 py-3.5 rounded-full font-bold shadow-lg hover:bg-terracotta/90 transition-all flex items-center gap-2 text-base hover:scale-105 shrink-0">
            <Plus size={20} /> Create New Trip
          </Link>
        </div>

        {/* Quick User Stats Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-white/10 pt-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">My Trips</span>
            <p className="text-3xl font-black text-white mt-1">{trips.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Destinations</span>
            <p className="text-3xl font-black text-white mt-1">{uniqueDestinations}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Community Feeds</span>
            <p className="text-3xl font-black text-white mt-1">{communityTrips.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Status</span>
            <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <UserCheck size={18} /> Active Session
            </p>
          </div>
        </div>
      </div>
      
      <ActionBar />

      {/* Quick Action Navigation Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 mt-4">
        <Link to="/create-trip" className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md hover:border-terracotta transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate group-hover:text-terracotta transition-colors">Plan Trip</h4>
            <p className="text-xs text-stone-500 font-medium">New Itinerary</p>
          </div>
        </Link>

        <Link to="/community" className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Compass size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate group-hover:text-blue-600 transition-colors">Community</h4>
            <p className="text-xs text-stone-500 font-medium">Fork Shared Trips</p>
          </div>
        </Link>

        <Link to="/calendar" className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate group-hover:text-purple-600 transition-colors">Calendar</h4>
            <p className="text-xs text-stone-500 font-medium">Timeline Schedule</p>
          </div>
        </Link>

        <Link to="/search" className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate group-hover:text-emerald-600 transition-colors">Search</h4>
            <p className="text-xs text-stone-500 font-medium">Find Destinations</p>
          </div>
        </Link>
      </div>

      {/* User's Current & Upcoming Trips */}
      <div className="mb-14">
        <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-3xl font-display font-bold text-slate">Your Travel Itineraries</h3>
            <p className="text-stone-500 text-sm font-medium mt-1">Saved trips created by {user?.name || 'you'}</p>
          </div>
          <Link to="/trips" className="text-terracotta font-bold hover:underline flex items-center gap-1">
            View all ({trips.length}) <ArrowRight size={16} />
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trips.slice(0, 3).map((trip: any) => (
              <Link to={`/itinerary/${trip.id}`} key={trip.id} className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white border border-stone-100 flex flex-col">
                <div className="h-3/5 overflow-hidden relative">
                  <SafeImage src={trip.image || ''} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate shadow-sm">
                    {trip.status || 'upcoming'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-2xl text-slate mb-2 group-hover:text-terracotta transition-colors">{trip.name}</h4>
                    <p className="text-stone-500 text-sm font-medium flex items-center gap-1.5"><MapPin size={16}/>{trip.destination}</p>
                  </div>
                  <div className="text-sm font-bold text-stone-400 border-t border-stone-100 pt-4 mt-4 flex justify-between items-center">
                    <span>{new Date(trip.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    <span className="text-terracotta group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-terracotta flex items-center justify-center mb-4 font-bold text-xl">
              ✈️
            </div>
            <h4 className="text-2xl font-bold text-slate mb-2">No active trips planned yet</h4>
            <p className="text-stone-500 max-w-md mb-6 font-medium">Start by creating your first custom itinerary or fork a popular destination template below.</p>
            <Link to="/create-trip" className="bg-terracotta text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-terracotta/90 transition-all flex items-center gap-2">
              <Plus size={18} /> Create Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Community Itineraries Highlights */}
      {communityTrips.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-3xl font-display font-bold text-slate">Community Highlights</h3>
              <p className="text-stone-500 text-sm font-medium mt-1">Fork curated itineraries into your account with one click</p>
            </div>
            <Link to="/community" className="text-terracotta font-bold hover:underline flex items-center gap-1">
              Explore Feed <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityTrips.slice(0, 2).map((item: any) => (
              <div key={item.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="h-48 relative">
                  <SafeImage src={item.coverPhoto || 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000'} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Shared by {item.user?.firstName} {item.user?.lastName}</span>
                      <h4 className="text-white font-bold text-2xl">{item.name}</h4>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <p className="text-stone-600 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                    {item.description || 'Public itinerary shared by the community. Clone it to customize your schedule.'}
                  </p>
                  <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                    <span className="text-stone-400 text-xs font-bold flex items-center gap-1">
                      <MapPin size={14} /> {item.stops?.length || 1} Stop(s) Included
                    </span>
                    <button onClick={() => handleFork(item.id)} className="bg-slate text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-slate/90 transition-all flex items-center gap-2 hover:scale-105 shadow-sm">
                      <GitFork size={16} /> Fork Itinerary
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Regional Selections & Destinations */}
      <div className="mb-16">
        <h3 className="text-3xl font-display font-bold text-slate mb-2">Top Regional Destinations</h3>
        <p className="text-stone-500 text-sm font-medium mb-6">Popular choices for modern travelers</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((r, idx) => (
            <div key={idx} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-stone-100">
              <SafeImage src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/20 to-transparent flex flex-col justify-end p-6">
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start mb-2">
                  {r.tag} • {r.cost}
                </span>
                <h4 className="text-white font-bold text-xl">{r.name}</h4>
                <p className="text-white/80 text-sm font-medium mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/create-trip" className="fixed bottom-8 right-8 bg-slate text-white rounded-full px-8 py-4 font-bold hover:bg-slate/90 transition-all flex items-center gap-3 shadow-2xl hover:scale-105 hover:-translate-y-1 z-50 text-lg border-4 border-white/20 backdrop-blur-sm">
        <Plus size={24} /> Plan a trip
      </Link>
    </div>
  );
}

