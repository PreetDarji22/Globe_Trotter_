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
  welcomeMessage: string | null;
  setWelcomeMessage: (msg: string | null) => void;
  trips: Trip[];
  searchQuery: string;
  sortBy: string;
  filterBy: string;
  groupBy: string;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
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
  likeTrip: (tripId: string) => Promise<boolean>;
  commentTrip: (tripId: string, text: string) => Promise<void>;
  updateProfilePicture: (url: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      welcomeMessage: null,
      setWelcomeMessage: (msg) => set({ welcomeMessage: msg }),
      trips: [],
      communityTrips: [],
      currentTrip: null,
      searchQuery: '',
      sortBy: 'Recommended',
      filterBy: 'All',
      groupBy: 'None',
      
      register: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
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
            return { success: true };
          } else {
            const data = await res.json().catch(() => ({}));
            return { success: false, error: data.error || 'Registration failed' };
          }
        } catch (e: any) {
          console.error("Register error", e);
          return { success: false, error: 'Network error during registration' };
        }
      },

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
            set({ welcomeMessage: `Welcome back, ${data.user.firstName || "Explorer"}! 🌍 Ready for your next journey?` });
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
        if (!token) return null;
        try {
          const res = await fetch('/api/trips', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token 
            },
            body: JSON.stringify({
              name: tripData.name || tripData.destination || 'New Trip',
              description: tripData.destination || tripData.name || 'Custom Trip',
              startDate: tripData.startDate ? new Date(tripData.startDate).toISOString() : new Date().toISOString(),
              endDate: tripData.endDate ? new Date(tripData.endDate).toISOString() : new Date(Date.now() + 86400000 * 3).toISOString(),
              coverPhoto: tripData.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80',
              isPublic: tripData.isPublic === true
            })
          });
          if (res.ok) {
            const data = await res.json();
            await get().fetchTrips();
            return data;
          }
        } catch (e) {
          console.error(e);
        }
        const fallback = {
          id: tripData.id || Date.now().toString(),
          ...tripData,
          destination: tripData.destination || tripData.name,
          budget: 0,
          expenses: 0,
          status: 'upcoming',
          image: tripData.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80'
        };
        set((state) => ({ trips: [...state.trips, fallback] }));
        return fallback;
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
      },

      likeTrip: async (tripId: string) => {
        const token = get().user?.token;
        if (!token) return false;
        const res = await fetch(`/api/community/${tripId}/like`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          get().fetchCommunityTrips();
          const data = await res.json();
          return data.liked;
        }
        return false;
      },

      commentTrip: async (tripId: string, text: string) => {
        const token = get().user?.token;
        if (!token) return;
        const res = await fetch(`/api/community/${tripId}/comment`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          get().fetchCommunityTrips();
        }
      },

      updateProfilePicture: async (url: string) => {
        const token = get().user?.token;
        if (!token) return;
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ profilePicture: url })
        });
        if (res.ok) {
          set(state => ({
            user: state.user ? { ...state.user, avatar: url } : null
          }));
        }
      }
    }),
    { name: 'global-trotter-storage-v2' }
  )
);
