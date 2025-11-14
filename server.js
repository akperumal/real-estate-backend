// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const db = require('./models'); // ONLY ONE LINE

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
app.use(cors());
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
// Import models after sequelize
const { User } = require('./models/user');
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Login:    POST http://localhost:${PORT}/api/auth/login`);
});
