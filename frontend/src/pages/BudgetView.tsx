import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ActionBar } from '../components/ActionBar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, AlertTriangle, TrendingUp, Calendar, MapPin, Tag, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function BudgetView() {
  const { trips, currentTrip, fetchTrips, fetchTripDetails } = useStore() as any;
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [dailyBudgetLimit, setDailyBudgetLimit] = useState<number>(150);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
      fetchTripDetails(trips[0].id);
    }
  }, [trips]);

  const handleTripChange = (id: string) => {
    setSelectedTripId(id);
    fetchTripDetails(id);
  };

  const trip = currentTrip && currentTrip.id === selectedTripId ? currentTrip : trips.find((t: any) => t.id === selectedTripId);

  // Compute expense categories and costs
  let transportCost = 0;
  let stayCost = 0;
  let activitiesCost = 0;
  let mealsCost = 0;

  const dailyCosts: { [day: string]: number } = {};
  const allActivities: any[] = [];

  if (trip && trip.stops) {
    trip.stops.forEach((stop: any) => {
      stop.activities?.forEach((act: any) => {
        const cost = Number(act.cost || act.estimatedCost || 0);
        const type = (act.activityType || act.category || 'Sightseeing').toLowerCase();
        
        allActivities.push({
          ...act,
          cityName: stop.city?.name || 'Stop',
          cost,
          type
        });

        if (type.includes('transit') || type.includes('transport')) transportCost += cost;
        else if (type.includes('stay') || type.includes('hotel')) stayCost += cost;
        else if (type.includes('food') || type.includes('meal')) mealsCost += cost;
        else activitiesCost += cost;

        const dateStr = act.startTime ? new Date(act.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Day 1';
        dailyCosts[dateStr] = (dailyCosts[dateStr] || 0) + cost;
      });
    });
  }

  const totalSpent = transportCost + stayCost + activitiesCost + mealsCost;
  const daysCount = Math.max(Object.keys(dailyCosts).length, 1);
  const avgCostPerDay = totalSpent / daysCount;
  const targetTotalBudget = (trip?.budget || dailyBudgetLimit * daysCount) || 1000;
  const remainingBudget = targetTotalBudget - totalSpent;

  // Category Pie Data
  const categoryData = [
    { name: 'Transport', value: transportCost, color: '#3B82F6' },
    { name: 'Stay / Accommodation', value: stayCost, color: '#8B5CF6' },
    { name: 'Activities & Tours', value: activitiesCost, color: '#EC4899' },
    { name: 'Meals & Food', value: mealsCost, color: '#F59E0B' },
  ].filter(d => d.value > 0);

  // Fallback pie data if zero
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'Transport', value: 120, color: '#3B82F6' },
    { name: 'Stay', value: 350, color: '#8B5CF6' },
    { name: 'Activities', value: 180, color: '#EC4899' },
    { name: 'Meals', value: 150, color: '#F59E0B' },
  ];

  // Daily Chart Data
  const dailyChartData = Object.keys(dailyCosts).length > 0
    ? Object.entries(dailyCosts).map(([day, cost]) => ({ day, cost, isOver: cost > dailyBudgetLimit }))
    : [
        { day: 'Day 1', cost: 120, isOver: false },
        { day: 'Day 2', cost: 190, isOver: true },
        { day: 'Day 3', cost: 95, isOver: false },
        { day: 'Day 4', cost: 210, isOver: true },
      ];

  const overbudgetDays = dailyChartData.filter(d => d.isOver);

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />

      {/* Header & Trip Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-6 bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <span className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Financial Dashboard
          </span>
          <h2 className="text-3xl font-display font-black text-slate mt-2">Trip Budget & Cost Breakdown</h2>
          <p className="text-stone-500 font-medium text-sm">Monitor daily expenses, analyze category trends, and prevent overspending.</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <label className="text-sm font-bold text-slate">Select Trip:</label>
          <select 
            value={selectedTripId} 
            onChange={(e) => handleTripChange(e.target.value)}
            className="border-2 border-slate rounded-xl px-4 py-2.5 font-bold text-slate bg-white outline-none focus:border-terracotta"
          >
            {trips.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name} ({t.destination})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overbudget Alert Warning (If Any) */}
      {overbudgetDays.length > 0 && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-4 text-amber-900 shadow-sm animate-pulse">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="font-bold text-base">Overbudget Alert Detected!</h4>
            <p className="text-sm font-medium mt-1">
              Your spending on <strong>{overbudgetDays.map(d => d.day).join(', ')}</strong> exceeded your target daily limit of <strong>${dailyBudgetLimit}</strong>. Consider reallocating budget from lower activity days.
            </p>
          </div>
        </div>
      )}

      {/* Summary Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
            <DollarSign size={20} />
          </div>
          <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Total Estimated Spent</span>
          <p className="text-3xl font-black text-slate mt-1">${totalSpent.toFixed(2)}</p>
          <span className="text-xs text-stone-500 font-medium">Target: ${targetTotalBudget}</span>
        </div>

        <div className={`bg-white border border-stone-200 rounded-3xl p-6 shadow-sm ${remainingBudget < 0 ? 'border-red-300 bg-red-50/20' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
            <TrendingUp size={20} />
          </div>
          <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Remaining Budget</span>
          <p className={`text-3xl font-black mt-1 ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ${remainingBudget.toFixed(2)}
          </p>
          <span className="text-xs text-stone-500 font-medium">{remainingBudget < 0 ? 'Exceeded Budget' : 'Safe Margin'}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
            <Calendar size={20} />
          </div>
          <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Average Cost / Day</span>
          <p className="text-3xl font-black text-purple-700 mt-1">${avgCostPerDay.toFixed(2)}</p>
          <span className="text-xs text-stone-500 font-medium">Across {daysCount} Days</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center font-bold mb-3">
            <Tag size={20} />
          </div>
          <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Daily Target Limit</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-slate">$</span>
            <input 
              type="number" 
              value={dailyBudgetLimit} 
              onChange={e => setDailyBudgetLimit(Number(e.target.value))}
              className="w-24 border-2 border-stone-200 rounded-xl px-3 py-1 font-bold text-xl text-slate outline-none focus:border-terracotta" 
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">Customizable limit</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Category Expense Breakdown (Pie Chart) */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate flex items-center gap-2">
              <PieIcon size={20} className="text-terracotta" /> Category Allocation
            </h3>
            <span className="text-xs font-bold text-stone-400 uppercase">Transport / Stay / Activities / Food</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={displayCategoryData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={105} 
                  paddingAngle={4}
                >
                  {displayCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value}`, 'Cost']} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 mt-2">
            {displayCategoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span className="text-xs font-bold text-slate">{cat.name}:</span>
                <span className="text-xs font-black text-stone-600">${cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Trend (Bar Chart with Overbudget Highlights) */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-600" /> Daily Spending Timeline
            </h3>
            <span className="text-xs font-bold text-stone-400 uppercase">Red = Exceeds Daily Limit</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dx={-8} />
                <Tooltip formatter={(value: any) => [`$${value}`, 'Daily Cost']} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                  {dailyChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.isOver ? '#EF4444' : '#1E232A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center border-t border-stone-100 pt-4 mt-2 text-xs font-medium text-stone-500">
            <span>Target Daily Limit: <strong className="text-slate">${dailyBudgetLimit}</strong></span>
            <span>Overbudget Days Count: <strong className="text-red-600 font-bold">{overbudgetDays.length}</strong></span>
          </div>
        </div>

      </div>

      {/* Detailed Expense Log Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-bold text-2xl text-slate mb-6">Detailed Itemized Expenses</h3>
        {allActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Activity / Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm font-medium">
                {allActivities.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate">{item.name || item.title}</td>
                    <td className="py-4 px-4">
                      <span className="bg-stone-100 text-slate px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone-500">{item.cityName}</td>
                    <td className="py-4 px-4 font-black text-slate">${item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-stone-500 font-medium text-center py-8">No specific activities or expenses added to this trip yet.</p>
        )}
      </div>

    </div>
  );
}
