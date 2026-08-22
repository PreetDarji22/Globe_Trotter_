import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const publicTrips = await prisma.trip.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: { firstName: true, lastName: true, profilePicture: true }
        },
        stops: {
          include: { city: true }
        },
        likes: {
          select: { userId: true }
        },
        comments: {
          include: {
            user: {
              select: { firstName: true, lastName: true, profilePicture: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(publicTrips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch community trips' });
  }
});

router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tripId: {
          userId: req.user!.id,
          tripId: req.params.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId: req.user!.id, tripId: req.params.id }
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

router.post('/:id/comment', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        text: req.body.text,
        userId: req.user!.id,
        tripId: req.params.id
      },
      include: {
        user: { select: { firstName: true, lastName: true, profilePicture: true } }
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

router.post('/:id/fork', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const originalTrip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { stops: { include: { activities: true } } }
    });

    if (!originalTrip || !originalTrip.isPublic) {
      return res.status(404).json({ error: 'Public trip not found' });
    }

    // Clone the trip
    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user!.id,
        name: `${originalTrip.name} (Forked)`,
        description: originalTrip.description,
        startDate: new Date(),
        endDate: new Date(Date.now() + (originalTrip.endDate.getTime() - originalTrip.startDate.getTime())),
        coverPhoto: originalTrip.coverPhoto,
        isPublic: false,
        stops: {
          create: originalTrip.stops.map(stop => ({
            cityId: stop.cityId,
            startDate: new Date(),
            endDate: new Date(Date.now() + (stop.endDate.getTime() - stop.startDate.getTime())),
            orderIndex: stop.orderIndex,
            activities: {
              create: stop.activities.map(act => ({
                name: act.name,
                category: act.category,
                startTime: new Date(),
                durationMinutes: act.durationMinutes,
                estimatedCost: act.estimatedCost,
                description: act.description
              }))
            }
          }))
        }
      }
    });
    
    res.json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fork trip' });
  }
});

export default router;
