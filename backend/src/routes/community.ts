import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

const commentSchema = z.object({
  text: z.string().min(1, 'Comment text cannot be empty').max(1000, 'Comment too long')
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const publicTrips = await prisma.trip.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: { firstName: true, lastName: true, profilePicture: true }
        },
        stops: { include: { city: true, activities: true } },
        likes: { select: { userId: true } },
        comments: {
          include: {
            user: { select: { firstName: true, lastName: true, profilePicture: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return res.json(publicTrips);
  } catch (error) {
    console.error('COMMUNITY_GET_ERROR:', error);
    return res.status(500).json({ error: 'Failed to fetch community trips' });
  }
});

router.post('/:id/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: { userId_tripId: { userId: req.user!.id, tripId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId: req.user!.id, tripId } });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
});

router.post('/:id/comment', authenticateToken, validateBody(commentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const comment = await prisma.comment.create({
      data: { text: req.body.text, userId: req.user!.id, tripId },
      include: { user: { select: { firstName: true, lastName: true, profilePicture: true } } }
    });
    return res.status(201).json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    return res.status(500).json({ error: 'Failed to post comment' });
  }
});

router.delete('/comments/:commentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId as string;
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this comment' });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
});

router.post('/:id/fork', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const originalTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { stops: { include: { activities: true } } }
    }) as any;

    if (!originalTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!originalTrip.isPublic && originalTrip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot fork private trip' });
    }

    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user!.id,
        name: originalTrip.name + ' (Forked)',
        description: originalTrip.description,
        startDate: new Date(),
        endDate: new Date(Date.now() + (originalTrip.endDate.getTime() - originalTrip.startDate.getTime())),
        coverPhoto: originalTrip.coverPhoto,
        isPublic: false,
        stops: {
          create: (originalTrip.stops || []).map((stop: any) => ({
            cityId: stop.cityId,
            startDate: new Date(),
            endDate: new Date(Date.now() + (stop.endDate.getTime() - stop.startDate.getTime())),
            orderIndex: stop.orderIndex,
            activities: {
              create: (stop.activities || []).map((act: any) => ({
                name: act.name,
                category: act.category,
                startTime: new Date(),
                durationMinutes: act.durationMinutes || 60,
                estimatedCost: act.estimatedCost || 0,
                description: act.description || ''
              }))
            }
          }))
        }
      }
    });
    return res.json(newTrip);
  } catch (error) {
    console.error('COMMUNITY_FORK_ERROR:', error);
    return res.status(500).json({ error: 'Failed to fork trip', details: String(error) });
  }
});

export default router;


