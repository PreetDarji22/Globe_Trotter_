import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-vitest-32chars!';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NODE_ENV = 'test';

// Mock prisma client
vi.mock('../src/prisma', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
      }
    }
  };
});

import app from '../src/index';
import prisma from '../src/prisma';

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return 201 with JWT token', async () => {
      const newUser = {
        id: 'user-123',
        firstName: 'Alice',
        lastName: 'Walker',
        email: 'alice@example.com',
        passwordHash: 'hashed_pw',
        profilePicture: null,
        isAdmin: false,
        createdAt: new Date()
      };

      (prisma.user.findUnique as any).mockResolvedValue(null);
      (prisma.user.create as any).mockResolvedValue(newUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Alice',
          lastName: 'Walker',
          email: 'alice@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        id: 'user-123',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Walker',
        isAdmin: false
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should reject registration with 409 Conflict when email already exists', async () => {
      const existingUser = {
        id: 'existing-user-1',
        email: 'taken@example.com',
        firstName: 'Existing',
        lastName: 'User'
      };

      (prisma.user.findUnique as any).mockResolvedValue(existingUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Another',
          lastName: 'Person',
          email: 'taken@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'An account with this email already exists');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject registration with 400 Bad Request when validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: '',
          lastName: '',
          email: 'not-an-email',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials and return 200 with JWT token', async () => {
      const passwordHash = await bcrypt.hash('correctPassword123', 10);
      const user = {
        id: 'user-login-1',
        firstName: 'Mia',
        lastName: 'Chen',
        email: 'mia@example.com',
        passwordHash,
        profilePicture: 'https://example.com/avatar.jpg',
        isAdmin: false
      };

      (prisma.user.findUnique as any).mockResolvedValue(user);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mia@example.com',
          password: 'correctPassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('mia@example.com');
    });

    it('should reject login with 401 Unauthorized for incorrect password and NOT mutate account', async () => {
      const passwordHash = await bcrypt.hash('correctPassword123', 10);
      const user = {
        id: 'user-login-1',
        firstName: 'Mia',
        lastName: 'Chen',
        email: 'mia@example.com',
        passwordHash,
        isAdmin: false
      };

      (prisma.user.findUnique as any).mockResolvedValue(user);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mia@example.com',
          password: 'wrongPassword999'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid email or password');
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject login with 401 Unauthorized for non-existent email (generic error)', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ghost@example.com',
          password: 'somePassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid email or password');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
});
