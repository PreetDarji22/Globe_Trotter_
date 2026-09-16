import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-key-for-vitest-32chars!';
process.env.JWT_SECRET = JWT_SECRET;
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NODE_ENV = 'test';

vi.mock('../src/prisma', () => {
  return {
    default: {
      trip: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      },
      activity: {
        deleteMany: vi.fn()
      },
      tripStop: {
        deleteMany: vi.fn()
      },
      like: {
        deleteMany: vi.fn()
      },
      comment: {
        deleteMany: vi.fn()
      }
    }
  };
});

import app from '../src/index';
import prisma from '../src/prisma';

describe('Trips API Ownership & Authorization Tests', () => {
  const ownerToken = jwt.sign({ id: 'user-owner', email: 'owner@example.com' }, JWT_SECRET);
  const otherUserToken = jwt.sign({ id: 'user-attacker', email: 'attacker@example.com' }, JWT_SECRET);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/trips/:id', () => {
    it('should allow owner to access private trip', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        name: 'Private Trip',
        isPublic: false,
        stops: []
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);

      const res = await request(app)
        .get('/api/trips/trip-1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('trip-1');
    });

    it('should return 404/Forbidden if other user tries to access private trip', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        name: 'Private Trip',
        isPublic: false,
        stops: []
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);

      const res = await request(app)
        .get('/api/trips/trip-1')
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Trip not found');
    });

    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/trips/trip-1');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/trips/:id', () => {
    it('should reject update with 403 Forbidden if user is not the trip owner', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        name: 'Original Trip'
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);

      const res = await request(app)
        .put('/api/trips/trip-1')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ name: 'Hacked Trip Name' });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Forbidden: You do not own this trip');
      expect(prisma.trip.update).not.toHaveBeenCalled();
    });

    it('should allow owner to update trip', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        name: 'Original Trip'
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);
      (prisma.trip.update as any).mockResolvedValue({ ...trip, name: 'Updated Trip' });

      const res = await request(app)
        .put('/api/trips/trip-1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Updated Trip' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Trip');
      expect(prisma.trip.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /api/trips/:id', () => {
    it('should reject deletion with 403 Forbidden if user is not the trip owner', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        stops: []
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);

      const res = await request(app)
        .delete('/api/trips/trip-1')
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Forbidden: You do not own this trip');
      expect(prisma.trip.delete).not.toHaveBeenCalled();
    });

    it('should allow owner to delete trip and its associations', async () => {
      const trip = {
        id: 'trip-1',
        userId: 'user-owner',
        stops: [{ id: 'stop-1' }]
      };

      (prisma.trip.findUnique as any).mockResolvedValue(trip);
      (prisma.trip.delete as any).mockResolvedValue(trip);

      const res = await request(app)
        .delete('/api/trips/trip-1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(prisma.trip.delete).toHaveBeenCalledWith({ where: { id: 'trip-1' } });
    });
  });
});
