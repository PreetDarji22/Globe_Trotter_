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

import { Navigate } from 'react-router-dom';
import { useStore } from './store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

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
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripListing /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/build-itinerary" element={<ProtectedRoute><BuildItinerary /></ProtectedRoute>} />
          <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
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
