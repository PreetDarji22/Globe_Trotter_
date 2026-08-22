import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.post('/trips/:tripId/stops', async (req: AuthRequest, res) => {
  try {
    const { cityId, startDate, endDate, orderIndex } = req.body;
    
    const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
    if (!trip || trip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId: req.params.tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderIndex
      },
      include: { city: true }
    });
    res.status(201).json(stop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add stop' });
  }
});

router.delete('/stops/:stopId', async (req: AuthRequest, res) => {
  try {
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: req.params.stopId },
      include: { trip: true }
    });
    if (!stop || stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.tripStop.delete({ where: { id: req.params.stopId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stop' });
  }
});

router.post('/stops/:stopId/activities', async (req: AuthRequest, res) => {
  try {
    const { name, category, startTime, durationMinutes, estimatedCost, description } = req.body;
    
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: req.params.stopId },
      include: { trip: true }
    });
    if (!stop || stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });

    const activity = await prisma.activity.create({
      data: {
        tripStopId: req.params.stopId,
        name,
        category,
        startTime: new Date(startTime),
        durationMinutes,
        estimatedCost,
        description
      }
    });
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

export default router;
