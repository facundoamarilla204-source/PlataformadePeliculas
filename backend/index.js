require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const movieRoutes = require('./src/routes/movieRoutes');
const tmdbRoutes = require('./src/routes/tmdbRoutes');
const bannerRoutes = require('./src/routes/bannerRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const streamingRoutes = require('./src/routes/streamingRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/streaming', streamingRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Movie Streaming API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
