import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ActionBar } from '../components/ActionBar';
import { Clock, MapPin, Coffee, Camera, Bed, Plane, Plus, List, Calendar as CalendarIcon, AlertTriangle, Search } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#F43F5E', '#8B5CF6'];

export default function ItineraryView() {
  const { id } = useParams();
  const { currentTrip, fetchTripDetails, addActivity, addTripStop, searchCities } = useStore() as any;
  const [showActivityForm, setShowActivityForm] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({ title: '', cost: '', type: 'Sightseeing', startTime: '10:00 AM' });
  
  // City search state
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);

  // View mode and filters
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const fetchCities = async () => {
      if (showCitySearch) {
        const res = await searchCities(searchCityQuery);
        setCityResults(res);
      }
    };
    fetchCities();
  }, [searchCityQuery, showCitySearch]);

  useEffect(() => {
    if (id) {
      fetchTripDetails(id);
    }
  }, [id]);

  const handleAddActivity = async (stopId: string) => {
    await addActivity(stopId, {
      title: activityForm.title,
      cost: parseFloat(activityForm.cost) || 0,
      activityType: activityForm.type,
      startTime: new Date(new Date().toDateString() + ' ' + activityForm.startTime).toISOString()
    });
    setShowActivityForm(null);
    setActivityForm({ title: '', cost: '', type: 'Sightseeing', startTime: '10:00 AM' });
  };

  if (!currentTrip) {
    return <div className="w-full max-w-5xl mx-auto p-4 text-center mt-20"><p className="text-xl font-bold">Loading trip...</p></div>;
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'Transit': return Plane;
      case 'Stay': return Bed;
      case 'Food': return Coffee;
      case 'Sightseeing': return Camera;
      default: return MapPin;
    }
  };

  const totalCost = currentTrip.stops?.reduce((acc: number, stop: any) => {
    return acc + stop.activities.reduce((sum: number, act: any) => sum + (act.cost || 0), 0);
  }, 0) || 0;

  const categoryCosts = currentTrip.stops?.reduce((acc: any, stop: any) => {
    stop.activities.forEach((act: any) => {
      acc[act.activityType] = (acc[act.activityType] || 0) + (act.cost || 0);
    });
    return acc;
  }, {}) || {};

  const pieData = Object.entries(categoryCosts).map(([name, value]) => ({ name, value }));
  const daysTotal = currentTrip.stops?.length ? Math.ceil((new Date(currentTrip.endDate).getTime() - new Date(currentTrip.startDate).getTime()) / (1000 * 3600 * 24)) : 1;
  const averageCostPerDay = daysTotal > 0 ? (totalCost / daysTotal) : totalCost;
  const BUDGET_LIMIT = 2000;
  const isOverbudget = totalCost > BUDGET_LIMIT;

  // Activity Search State
  const [activityFilterType, setActivityFilterType] = useState('All');
  const [activityFilterCost, setActivityFilterCost] = useState('All');
  const MOCK_ACTIVITIES = [
    { title: 'Eiffel Tower Tour', type: 'Sightseeing', cost: 35, img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600', desc: 'Skip the line guided tour' },
    { title: 'Sushi Tasting', type: 'Food', cost: 120, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600', desc: 'Premium Omakase experience' },
    { title: 'Subway Pass (3 Days)', type: 'Transit', cost: 25, img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600', desc: 'Unlimited rides across the city' },
    { title: 'Luxury Spa', type: 'Stay', cost: 200, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600', desc: '2 hour relaxing massage and sauna' },
    { title: 'Colosseum Entry', type: 'Sightseeing', cost: 20, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600', desc: 'Standard entry ticket' },
    { title: 'Local Street Food', type: 'Food', cost: 15, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600', desc: 'Explore the night market' },
  ];

  const filteredActivities = MOCK_ACTIVITIES.filter(act => {
    if (activityFilterType !== 'All' && act.type !== activityFilterType) return false;
    if (activityFilterCost === 'Low' && act.cost > 30) return false;
    if (activityFilterCost === 'Medium' && (act.cost <= 30 || act.cost > 100)) return false;
    if (activityFilterCost === 'High' && act.cost <= 100) return false;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-500 pb-32">
      <ActionBar />
      
      {/* Trip Header & Budget Dashboard */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12 mt-8">
        
        {/* Main Trip Info */}
        <div className="flex-1 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200 flex flex-col justify-between">
          <div className="flex items-start gap-6 mb-8">
            <SafeImage src={currentTrip.coverPhoto || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800'} className="w-32 h-32 rounded-2xl object-cover shadow-sm" alt={currentTrip.name} />
            <div>
              <h2 className="font-display font-black text-4xl text-slate mb-2 leading-tight">{currentTrip.name}</h2>
              <p className="text-stone-500 font-medium flex items-center gap-1.5"><MapPin size={16}/> {currentTrip.description || 'Custom Trip'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-full w-max border border-stone-200">
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate' : 'text-stone-500 hover:text-slate'}`}>
              <List size={18} /> List View
            </button>
            <button onClick={() => setViewMode('calendar')} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate' : 'text-stone-500 hover:text-slate'}`}>
              <CalendarIcon size={18} /> Timeline View
            </button>
          </div>
        </div>

        {/* Budget Breakdown Chart */}
        <div className="w-full lg:w-96 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200 relative overflow-hidden">
          {isOverbudget && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-1">
              <AlertTriangle size={12} /> OVERBUDGET
            </div>
          )}
          <h3 className="font-display font-black text-xl text-slate mb-6 mt-2">Budget Overview</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total Expense</p>
              <p className={`text-3xl font-black ${isOverbudget ? 'text-red-500' : 'text-genz-green'}`}>${totalCost.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Avg / Day</p>
              <p className="text-xl font-bold text-slate">${averageCostPerDay.toFixed(0)}</p>
            </div>
          </div>

          <div className="h-32 w-full mt-4 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-stone-400 font-medium text-sm">No expenses logged yet.</p>
            )}
          </div>
        </div>
        
      </div>
      
      <div className="flex justify-between px-16 md:px-32 mb-8 font-bold text-sm uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-4">
         <span>Physical Activity</span>
         <span>Expense</span>
      </div>
      
      {viewMode === 'list' ? (
        <div className="space-y-16 pb-24">
          {currentTrip.stops?.map((stop: any, groupIdx: number) => (
            <div key={stop.id} className="relative border-l-[3px] border-stone-200 ml-8 md:ml-16 pl-8 md:pl-16 space-y-8 pb-4">
              
              <div className="absolute -left-12 md:-left-[3.25rem] top-0 bg-white border-4 border-slate rounded-full px-5 py-2 shadow-sm flex flex-col items-center justify-center text-slate">
                <span className="font-black text-lg">Loc {groupIdx + 1}</span>
              </div>
              <div className="mb-8 pt-2 text-stone-500 font-bold">{stop.city?.name} ({new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()})</div>
              
              {stop.activities?.map((item: any, idx: number) => {
                const Icon = getIcon(item.activityType);
                return (
                  <div key={item.id} className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative w-full pr-4 md:pr-12 group">
                    {(idx !== stop.activities.length - 1 || showActivityForm === stop.id) && (
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
                          <span className="bg-sand text-slate px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">{item.activityType}</span>
                          <p className="text-stone-500 text-sm font-medium flex items-center gap-1.5">
                            <Clock size={14}/> {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expense Box */}
                    <div className="w-full md:w-48 border border-stone-200 rounded-3xl p-5 bg-white shadow-sm flex flex-col items-center justify-center group-hover:border-terracotta/50 transition-colors z-10 shrink-0">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Cost</span>
                      <span className="font-black text-2xl text-slate">${item.cost}</span>
                    </div>
                  </div>
                );
              })}

              {/* Activity Search Modal Trigger */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative w-full pr-4 md:pr-12 group mt-4">
                <button onClick={() => setShowActivityForm(stop.id)} className="w-full md:flex-1 border-2 border-dashed border-stone-300 rounded-3xl p-5 bg-transparent hover:bg-stone-50 hover:border-stone-400 transition-all flex items-center justify-center gap-3 z-10 text-stone-500 font-bold">
                  <Plus size={20} /> Add Activity
                </button>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-8 snap-x custom-scrollbar">
          {currentTrip.stops?.map((stop: any, groupIdx: number) => (
            <div key={stop.id} className="min-w-[320px] bg-stone-50 border border-stone-200 rounded-3xl p-6 mr-6 snap-center shrink-0">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-xl text-slate">{stop.city?.name}</h3>
                  <p className="text-stone-500 font-medium text-sm">{new Date(stop.startDate).toLocaleDateString()}</p>
                </div>
                <div className="w-10 h-10 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center font-black text-stone-400">
                  {groupIdx + 1}
                </div>
              </div>
              <div className="space-y-4">
                {stop.activities?.map((item: any) => {
                  const Icon = getIcon(item.activityType);
                  return (
                    <div key={item.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-slate shrink-0">
                         <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-terracotta">${item.cost}</span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs font-medium text-stone-500">{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => setShowActivityForm(stop.id)} className="w-full border-2 border-dashed border-stone-200 rounded-2xl p-4 text-stone-400 hover:text-stone-600 hover:border-stone-400 font-bold transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Button */}
      <div className="flex justify-center mt-12 mb-12">
        <button onClick={() => setShowCitySearch(true)} className="bg-slate text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
          <Plus size={20} /> Add Destination
        </button>
      </div>

      {/* Activity Search Modal (Feature #8) */}
      {showActivityForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="font-display font-black text-2xl text-slate">Activity Search</h3>
                <p className="text-stone-500 font-medium">Browse and select things to do</p>
              </div>
              <button onClick={() => setShowActivityForm(null)} className="w-10 h-10 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center hover:bg-stone-300 font-bold">X</button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto bg-stone-50 flex-1">
              {/* FILTERS */}
              <div className="flex gap-4 mb-6">
                <select value={activityFilterType} onChange={e => setActivityFilterType(e.target.value)} className="border border-stone-200 rounded-xl px-4 py-3 bg-white font-bold text-slate">
                  <option value="All">All Types</option>
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food">Food</option>
                  <option value="Transit">Transit</option>
                  <option value="Stay">Stay</option>
                </select>
                <select value={activityFilterCost} onChange={e => setActivityFilterCost(e.target.value)} className="border border-stone-200 rounded-xl px-4 py-3 bg-white font-bold text-slate">
                  <option value="All">Any Cost</option>
                  <option value="Low">Low (&lt;$30)</option>
                  <option value="Medium">Medium ($30-$100)</option>
                  <option value="High">High (&gt;$100)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((act, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                    <div className="h-40 overflow-hidden relative">
                      <SafeImage src={act.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={act.title} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{act.type}</div>
                    </div>
                    <div className="p-5 flex flex-col justify-between min-h-[160px]">
                      <div>
                        <h4 className="font-bold text-lg text-slate mb-1">{act.title}</h4>
                        <p className="text-xs text-stone-500 mb-2 leading-relaxed line-clamp-2">{act.desc}</p>
                        <p className="text-terracotta font-black text-xl mb-4">${act.cost}</p>
                      </div>
                      <button onClick={() => {
                        setActivityForm({ title: act.title, type: act.type, cost: act.cost.toString(), startTime: '10:00 AM' });
                        handleAddActivity(showActivityForm);
                      }} className="w-full bg-slate text-white py-2.5 rounded-xl font-bold hover:bg-slate/90 transition-colors">
                        Add to Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 border-t border-stone-200 pt-8">
                <h4 className="font-bold text-slate mb-4">Or add custom activity:</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input placeholder="Title" value={activityForm.title} onChange={e => setActivityForm({...activityForm, title: e.target.value})} className="col-span-1 md:col-span-2 border border-stone-200 rounded-xl px-4 py-3" />
                  <select value={activityForm.type} onChange={e => setActivityForm({...activityForm, type: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-3">
                    <option>Sightseeing</option><option>Food</option><option>Transit</option><option>Stay</option>
                  </select>
                  <input type="number" placeholder="Cost ($)" value={activityForm.cost} onChange={e => setActivityForm({...activityForm, cost: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-3" />
                </div>
                <button onClick={() => handleAddActivity(showActivityForm)} className="mt-4 bg-terracotta text-white px-8 py-3 rounded-xl font-bold hover:bg-terracotta/90 transition-colors">
                  Save Custom Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* City Search Modal (Feature #2) */}
      {showCitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="font-display font-black text-2xl text-slate">Add Destination</h3>
                <p className="text-stone-500 font-medium">Search for cities to add to your trip</p>
              </div>
              <button onClick={() => setShowCitySearch(false)} className="w-10 h-10 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center hover:bg-stone-300 font-bold">X</button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto bg-stone-50 flex-1">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Search cities (e.g. Paris, Tokyo)..."
                  value={searchCityQuery}
                  onChange={(e) => setSearchCityQuery(e.target.value)}
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityResults.map((city: any) => (
                  <div key={city.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-40 overflow-hidden relative">
                      <SafeImage src={city.imageUrl || 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={city.name} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{city.country}</div>
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur text-white px-2.5 py-1 rounded-md text-xs font-bold">Pop: {city.popularityScore}</div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-slate leading-tight">{city.name}</h4>
                        <span className="text-terracotta font-black text-sm">{city.costIndex}</span>
                      </div>
                      <button onClick={async () => {
                        const start = prompt('Start Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
                        const end = prompt('End Date (YYYY-MM-DD):', new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
                        if (start && end) {
                          await addTripStop(currentTrip.id, city.id, start, end, currentTrip.stops?.length || 0);
                          setShowCitySearch(false);
                          fetchTripDetails(currentTrip.id);
                        }
                      }} className="w-full bg-slate text-white py-2.5 rounded-xl font-bold hover:bg-slate/90 transition-colors">
                        Add to Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
