import React from 'react';
import { ActionBar } from '../components/ActionBar';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const { communityTrips, fetchCommunityTrips, forkTrip } = useStore() as any;
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCommunityTrips();
  }, []);

  const handleFork = async (tripId: string) => {
    const newTripId = await forkTrip(tripId);
    if (newTripId) {
      navigate(`/itinerary/${newTripId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      <div className="flex justify-between items-end mb-10 mt-8 border-b border-stone-200 pb-4">
        <h2 className="font-display font-black text-3xl text-slate">Community Feed</h2>
        <span className="text-stone-500 font-medium">Discover & fork itineraries</span>
      </div>
      
      <div className="space-y-12">
        {communityTrips.map((post: any) => (
          <div key={post.id} className="flex flex-col md:flex-row gap-6">
            
            <div className="flex flex-col items-center gap-2 md:w-20 shrink-0">
              <SafeImage src={post.user?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'} className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover" alt={post.user?.firstName} />
              <span className="text-xs font-bold text-slate text-center">{post.user?.firstName} {post.user?.lastName}</span>
            </div>
            
            <div className="flex-1 bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-64 relative">
                <SafeImage src={post.coverPhoto || 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000'} className="w-full h-full object-cover" alt={post.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-display font-bold text-2xl">{post.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate/80 font-medium leading-relaxed mb-6">{post.description || 'No description provided.'}</p>
                <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-stone-500 font-bold hover:text-terracotta transition-colors">
                      <Heart size={20} /> 0
                    </button>
                    <button className="flex items-center gap-2 text-stone-500 font-bold hover:text-blue-500 transition-colors">
                      <MessageCircle size={20} /> Reply
                    </button>
                  </div>
                  <button onClick={() => handleFork(post.id)} className="bg-slate text-white px-5 py-2 rounded-full font-bold shadow-sm hover:bg-slate/90 transition-colors hover:scale-105">
                    Fork Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
