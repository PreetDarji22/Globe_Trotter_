import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { SafeImage } from '../components/SafeImage';
import { MapPin, Share2, Copy, Check, GitFork, Clock, Heart, Calendar, ShieldCheck } from 'lucide-react';

export default function SharedItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTripDetails, forkTrip } = useStore() as any;
  const [copied, setCopied] = useState(false);
  const [forkedSuccess, setForkedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTripDetails(id);
    }
  }, [id]);

  const handleFork = async () => {
    if (!id) return;
    const newTripId = await forkTrip(id);
    if (newTripId) {
      setForkedSuccess(true);
      setTimeout(() => {
        navigate(`/itinerary/${newTripId}`);
      }, 1200);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const trip = currentTrip || {
    id: id || 'sample-1',
    name: 'Hidden Tokyo & Kyoto Alleyways',
    description: 'A 7-day curated dive into underground cafes, ancient shrines, and local culinary spots.',
    coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    isPublic: true,
    user: { firstName: 'Mia', lastName: 'Explorer', profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150' },
    stops: [
      {
        id: 'stop-1',
        city: { name: 'Tokyo', country: 'Japan' },
        startDate: '2026-09-10',
        endDate: '2026-09-13',
        activities: [
          { id: 'act-1', name: 'Asakusa Temple & Senso-ji Walk', category: 'Sightseeing', estimatedCost: 35, startTime: '2026-09-10T09:00:00Z' },
          { id: 'act-2', name: 'Tsukiji Outer Market Food Tour', category: 'Food', estimatedCost: 65, startTime: '2026-09-11T11:00:00Z' }
        ]
      },
      {
        id: 'stop-2',
        city: { name: 'Kyoto', country: 'Japan' },
        startDate: '2026-09-14',
        endDate: '2026-09-17',
        activities: [
          { id: 'act-3', name: 'Fushimi Inari Taisha Shrine', category: 'Sightseeing', estimatedCost: 20, startTime: '2026-09-14T08:00:00Z' },
          { id: 'act-4', name: 'Traditional Kaiseki Dinner', category: 'Food', estimatedCost: 110, startTime: '2026-09-15T19:00:00Z' }
        ]
      }
    ]
  };

  const totalCost = trip.stops?.reduce((acc: number, stop: any) => {
    return acc + (stop.activities?.reduce((sum: number, act: any) => sum + (Number(act.estimatedCost || act.cost) || 0), 0) || 0);
  }, 0) || 230;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-500 pb-24">
      
      {/* Public Banner Header */}
      <div className="w-full bg-stone-900 text-white rounded-[2.5rem] overflow-hidden shadow-xl mb-8 relative">
        <div className="h-[22rem] relative">
          <SafeImage src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent flex items-end p-8 md:p-12">
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="bg-terracotta text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
                  Public Itinerary
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">{trip.name}</h1>
                <p className="text-white/80 font-medium text-base mt-2 max-w-2xl">{trip.description}</p>
              </div>

              {/* Action Buttons: Copy Link & Copy/Fork Trip */}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={handleCopyLink}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-slate transition-all flex items-center gap-2"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                  {copied ? 'Link Copied!' : 'Share Itinerary'}
                </button>

                <button 
                  onClick={handleFork}
                  className="bg-terracotta text-white px-7 py-3 rounded-full font-bold text-base hover:bg-terracotta/90 transition-all flex items-center gap-2 shadow-lg hover:scale-105"
                >
                  <GitFork size={20} />
                  {forkedSuccess ? 'Cloned to Account!' : 'Copy Trip'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Info & Metadata Bar */}
        <div className="bg-stone-950 border-t border-white/10 p-6 px-8 flex flex-wrap justify-between items-center gap-4 text-sm font-medium text-stone-300">
          <div className="flex items-center gap-3">
            <SafeImage src={trip.user?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'} className="w-10 h-10 rounded-full border-2 border-terracotta object-cover" alt="Creator" />
            <div>
              <span className="text-xs text-stone-400 block">Curated by</span>
              <span className="font-bold text-white">{trip.user?.firstName || 'Travel'} {trip.user?.lastName || 'Guide'}</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            <span>Stops: <strong className="text-white">{trip.stops?.length || 2} Cities</strong></span>
            <span>Est. Cost: <strong className="text-emerald-400">${totalCost}</strong></span>
            <span>Mode: <strong className="text-terracotta">Public Share</strong></span>
          </div>
        </div>
      </div>

      {/* Share Social Links Quick Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-10 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <span className="text-sm font-bold text-slate flex items-center gap-2">
          <ShieldCheck size={18} className="text-terracotta" /> Shareable Read-Only Link Active
        </span>

        <div className="flex items-center gap-3">
          <button onClick={handleCopyLink} className="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-slate px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5">
            <Copy size={14} /> Copy Link
          </button>
          <a href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20itinerary:%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-3.5 py-2 rounded-xl transition-colors">
            Twitter / X
          </a>
          <a href={`https://api.whatsapp.com/send?text=Check%20out%20this%20itinerary:%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3.5 py-2 rounded-xl transition-colors">
            WhatsApp
          </a>
        </div>
      </div>

      {/* Read-Only Itinerary Timeline */}
      <h2 className="text-3xl font-display font-bold text-slate mb-6">Full Itinerary Timeline</h2>

      <div className="space-y-8">
        {trip.stops?.map((stop: any, idx: number) => (
          <div key={stop.id || idx} className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
              <div>
                <span className="bg-sand text-slate px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Stop {idx + 1}
                </span>
                <h3 className="text-2xl font-bold text-slate mt-2 flex items-center gap-2">
                  <MapPin size={22} className="text-terracotta" /> {stop.city?.name || stop.name}, {stop.city?.country}
                </h3>
              </div>

              <span className="text-xs font-bold text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg">
                {stop.startDate ? new Date(stop.startDate).toLocaleDateString() : 'Day ' + (idx*2 + 1)} - {stop.endDate ? new Date(stop.endDate).toLocaleDateString() : 'Day ' + (idx*2 + 2)}
              </span>
            </div>

            <div className="space-y-4">
              {stop.activities?.map((act: any, aIdx: number) => (
                <div key={act.id || aIdx} className="bg-stone-50 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {act.category || act.activityType || 'Sightseeing'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate text-lg">{act.name || act.title}</h4>
                  </div>

                  <span className="font-black text-slate text-xl">${act.estimatedCost || act.cost || 0}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Floating Copy Trip Footer CTA */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate/95 backdrop-blur-md text-white rounded-full px-8 py-4 shadow-2xl flex items-center gap-6 border-2 border-white/20 z-50">
        <div>
          <span className="text-xs font-bold text-stone-400 block uppercase">Like this itinerary?</span>
          <span className="font-bold text-white text-sm">Copy all cities & activities into your account</span>
        </div>
        <button onClick={handleFork} className="bg-terracotta text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-terracotta/90 transition-all flex items-center gap-2 hover:scale-105">
          <GitFork size={18} /> Copy Trip
        </button>
      </div>

    </div>
  );
}
