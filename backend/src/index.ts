import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import communityRoutes from './routes/community';
import itineraryRoutes from './routes/itinerary';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', itineraryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
