import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import communityRoutes from './routes/community';
import itineraryRoutes from './routes/itinerary';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Request Body Limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Rate limiter for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', itineraryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API is running securely!' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

