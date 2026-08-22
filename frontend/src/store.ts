import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  expenses: number;
  status: 'ongoing' | 'upcoming' | 'completed';
  image: string;
  sections?: any[];
};

interface AppState {
  user: { name: string; email: string; avatar: string; token: string } | null;
  trips: Trip[];
  searchQuery: string;
  sortBy: string;
  filterBy: string;
  groupBy: string;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  fetchTrips: () => Promise<void>;
  addTrip: (trip: any) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: string) => void;
  setFilterBy: (f: string) => void;
  setGroupBy: (g: string) => void;
  searchCities: (query: string) => Promise<any[]>;
  fetchCommunityTrips: () => Promise<void>;
  addTripStop: (tripId: string, cityId: string, startDate: string, endDate: string, orderIndex: number) => Promise<void>;
  currentTrip: any;
  fetchTripDetails: (tripId: string) => Promise<void>;
  addActivity: (stopId: string, activityData: any) => Promise<void>;
  forkTrip: (tripId: string) => Promise<string | null>;
  fetchAdminStats: () => Promise<any>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      trips: [],
      communityTrips: [],
      currentTrip: null,
      searchQuery: '',
      sortBy: 'Recommended',
      filterBy: 'All',
      groupBy: 'None',
      
      login: async (email, password = 'securepassword123') => {
        // For the hackathon, we auto-register if the user doesn't exist, or login if they do
        try {
          let res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          if (!res.ok) {
            // If login fails, try to register them (Hackathon fast-path)
            res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firstName: email.split('@')[0], lastName: 'User', email, password })
            });
          }
          
          if (res.ok) {
            const data = await res.json();
            set({ 
              user: { 
                name: `${data.user.firstName} ${data.user.lastName}`, 
                email: data.user.email, 
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                token: data.token 
              } 
            });
            get().fetchTrips();
            return true;
          }
          return false;
        } catch (e) {
          console.error("Auth error", e);
          return false;
        }
      },
      
      logout: () => set({ user: null, trips: [] }),
      
      fetchTrips: async () => {
        const token = get().user?.token;
        if (!token) return;
        const res = await fetch('/api/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform DB data to frontend format if needed
          set({ trips: data.map((t: any) => ({
            ...t,
            destination: t.name,
            status: 'upcoming',
            budget: 0,
            expenses: 0,
            image: t.coverPhoto || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
          }))});
        }
      },

      addTrip: async (tripData) => {
        const token = get().user?.token;
        if (!token) return;
        
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            name: tripData.destination || tripData.name,
            startDate: new Date(tripData.startDate).toISOString(),
            endDate: new Date(tripData.endDate).toISOString(),
            coverPhoto: tripData.image,
            isPublic: tripData.isPublic
          })
        });
        
        if (res.ok) {
          get().fetchTrips();
        } else {
           // Fallback for local UI only if API fails
           set((state) => ({ trips: [...state.trips, tripData] }));
        }
      },

      updateTrip: (id, updates) => set((state) => ({
        trips: state.trips.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      setFilterBy: (filterBy) => set({ filterBy }),
      setGroupBy: (groupBy) => set({ groupBy }),

      searchCities: async (query: string) => {
        const res = await fetch(`/api/search/cities?q=${encodeURIComponent(query)}`);
        if (res.ok) return await res.json();
        return [];
      },

      fetchCommunityTrips: async () => {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          // @ts-ignore
          set({ communityTrips: data });
        }
      },

      addTripStop: async (tripId, cityId, startDate, endDate, orderIndex) => {
        const token = get().user?.token;
        if (!token) return;
        await fetch(`/api/trips/${tripId}/stops`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ cityId, startDate, endDate, orderIndex })
        });
        get().fetchTrips();
      },

      fetchTripDetails: async (tripId: string) => {
        const token = get().user?.token;
        if (!token) return;
        const res = await fetch(`/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // @ts-ignore
          set({ currentTrip: data });
        }
      },

      addActivity: async (stopId: string, activityData: any) => {
        const token = get().user?.token;
        if (!token) return;
        await fetch(`/api/stops/${stopId}/activities`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(activityData)
        });
        const currentTrip = get().currentTrip;
        if (currentTrip) {
          get().fetchTripDetails(currentTrip.id);
        }
      },

      forkTrip: async (tripId: string) => {
        const token = get().user?.token;
        if (!token) return null;
        const res = await fetch(`/api/community/${tripId}/fork`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          get().fetchTrips();
          return data.id;
        }
        return null;
      },

      fetchAdminStats: async () => {
        const token = get().user?.token;
        if (!token) return null;
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          return await res.json();
        }
        return null;
      }
    }),
    { name: 'global-trotter-storage-v2' }
  )
);
