import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import TripListing from './pages/TripListing';
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Search from './pages/Search';
import CalendarView from './pages/CalendarView';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-slate selection:bg-terracotta selection:text-white">
      {!isAuthPage && <Navigation />}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-6 pb-20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<TripListing />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/build-itinerary" element={<BuildItinerary />} />
          <Route path="/itinerary/:id" element={<ItineraryView />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
