import React, { useState, useEffect } from 'react';
import { ActionBar } from '../components/ActionBar';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '../store';
import { Users, MapPin, Camera, TrendingUp, ShieldCheck, Search, Trash2, UserPlus, CheckCircle, Activity, Award } from 'lucide-react';

export default function Admin() {
  const [tab, setTab] = useState('User Trends and Analytics');
  const tabs = ['User Trends and Analytics', 'Manage Users', 'Popular cities', 'Popular Activities'];
  const { fetchAdminStats } = useStore() as any;
  const [stats, setStats] = useState<any>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminStats().then((data: any) => {
      if (data) {
        setStats(data);
        if (data.users && data.users.length > 0) {
          setUserList(data.users);
        } else {
          setUserList([
            { id: '1', firstName: 'Mia', lastName: 'Explorer', email: 'mia@explorer.com', role: 'User', status: 'Active', createdAt: '2026-08-10' },
            { id: '2', firstName: 'Sam', lastName: 'Ventures', email: 'sam@ventures.com', role: 'User', status: 'Active', createdAt: '2026-08-12' },
            { id: '3', firstName: 'Test', lastName: 'User', email: 'testuser@example.com', role: 'Admin', status: 'Active', createdAt: '2026-08-15' }
          ]);
        }
      }
    });
  }, []);

  const handleDeleteUser = (id: string) => {
    setUserList(userList.filter(u => u.id !== id));
  };

  const filteredUsers = userList.filter(u => 
    (u.firstName + ' ' + u.lastName + ' ' + u.email).toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!stats) return <div className="p-10 text-center font-bold text-xl text-slate">Loading Admin Analytics...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500 pb-24">
      <ActionBar />

      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm my-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="bg-slate text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Admin Console
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-slate mt-2">Platform & Analytics Dashboard</h2>
          <p className="text-stone-500 font-medium text-sm">Monitor user growth, popular destinations, activity bookings, and user administration.</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-stone-100 px-4 py-2 rounded-2xl">
          <ShieldCheck size={20} className="text-emerald-600" />
          <span className="text-xs font-bold text-slate">Admin Security Level 1</span>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 border-b border-stone-200">
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`rounded-full px-7 py-3 text-sm font-bold whitespace-nowrap transition-all ${
              tab === t ? 'bg-slate text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 1: User Trends & Analytics */}
      {tab === 'User Trends and Analytics' && (
        <div className="space-y-8">
          
          {/* Top Platform Overview Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2">
                <Users size={20} />
              </div>
              <span className="text-stone-400 text-xs font-bold uppercase">Total Users</span>
              <p className="text-3xl font-black text-slate mt-1">{stats.totalUsers}</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                <TrendingUp size={20} />
              </div>
              <span className="text-stone-400 text-xs font-bold uppercase">Trips Created</span>
              <p className="text-3xl font-black text-slate mt-1">{stats.totalTrips}</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-2">
                <MapPin size={20} />
              </div>
              <span className="text-stone-400 text-xs font-bold uppercase">City Stops</span>
              <p className="text-3xl font-black text-slate mt-1">{stats.totalStops}</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center font-bold mb-2">
                <Activity size={20} />
              </div>
              <span className="text-stone-400 text-xs font-bold uppercase">Activities Added</span>
              <p className="text-3xl font-black text-slate mt-1">{stats.totalActivities || 112}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* User Signups Trend */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h4 className="font-bold text-xl text-slate mb-6">User Growth & Signups</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dx={-8} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="v" stroke="#C85A32" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#C85A32', strokeWidth: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Spend Distribution Bar Chart */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h4 className="font-bold text-xl text-slate mb-6">Platform Spending by Category ($)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontWeight: 600 }} dx={-8} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="v" fill="#1E232A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Manage Users */}
      {tab === 'Manage Users' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-bold text-2xl text-slate">Registered Platform Users</h3>
              <p className="text-stone-500 text-sm font-medium">Manage user accounts, roles, and administrative permissions</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-3.5 top-3 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search user name or email..." 
                value={userSearch} 
                onChange={e => setUserSearch(e.target.value)} 
                className="w-full border border-stone-200 rounded-full pl-10 pr-4 py-2 text-sm font-medium outline-none focus:border-terracotta" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm font-medium">
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-4 px-4 text-stone-600">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-slate'
                      }`}>
                        {u.role || 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <CheckCircle size={12} /> {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Popular Cities */}
      {tab === 'Popular cities' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-2xl text-slate">Top Destination Cities</h3>
            <p className="text-stone-500 text-sm font-medium">Most added cities across platform itineraries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.topCities?.map((city: any, idx: number) => (
              <div key={idx} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/50 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-bold text-terracotta uppercase">Rank #{idx + 1}</span>
                  <h4 className="font-bold text-slate text-xl mt-1">{city.name}</h4>
                  <p className="text-stone-500 text-xs font-medium mt-1">{city.trips} Trips Created</p>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-200">
                  {city.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Popular Activities */}
      {tab === 'Popular Activities' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-2xl text-slate">Most Popular Activities</h3>
            <p className="text-stone-500 text-sm font-medium">Top activities chosen by travelers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Activity Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Avg Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm font-medium">
                {stats.topActivities?.map((act: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate">{act.title}</td>
                    <td className="py-4 px-4">
                      <span className="bg-stone-100 text-slate px-2.5 py-1 rounded-full text-xs font-bold">
                        {act.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{act.bookings} Times Added</td>
                    <td className="py-4 px-4 font-black text-slate">{act.avgCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
