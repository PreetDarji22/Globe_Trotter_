export interface Destination {
  id: string;
  title: string;
  location: string;
  region: string;
  category: string;
  price: number;
  rating: number;
  img: string;
}

export const fetchDestinations = async (query = '', category = ''): Promise<Destination[]> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/search/destinations${queryString}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch destinations: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};

