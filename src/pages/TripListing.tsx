import React from 'react';
import { ActionBar } from '../components/ActionBar';
import { useStore } from '../store';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/SafeImage';

export default function TripListing() {
  const { trips } = useStore();
  
  const renderSection = (title: string, status: string) => {
    const sectionTrips = trips.filter(t => t.status === status);
    if (sectionTrips.length === 0) return null;

    return (
      <div className="mb-12 animate-in fade-in">
        <h3 className="font-display font-bold text-3xl mb-6 text-slate flex items-center gap-4">
          {title}
          <div className="h-px bg-stone-200 flex-1"></div>
        </h3>
        <div className="space-y-6">
          {sectionTrips.map(trip => (
            <Link to={`/itinerary/${trip.id}`} key={trip.id} className="group block w-full bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row">
              <div className="md:w-72 h-48 md:h-auto overflow-hidden relative shrink-0">
                <SafeImage src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.name} />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-display font-bold text-2xl text-slate group-hover:text-terracotta transition-colors">{trip.name}</h4>
                  <span className="bg-sand text-slate px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{trip.status}</span>
                </div>
                <p className="text-stone-500 font-medium flex items-center gap-1.5 mb-6"><MapPin size={16}/>{trip.destination}</p>
                <div className="flex justify-between items-center mt-auto pt-6 border-t border-stone-100">
                  <div className="text-slate font-bold">
                    {new Date(trip.startDate).toLocaleDateString(undefined, {month: 'long', day: 'numeric'})} - {new Date(trip.endDate).toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}
                  </div>
                  <div className="flex items-center gap-2 text-terracotta font-bold">
                    View Itinerary <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ActionBar />
      <div className="mt-12">
        {renderSection('Ongoing Trips', 'ongoing')}
        {renderSection('Up-coming Trips', 'upcoming')}
        {renderSection('Completed Trips', 'completed')}
      </div>
    </div>
  );
}
