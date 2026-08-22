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
  user: { name: string; email: string; avatar: string } | null;
  trips: Trip[];
  searchQuery: string;
  sortBy: string;
  filterBy: string;
  groupBy: string;
  login: (name: string, email: string) => void;
  logout: () => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: string) => void;
  setFilterBy: (f: string) => void;
  setGroupBy: (g: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: { name: 'Alex Explorer', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
      trips: [
        { id: '1', name: 'Tokyo Drift', destination: 'Tokyo, Japan', startDate: '2024-10-01', endDate: '2024-10-14', budget: 3000, expenses: 1200, status: 'ongoing', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
        { id: '2', name: 'Swiss Alps Retreat', destination: 'Zermatt, Switzerland', startDate: '2024-12-05', endDate: '2024-12-15', budget: 4500, expenses: 0, status: 'upcoming', image: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=800&q=80' },
        { id: '3', name: 'Paris Getaway', destination: 'Paris, France', startDate: '2023-06-10', endDate: '2023-06-20', budget: 2000, expenses: 2100, status: 'completed', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' }
      ],
      searchQuery: '',
      sortBy: 'Recommended',
      filterBy: 'All',
      groupBy: 'None',
      login: (name, email) => set({ user: { name, email, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' } }),
      logout: () => set({ user: null }),
      addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
      updateTrip: (id, updates) => set((state) => ({
        trips: state.trips.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      setFilterBy: (filterBy) => set({ filterBy }),
      setGroupBy: (groupBy) => set({ groupBy }),
    }),
    { name: 'global-trotter-storage' }
  )
);
