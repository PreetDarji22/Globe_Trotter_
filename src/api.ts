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

export const fetchDestinations = async (): Promise<Destination[]> => {
  // Simulating an external API network request
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { id: '1', title: 'Sushi Making Masterclass', location: 'Tokyo, Japan', region: 'Asia', category: 'Food', price: 85, rating: 4.9, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
    { id: '2', title: 'Mount Fuji Day Tour', location: 'Tokyo, Japan', region: 'Asia', category: 'Sightseeing', price: 150, rating: 4.8, img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80' },
    { id: '3', title: 'Colosseum Underground', location: 'Rome, Italy', region: 'Europe', category: 'Culture', price: 60, rating: 4.7, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { id: '4', title: 'Pasta Cooking Class', location: 'Rome, Italy', region: 'Europe', category: 'Food', price: 75, rating: 4.9, img: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=800&q=80' },
    { id: '5', title: 'Eiffel Tower Summit', location: 'Paris, France', region: 'Europe', category: 'Sightseeing', price: 45, rating: 4.6, img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80' },
    { id: '6', title: 'Louvre Art Tour', location: 'Paris, France', region: 'Europe', category: 'Culture', price: 55, rating: 4.8, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' },
    { id: '7', title: 'Scuba Diving', location: 'Bali, Indonesia', region: 'Asia', category: 'Adventure', price: 120, rating: 4.9, img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
    { id: '8', title: 'Ubud Yoga Retreat', location: 'Bali, Indonesia', region: 'Asia', category: 'Relaxation', price: 40, rating: 4.7, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
    { id: '9', title: 'Alps Skiing Day Pass', location: 'Zermatt, Switzerland', region: 'Europe', category: 'Adventure', price: 200, rating: 4.9, img: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=800&q=80' },
    { id: '10', title: 'Central Park Bike Tour', location: 'New York, USA', region: 'North America', category: 'Sightseeing', price: 35, rating: 4.5, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    { id: '11', title: 'Broadway Show Ticket', location: 'New York, USA', region: 'North America', category: 'Culture', price: 150, rating: 4.8, img: 'https://images.unsplash.com/photo-1583642358892-e421eb19987f?auto=format&fit=crop&w=800&q=80' },
    { id: '12', title: 'Banff Hiking Guide', location: 'Banff, Canada', region: 'North America', category: 'Adventure', price: 80, rating: 4.9, img: 'https://images.unsplash.com/photo-1517934421021-396489370643?auto=format&fit=crop&w=800&q=80' }
  ];
};
