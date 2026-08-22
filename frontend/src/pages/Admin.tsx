import React, { useState, useEffect } from 'react';
import { ActionBar } from '../components/ActionBar';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '../store';

export default function Admin() {
  const [tab, setTab] = useState('User Trends and Analytics');
  const tabs = ['Manage Users', 'Popular cities', 'Popular Activities', 'User Trends and Analytics'];
  const { fetchAdminStats } = useStore() as any;
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAdminStats().then((data: any) => {
      if (data) setStats(data);
    });
  }, []);

  if (!stats) return <div className="p-10 text-center font-bold">Loading stats...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 pt-4 border-b border-stone-200">
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`rounded-full px-8 py-3 text-sm font-bold whitespace-nowrap transition-all ${tab === t ? 'bg-slate text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[600px]">
        
        {/* Top Left: List View */}
        <div className="flex flex-col gap-6 justify-center">
           <h4 className="font-bold text-slate mb-2">Platform Totals</h4>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center font-bold text-stone-500 text-xl">{stats.totalUsers}</div>
             <div className="font-bold text-slate text-xl">Total Users</div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center font-bold text-stone-500 text-xl">{stats.totalTrips}</div>
             <div className="font-bold text-slate text-xl">Total Trips</div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center font-bold text-stone-500 text-xl">{stats.totalStops}</div>
             <div className="font-bold text-slate text-xl">Total City Stops</div>
           </div>
        </div>
        
        {/* Top Right: Pie Chart */}
        <div className="flex flex-col items-center justify-center h-72">
          <h4 className="font-bold text-slate w-full text-center mb-4">Device Usage</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{value: 70, name: 'Mobile'}, {value: 30, name: 'Desktop'}]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={100} stroke="none">
                 <Cell fill="#3A8B6F" />
                 <Cell fill="#FA7246" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Middle span: Line Chart */}
        <div className="h-80 col-span-1 md:col-span-2 mt-4 bg-stone-50 p-6 rounded-3xl border border-stone-200">
          <h4 className="font-bold text-slate mb-6">User Signups & Engagement</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trendData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontWeight: 600}} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontWeight: 600}} dx={-10} />
               <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
               <Line type="monotone" dataKey="v" stroke="#C85A32" strokeWidth={4} dot={{r: 6, fill: '#fff', stroke: '#C85A32', strokeWidth: 3}} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bottom Left: Bar Chart */}
        <div className="h-64 mt-4">
          <h4 className="font-bold text-slate mb-6">Revenue by Category</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueData}>
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontWeight: 600}} dy={10} />
               <Bar dataKey="v" fill="#1E232A" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bottom Right: List View */}
        <div className="flex flex-col gap-5 justify-center mt-4 border-l border-stone-200 pl-8">
           <h4 className="font-bold text-slate mb-2">Recent Server Logs</h4>
           {['[INFO] Database backup completed', '[WARN] High latency detected', '[INFO] User #10294 upgraded to PRO', '[ERROR] Failed webhook event #992'].map((log, i) => (
             <div key={i} className="text-sm font-mono text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200">{log}</div>
           ))}
        </div>
      </div>
    </div>
  );
}
