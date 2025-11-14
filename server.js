const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS - Allow Vercel frontend
app.use(cors({
  origin: 'https://real-estate-client-gules.vercel.app',
  credentials: true
}));

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

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit: https://real-estate-api-tr3v.onrender.com`);
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });
