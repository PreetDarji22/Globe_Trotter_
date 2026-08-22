import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, MapPin, Edit3, UserCheck, Sparkles, X, Compass, Send, UserPlus, Heart, MessageSquare, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/SafeImage';

export default function Profile() {
  const { user, trips, logout, updateProfilePicture, communityTrips } = useStore() as any;
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedBuddy, setSelectedBuddy] = useState<any | null>(null);

  const buddies = [
    {
      id: 'mia',
      name: 'Mia Chen',
      role: 'Alpine Explorer & Photographer',
      location: 'Zurich, Switzerland',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400',
      trips: 3,
      bio: 'Mountain enthusiast, espresso seeker, and alpine scenic train ride expert.',
      favoriteSpot: 'Bernina Express & Lake Zurich',
      matchScore: '98%',
      stats: { countries: 18, itineraries: 14, followers: 420 },
      featuredItineraries: [
        { name: 'Swiss Alpine Glacier Explorer', desc: 'Scenic train rides & glacier hiking', cost: 180, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600' },
        { name: 'Bali Serenity & Waterfalls', desc: 'Yoga & Ubud rice terraces', cost: 80, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600' }
      ]
    },
    {
      id: 'sophia',
      name: 'Sophia Tanaka',
      role: 'Zen Cultural Specialist',
      location: 'Kyoto, Japan',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400',
      trips: 2,
      bio: 'Exploring traditional tea ceremonies, ancient shrines, and Gion alleyway food.',
      favoriteSpot: 'Arashiyama Bamboo Forest',
      matchScore: '95%',
      stats: { countries: 12, itineraries: 9, followers: 310 },
      featuredItineraries: [
        { name: 'Kyoto Zen Shrines & Bamboo', desc: 'Ancient temples & tea ceremonies', cost: 100, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600' }
      ]
    },
    {
      id: 'sam',
      name: 'Sam Vance',
      role: 'Aurora & Wilderness Guide',
      location: 'Reykjavik, Iceland',
      img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400',
      trips: 4,
      bio: 'Chasing Northern Lights and geothermal volcanic hot springs across Scandinavia.',
      favoriteSpot: 'Blue Lagoon & Vik Black Sands',
      matchScore: '92%',
      stats: { countries: 22, itineraries: 19, followers: 580 },
      featuredItineraries: [
        { name: 'Icelandic Aurora & Geysers', desc: 'Northern Lights & Blue Lagoon', cost: 245, image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600' }
      ]
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'European Rail & Architecture',
      location: 'Rome, Italy',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400',
      trips: 2,
      bio: 'Art historian and pasta connoisseur exploring Europe by high-speed rail.',
      favoriteSpot: 'Trastevere & Roman Forum',
      matchScore: '96%',
      stats: { countries: 15, itineraries: 11, followers: 390 },
      featuredItineraries: [
        { name: 'Classic Europe Rail Tour', desc: 'France & Italy highlights', cost: 190, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600' },
        { name: 'Rome Ancient Wonders Walk', desc: 'Colosseum, Vatican & Gelato', cost: 102, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600' }
      ]
    },
    {
      id: 'liam',
      name: 'Liam Gallagher',
      role: 'Urban Skyline & Broadway',
      location: 'New York, USA',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400',
      trips: 3,
      bio: 'Rooftop lounge enthusiast and Broadway musical fanatic living in NYC.',
      favoriteSpot: 'SUMMIT One Vanderbilt & Brooklyn Bridge',
      matchScore: '90%',
      stats: { countries: 14, itineraries: 8, followers: 270 },
      featuredItineraries: [
        { name: 'New York Broadway & Rooftops', desc: 'Musicals & Brooklyn Bridge', cost: 213, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600' }
      ]
    },
    {
      id: 'lucas',
      name: 'Lucas Silva',
      role: 'Digital Nomad & Street Foodie',
      location: 'Tokyo, Japan',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400',
      trips: 1,
      bio: 'Remote full-stack developer exploring underground street food markets & TeamLab art.',
      favoriteSpot: 'Shinjuku Omoide Yokocho',
      matchScore: '94%',
      stats: { countries: 25, itineraries: 21, followers: 640 },
      featuredItineraries: [
        { name: 'Hidden Tokyo Alleyways', desc: 'Underground cafes & TeamLab art', cost: 147, image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=600' }
      ]
    }
  ];

  const handleUpdatePhoto = async () => {
    if (photoUrl) {
      await updateProfilePicture(photoUrl);
      setEditingPhoto(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500 pb-32">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b border-stone-200 pb-12 mt-8">
        <div className="relative group">
          <SafeImage src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300'} alt="Profile" className="w-48 h-48 rounded-full border-4 border-white shadow-xl object-cover" />
          <button onClick={() => setEditingPhoto(true)} className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-md text-slate hover:text-terracotta transition-colors border border-stone-100">
            <Edit3 size={20} />
          </button>
        </div>

        {editingPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="font-bold text-xl text-slate mb-4">Update Profile Photo</h3>
              <input 
                placeholder="Paste Image URL" 
                value={photoUrl} 
                onChange={e => setPhotoUrl(e.target.value)} 
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 mb-6" 
              />
              <div className="flex gap-4">
                <button onClick={handleUpdatePhoto} className="flex-1 bg-slate text-white py-3 rounded-full font-bold">Save</button>
                <button onClick={() => setEditingPhoto(false)} className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-full font-bold">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 bg-white border border-stone-200 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <h1 className="text-4xl font-display font-black text-slate">{user?.name || 'Explorer'}</h1>
              <CheckCircle size={22} className="text-terracotta" />
            </div>
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

      {/* Travel Buddies Grid */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-display font-bold text-3xl text-slate">Travel Buddies</h3>
            <p className="text-stone-500 font-medium">Connect with fellow explorers sharing your wanderlust</p>
          </div>
          <span className="bg-sand text-slate px-4 py-1.5 rounded-full font-bold text-sm border border-stone-200">{buddies.length} Connected Buddies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {buddies.map((buddy) => (
            <div key={buddy.id} className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between items-center shadow-sm hover:shadow-xl transition-all group">
              <div className="relative mb-4">
                <SafeImage src={buddy.img} className="w-24 h-24 rounded-full object-cover border-4 border-stone-100 shadow-sm group-hover:scale-105 transition-transform" alt={buddy.name} />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-genz-green border-2 border-white"></span>
              </div>
              <div className="mb-6 text-center">
                <h4 className="font-bold text-lg text-slate mb-1">{buddy.name}</h4>
                <p className="text-terracotta font-semibold text-xs mb-2">{buddy.role}</p>
                <p className="text-stone-400 text-xs font-medium flex items-center justify-center gap-1"><MapPin size={12}/> {buddy.location}</p>
                <div className="mt-3 inline-block bg-stone-50 border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-stone-600">
                  ⚡ {buddy.trips} shared trips • {buddy.matchScore} Match
                </div>
              </div>
              <button 
                onClick={() => setSelectedBuddy(buddy)} 
                className="w-full border-2 border-slate rounded-2xl py-2.5 font-bold text-slate hover:bg-slate hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <UserCheck size={16} /> View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buddy Profile Modal */}
      {selectedBuddy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative border border-stone-200">
            
            {/* Header Banner */}
            <div className="h-40 bg-slate relative">
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000')" }}></div>
              <button 
                onClick={() => setSelectedBuddy(null)} 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black font-bold z-10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 overflow-y-auto -mt-16 flex-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-6">
                <SafeImage src={selectedBuddy.img} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10" alt={selectedBuddy.name} />
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-display font-black text-2xl text-slate">{selectedBuddy.name}</h3>
                    <CheckCircle size={20} className="text-terracotta" />
                  </div>
                  <p className="text-terracotta font-bold text-sm">{selectedBuddy.role}</p>
                  <p className="text-stone-500 font-medium text-xs flex items-center justify-center sm:justify-start gap-1 mt-1"><MapPin size={14}/> {selectedBuddy.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-terracotta text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-terracotta/90 transition-colors">
                    <UserPlus size={14} /> Connect
                  </button>
                  <button className="bg-slate text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate/90 transition-colors">
                    <Send size={14} /> Message
                  </button>
                </div>
              </div>

              {/* Bio & Stats Grid */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-6">
                <p className="text-stone-600 text-sm italic mb-4 font-medium">"{selectedBuddy.bio}"</p>
                <div className="grid grid-cols-3 gap-4 text-center border-t border-stone-200 pt-4">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase">Countries</p>
                    <p className="text-xl font-black text-slate">{selectedBuddy.stats.countries}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase">Itineraries</p>
                    <p className="text-xl font-black text-slate">{selectedBuddy.stats.itineraries}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase">Trip Match</p>
                    <p className="text-xl font-black text-genz-green">{selectedBuddy.matchScore}</p>
                  </div>
                </div>
              </div>

              {/* Favorite Spot */}
              <div className="mb-6">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Favorite Travel Destination</p>
                <div className="bg-sand/50 border border-stone-200 p-4 rounded-xl flex items-center gap-3">
                  <Compass size={20} className="text-terracotta shrink-0" />
                  <span className="font-bold text-slate text-sm">{selectedBuddy.favoriteSpot}</span>
                </div>
              </div>

              {/* Featured Itineraries */}
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Featured Public Itineraries</p>
                <div className="space-y-3">
                  {selectedBuddy.featuredItineraries.map((it: any, idx: number) => (
                    <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-stone-300 transition-all">
                      <div className="flex items-center gap-4">
                        <SafeImage src={it.image} className="w-14 h-14 rounded-xl object-cover" alt={it.name} />
                        <div>
                          <h5 className="font-bold text-slate text-sm">{it.name}</h5>
                          <p className="text-xs text-stone-500 font-medium">{it.desc}</p>
                        </div>
                      </div>
                      <span className="text-terracotta font-black text-sm shrink-0">${it.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Previous Trips */}
      <div className="mb-12">
        <h3 className="font-display font-bold text-3xl mb-8 text-slate">Previous Trips</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trips.map((trip: any, i: number) => (
            <div key={i} className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[3/4]">
              <SafeImage src={trip.coverPhoto || trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/20 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-white font-bold text-xl mb-1">{trip.name}</h4>
                <p className="text-white/80 text-sm font-medium mb-4">{trip.description || 'Custom Trip'}</p>
                <Link to={`/itinerary/${trip.id}`} className="w-full bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl py-2.5 font-bold hover:bg-white hover:text-slate transition-colors text-center">
                  View Itinerary
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
