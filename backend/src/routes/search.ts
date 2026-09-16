import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/cities', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const query = typeof q === 'string' ? q : '';
    
    const cities = await prisma.city.findMany({
      where: query ? {
        name: { contains: query, mode: 'insensitive' }
      } : undefined,
      take: 20
    });
    return res.json(cities);
  } catch (error) {
    console.error('Search cities error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/destinations', async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;
    const query = typeof q === 'string' ? q.toLowerCase() : '';
    const catQuery = typeof category === 'string' && category !== 'All' ? category : undefined;

    // Fetch activities linked with cities
    const activities = await prisma.activity.findMany({
      include: {
        tripStop: {
          include: {
            city: true
          }
        }
      },
      take: 50
    });

    let destinations = activities.map(act => {
      const city = act.tripStop?.city;
      const location = city ? `${city.name}, ${city.country}` : 'Global';
      const region = city ? (['Japan', 'Indonesia', 'Thailand'].includes(city.country) ? 'Asia' : ['France', 'Italy', 'UK', 'Spain', 'Switzerland'].includes(city.country) ? 'Europe' : 'North America') : 'Global';
      const rating = city ? Number((3.5 + (city.popularityScore / 100) * 1.4).toFixed(1)) : 4.8;
      const img = city?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

      return {
        id: act.id,
        title: act.name,
        location,
        region,
        category: act.category,
        price: Number(act.estimatedCost) || 50,
        rating,
        img
      };
    });

    // If no activities are found yet in user trips, return destination ideas based on seeded cities
    if (destinations.length === 0) {
      const cities = await prisma.city.findMany({ take: 20 });
      destinations = cities.map((city, index) => {
        const region = ['Japan', 'Indonesia', 'Thailand'].includes(city.country)
          ? 'Asia'
          : ['France', 'Italy', 'UK', 'Spain', 'Switzerland'].includes(city.country)
          ? 'Europe'
          : 'North America';
        const rating = Number((3.5 + (city.popularityScore / 100) * 1.4).toFixed(1));
        return {
          id: city.id || String(index + 1),
          title: `Explore ${city.name} Highlights`,
          location: `${city.name}, ${city.country}`,
          region,
          category: index % 3 === 0 ? 'Sightseeing' : index % 3 === 1 ? 'Food' : 'Culture',
          price: city.costIndex === '$$$$' ? 120 : city.costIndex === '$$$' ? 85 : 50,
          rating,
          img: city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
        };
      });
    }

    if (query) {
      destinations = destinations.filter(d => 
        d.title.toLowerCase().includes(query) || d.location.toLowerCase().includes(query)
      );
    }

    if (catQuery) {
      destinations = destinations.filter(d => d.category.toLowerCase() === catQuery.toLowerCase());
    }

    return res.json(destinations);
  } catch (error) {
    console.error('Search destinations error:', error);
    return res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

export default router;

