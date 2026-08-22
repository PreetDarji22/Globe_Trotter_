import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ActionBar } from '../components/ActionBar';
import { Clock, MapPin, Coffee, Camera, Bed, Plane } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function ItineraryView() {
  const { id } = useParams();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === id) || trips[0];

  const schedule = [
    { 
      day: 'Day 1',
      date: 'Oct 1, 2024',
      items: [
        { id: 1, type: 'Transit', title: 'Arrival at Narita Airport', time: '10:00 AM', cost: 40, icon: Plane },
        { id: 2, type: 'Stay', title: 'Check in to Shinjuku Prince Hotel', time: '02:00 PM', cost: 150, icon: Bed },
        { id: 3, type: 'Food', title: 'Dinner at Ichiran Ramen', time: '07:00 PM', cost: 25, icon: Coffee },
      ]
    },
    { 
      day: 'Day 2',
      date: 'Oct 2, 2024',
      items: [
        { id: 4, type: 'Sightseeing', title: 'Tokyo Skytree Tour', time: '10:00 AM', cost: 30, icon: Camera },
        { id: 5, type: 'Food', title: 'Tsukiji Outer Market Tasting', time: '01:00 PM', cost: 45, icon: Coffee },
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 mt-8 bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-6">
          <SafeImage src={trip.image || ''} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt={trip.name} />
          <div>
            <h2 className="font-display font-black text-3xl text-slate">{trip.name}</h2>
            <p className="text-stone-500 font-medium flex items-center gap-1.5 mt-1"><MapPin size={16}/> {trip.destination}</p>
          </div>
        </div>
        <div className="mt-6 md:mt-0 text-right pr-4 md:border-l border-stone-200 md:pl-8">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Budget</p>
          <p className="text-3xl font-black text-genz-green">${trip.budget || 3000}</p>
        </div>
      </div>
      
      <div className="flex justify-between px-16 md:px-32 mb-8 font-bold text-sm uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-4">
         <span>Physical Activity</span>
         <span>Expense</span>
      </div>
      
      <div className="space-y-16">
        {schedule.map((dayGroup, groupIdx) => (
          <div key={groupIdx} className="relative border-l-[3px] border-stone-200 ml-8 md:ml-16 pl-8 md:pl-16 space-y-8 pb-4">
            
            <div className="absolute -left-12 md:-left-[3.25rem] top-0 bg-white border-4 border-slate rounded-full px-5 py-2 shadow-sm flex flex-col items-center justify-center text-slate">
              <span className="font-black text-lg">{dayGroup.day}</span>
            </div>
            <div className="mb-8 pt-2 text-stone-500 font-bold">{dayGroup.date}</div>
            
            {dayGroup.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative w-full pr-4 md:pr-12 group">
                  {idx !== dayGroup.items.length - 1 && (
                    <div className="hidden md:flex absolute left-[35%] -bottom-[3.5rem] w-0.5 h-[3.5rem] bg-stone-300 items-center justify-center z-0">
                      <div className="w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-stone-400 transform rotate-45 translate-y-2 rounded-sm"></div>
                    </div>
                  )}
                  
                  {/* Physical Activity Box */}
                  <div className="w-full md:flex-1 border border-stone-200 rounded-3xl p-5 bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-5 z-10 hover:border-stone-300">
                    <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-slate shrink-0">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate leading-tight">{item.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="bg-sand text-slate px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">{item.type}</span>
                        <p className="text-stone-500 text-sm font-medium flex items-center gap-1.5">
                          <Clock size={14}/> {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expense Box */}
                  <div className="w-full md:w-48 border border-stone-200 rounded-3xl p-5 bg-white shadow-sm flex flex-col items-center justify-center group-hover:border-terracotta/50 transition-colors z-10">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Cost</span>
                    <span className="font-black text-2xl text-slate">${item.cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
