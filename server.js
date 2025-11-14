// server.js
const express = require('express');
const cors = require('cors');  // ← KEEP THIS ONE
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

// DB Sync
db.sequelize.sync({ alter: true })
  .then(() => console.log('PostgreSQL connected & synced'))
  .catch(err => console.error('DB Error:', err));


// Load env vars
dotenv.config();

const app = express();
// DB Sync
db.sequelize.sync({ alter: true })
  .then(() => console.log('PostgreSQL connected & synced'))
  .catch(err => console.error('DB Error:', err));

// Middleware
const cors = require('cors');

app.use(cors({
  origin: 'https://real-estate-client-gules.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
const plotRoutes = require('./routes/plot');
app.use('/api/plots', plotRoutes);
// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Protected Test Route
app.get('/api/protected', (req, res) => {
  res.json({ message: 'This is protected!', user: req.user });
});

// Admin Test Route
const { auth, admin } = require('./middleware/auth');
app.get('/api/admin', auth, admin, (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});

// Health Check
app.get('/', (req, res) => {
  res.send(`
    <h1>Real Estate Backend API</h1>
    <p>Endpoints:</p>
    <ul>
      <li>POST /api/auth/register</li>
      <li>POST /api/auth/login</li>
      <li>GET /api/test</li>
      <li>GET /api/admin (admin only)</li>
    </ul>
  `);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: https://real-estate-api-tr3v.onrender.com`);
});
const PORT = process.env.PORT || 5000;

// CORS - Allow Vercel frontend
const cors = require('cors');
app.use(cors({
  origin: 'https://real-estate-client-gules.vercel.app',
  credentials: true
}));

// Listen on Render's port + 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: https://real-estate-api-tr3v.onrender.com`);
});
