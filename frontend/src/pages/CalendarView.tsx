import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ActionBar } from '../components/ActionBar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, Edit3, X, Check } from 'lucide-react';

export default function CalendarView() {
  const { trips, fetchTrips, currentTrip, fetchTripDetails, addActivity } = useStore() as any;
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Aug 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCost, setEditCost] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newTime, setNewTime] = useState('10:00 AM');

  useEffect(() => {
    fetchTrips();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get total days and start day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Aggregate activities mapped to calendar days
  const eventsByDay: { [day: number]: any[] } = {
    5: [{ id: '1', title: 'Tokyo Skytree & Asakusa Tour', type: 'Sightseeing', cost: 45, time: '09:00 AM', location: 'Tokyo' }],
    6: [{ id: '2', title: 'Sushi Masterclass Dinner', type: 'Food', cost: 110, time: '07:00 PM', location: 'Ginza, Tokyo' }],
    12: [{ id: '3', title: 'Bullet Train to Kyoto', type: 'Transit', cost: 90, time: '08:30 AM', location: 'Kyoto' }],
    14: [{ id: '4', title: 'Kiyomizu-dera & Tea Ceremony', type: 'Sightseeing', cost: 35, time: '01:00 PM', location: 'Kyoto' }],
    22: [{ id: '5', title: 'Amalfi Coast Boat Cruise', type: 'Sightseeing', cost: 130, time: '10:00 AM', location: 'Amalfi' }],
    25: [{ id: '6', title: 'Swiss Alps Cable Car Pass', type: 'Transit', cost: 75, time: '11:00 AM', location: 'Zermatt' }]
  };

  // Merge real trip stops & activities if available
  if (trips && trips.length > 0) {
    trips.forEach((t: any) => {
      const tripStart = new Date(t.startDate);
      if (tripStart.getMonth() === month && tripStart.getFullYear() === year) {
        const day = tripStart.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push({
          id: t.id,
          title: t.name,
          type: 'Trip Start',
          cost: t.budget || 0,
          time: 'All Day',
          location: t.destination || t.name
        });
      }
    });
  }

  const handleSaveEdit = (day: number, actId: string) => {
    const list = eventsByDay[day] || [];
    const target = list.find((a: any) => a.id === actId);
    if (target) {
      if (editTitle) target.title = editTitle;
      if (editCost) target.cost = Number(editCost);
    }
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (day: number, actId: string) => {
    if (eventsByDay[day]) {
      eventsByDay[day] = eventsByDay[day].filter((a: any) => a.id !== actId);
    }
    setSelectedDay(null);
  };

  const handleAddActivityToDay = (day: number) => {
    if (!newTitle) return;
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push({
      id: String(Date.now()),
      title: newTitle,
      type: newCategory,
      cost: Number(newCost) || 0,
      time: newTime,
      location: 'Custom Location'
    });
    setNewTitle('');
    setNewCost('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500 pb-24">
      <ActionBar />

      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-2">
          <div>
            <span className="bg-purple-100 text-purple-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Interactive Timeline
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-slate mt-2">Trip Calendar & Timeline</h2>
            <p className="text-stone-500 font-medium text-sm">Visualize daily itinerary schedules, expand day plans, and quick-edit activities.</p>
          </div>

          {/* Month Navigation */}
          <div className="mt-4 md:mt-0 flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-full px-5 py-2">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-slate hover:bg-stone-100 transition-colors shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-display font-black text-xl text-slate min-w-[160px] text-center">{monthName}</h3>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-slate hover:bg-stone-100 transition-colors shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="bg-stone-100/70 p-3 text-center text-xs font-bold tracking-wider text-stone-500 rounded-xl">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty lead cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-stone-50/40 rounded-2xl min-h-[110px] p-2 opacity-30"></div>
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = eventsByDay[dayNum] || [];
            const hasEvents = dayEvents.length > 0;

            return (
              <div 
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`group rounded-2xl p-2.5 min-h-[120px] relative transition-all cursor-pointer border flex flex-col justify-between ${
                  hasEvents ? 'bg-amber-50/30 border-terracotta/30 hover:border-terracotta hover:shadow-md' : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-black w-7 h-7 rounded-full flex items-center justify-center ${
                    hasEvents ? 'bg-terracotta text-white' : 'text-slate'
                  }`}>
                    {dayNum}
                  </span>
                  {hasEvents && (
                    <span className="text-[10px] font-bold bg-white/80 text-stone-600 px-1.5 py-0.5 rounded-full border border-stone-200">
                      {dayEvents.length} Event(s)
                    </span>
                  )}
                </div>

                {/* Day Events Stack */}
                <div className="space-y-1.5 mt-2">
                  {dayEvents.slice(0, 2).map((evt: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`text-[11px] font-bold px-2 py-1.5 rounded-lg truncate shadow-sm flex items-center justify-between ${
                        evt.type === 'Food' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        evt.type === 'Transit' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        'bg-slate text-white'
                      }`}
                    >
                      <span className="truncate">{evt.title}</span>
                      {evt.cost > 0 && <span className="text-[9px] opacity-80 shrink-0 ml-1">${evt.cost}</span>}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[10px] font-bold text-stone-500 block text-center">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Day Detail Drawer / Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
              <div>
                <span className="bg-terracotta text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Day Schedule Detail
                </span>
                <h3 className="font-display font-black text-2xl text-slate mt-1">
                  {monthName} {selectedDay}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                className="w-9 h-9 rounded-full bg-stone-200 text-stone-600 font-bold flex items-center justify-center hover:bg-stone-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Vertical Timeline */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {eventsByDay[selectedDay] && eventsByDay[selectedDay].length > 0 ? (
                eventsByDay[selectedDay].map((act: any) => (
                  <div key={act.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-stone-300 transition-colors">
                    
                    <div className="flex-1">
                      {editingActivityId === act.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            defaultValue={act.title} 
                            onChange={e => setEditTitle(e.target.value)}
                            className="border-2 border-slate rounded-lg px-3 py-1 text-sm font-bold w-full"
                          />
                          <input 
                            type="number" 
                            defaultValue={act.cost} 
                            onChange={e => setEditCost(e.target.value)}
                            className="border-2 border-slate rounded-lg px-3 py-1 text-sm font-bold w-20"
                          />
                          <button onClick={() => handleSaveEdit(selectedDay, act.id)} className="bg-emerald-600 text-white p-1.5 rounded-lg">
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-stone-200 text-slate px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {act.type}
                            </span>
                            <span className="text-stone-400 text-xs font-bold flex items-center gap-1">
                              <Clock size={12} /> {act.time}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate text-lg">{act.title}</h4>
                          <p className="text-stone-500 text-xs font-medium flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {act.location}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-black text-slate text-xl">${act.cost}</span>
                      
                      <button 
                        onClick={() => {
                          setEditingActivityId(act.id);
                          setEditTitle(act.title);
                          setEditCost(act.cost.toString());
                        }}
                        className="text-stone-400 hover:text-slate p-1.5 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button 
                        onClick={() => handleDeleteActivity(selectedDay, act.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-stone-500 font-medium">
                  No scheduled activities for this day yet.
                </div>
              )}

              {/* Add Activity Button inside modal */}
              {showAddModal ? (
                <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4 mt-4">
                  <h4 className="font-bold text-slate mb-3 text-sm">Add New Activity to Day {selectedDay}</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input 
                      placeholder="Activity Title" 
                      value={newTitle} 
                      onChange={e => setNewTitle(e.target.value)} 
                      className="border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium outline-none" 
                    />
                    <input 
                      type="number" 
                      placeholder="Cost ($)" 
                      value={newCost} 
                      onChange={e => setNewCost(e.target.value)} 
                      className="border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium outline-none" 
                    />
                    <select 
                      value={newCategory} 
                      onChange={e => setNewCategory(e.target.value)}
                      className="border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium outline-none bg-white"
                    >
                      <option>Sightseeing</option><option>Food</option><option>Transit</option><option>Stay</option>
                    </select>
                    <input 
                      placeholder="Time (e.g. 10:00 AM)" 
                      value={newTime} 
                      onChange={e => setNewTime(e.target.value)} 
                      className="border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium outline-none" 
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-1.5 text-xs font-bold text-stone-500">Cancel</button>
                    <button onClick={() => handleAddActivityToDay(selectedDay)} className="bg-terracotta text-white px-5 py-1.5 rounded-xl text-xs font-bold">Save Activity</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full border-2 border-dashed border-stone-300 rounded-2xl p-3 text-stone-500 font-bold hover:bg-stone-50 hover:border-stone-400 transition-all flex items-center justify-center gap-2 mt-4 text-sm"
                >
                  <Plus size={16} /> Add Activity to Day {selectedDay}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
