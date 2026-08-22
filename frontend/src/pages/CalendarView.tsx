import React, { useState } from 'react';
import { ActionBar } from '../components/ActionBar';

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1)); // Jan 2024

  return (
    <div className="max-w-5xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      <div className="bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-10 px-4">
          <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center font-bold text-slate hover:bg-stone-50 transition-colors">←</button>
          <h3 className="font-display font-black text-3xl text-slate">January 2024</h3>
          <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center font-bold text-slate hover:bg-stone-50 transition-colors">→</button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200 overflow-hidden rounded-2xl">
          {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
            <div key={d} className="bg-stone-50 p-4 text-center text-xs font-bold tracking-widest text-stone-500">{d}</div>
          ))}
          {Array.from({length: 35}).map((_, i) => (
            <div key={i} className={`bg-white p-2 min-h-[120px] relative transition-colors hover:bg-stone-50 ${i < 2 || i > 32 ? 'opacity-40 bg-stone-50' : ''}`}>
              <span className="text-sm font-bold m-2 text-slate">{i < 2 ? 30 + i : i > 32 ? i - 32 : i - 1}</span>
              
              {/* Trip spans matching the architecture requested */}
              {i >= 6 && i <= 10 && (
                <div className="absolute top-1/2 left-0 right-[-1px] z-10 bg-[#E9AAFA] text-slate text-xs px-3 py-2 truncate font-bold shadow-sm">PARIS TRIP</div>
              )}
              {i >= 16 && i <= 23 && (
                <div className="absolute bottom-2 left-0 right-[-1px] z-10 bg-[#FA7246] text-white text-xs px-3 py-2 truncate font-bold shadow-sm">NYC - GETAWAY</div>
              )}
              {i >= 17 && i <= 19 && (
                <div className="absolute top-1/4 left-0 right-[-1px] z-20 bg-[#3A8B6F] text-white text-xs px-3 py-2 truncate font-bold shadow-sm">JAPAN ADVENTURE</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
