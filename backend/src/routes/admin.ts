import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalTrips, totalStops, totalActivities] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.tripStop.count(),
      prisma.activity.count()
    ]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
        createdAt: true
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.isAdmin ? 'Admin' : 'User',
      status: 'Active',
      createdAt: u.createdAt.toISOString().split('T')[0]
    }));

    // Aggregate top destination cities
    const topCityStops = await prisma.tripStop.groupBy({
      by: ['cityId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6
    });

    const cityIds = topCityStops.map(s => s.cityId);
    const citiesInfo = await prisma.city.findMany({
      where: { id: { in: cityIds } }
    });
    const cityMap = new Map(citiesInfo.map(c => [c.id, c]));

    const topCities = topCityStops.map(item => {
      const city = cityMap.get(item.cityId);
      const ratingVal = city ? ((city.popularityScore / 20).toFixed(1) + ' ★') : '4.8 ★';
      return {
        name: city ? `${city.name}, ${city.country}` : 'Unknown City',
        trips: item._count.id,
        rating: ratingVal
      };
    });

    // Aggregate top activities by category/name
    const popularActivitiesGroup = await prisma.activity.groupBy({
      by: ['name', 'category'],
      _count: { id: true },
      _avg: { estimatedCost: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6
    });

    const topActivities = popularActivitiesGroup.map(act => ({
      title: act.name,
      category: act.category,
      bookings: act._count.id,
      avgCost: `$${Number(act._avg.estimatedCost || 0).toFixed(0)}`
    }));

    // Aggregate user signup trend over past 6 months
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendMap[monthNames[d.getMonth()]] = 0;
    }

    const allUsersCreated = await prisma.user.findMany({
      select: { createdAt: true }
    });

    for (const u of allUsersCreated) {
      const m = monthNames[u.createdAt.getMonth()];
      if (trendMap[m] !== undefined) {
        trendMap[m] += 1;
      }
    }

    const trendData = Object.entries(trendMap).map(([name, v]) => ({ name, v }));

    // Aggregate spending by category
    const spendByCategory = await prisma.activity.groupBy({
      by: ['category'],
      _sum: { estimatedCost: true }
    });

    const revenueData = spendByCategory.length > 0
      ? spendByCategory.map(s => ({
          name: s.category,
          v: Number(s._sum.estimatedCost || 0)
        }))
      : [
          { name: 'Transit', v: 0 },
          { name: 'Food & Dining', v: 0 },
          { name: 'Sightseeing', v: 0 },
          { name: 'Stays', v: 0 }
        ];

    res.json({
      totalUsers,
      totalTrips,
      totalStops,
      totalActivities,
      users: formattedUsers,
      topCities,
      topActivities,
      trendData,
      revenueData
    });
  } catch (error) {
    console.error('Admin stats query error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

export default router;

