const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS - Allow Vercel frontend
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const plotRoutes = require('./routes/plot');

app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!' });
});

// Home Route
app.get('/', (req, res) => {
  res.send('<h1>Real Estate Backend API</h1><p>Endpoints:</p><ul><li>POST /api/auth/register</li><li>POST /api/auth/login</li><li>GET /api/plots</li></ul>');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database connected & synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit: https://real-estate-api-xpqq.onrender.com`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
