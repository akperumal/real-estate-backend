// server.js
require('dotenv').config({ path: '.env' });   // only for local dev

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db');

const app = express();

// ---------- Middleware ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- CORS (allow your Vercel frontend) ----------
app.use(
  cors({
    origin: 'https://real-estate-client-gules.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// ---------- Request logging ----------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ---------- Routes ----------
let authRoutes, plotRoutes;
try {
  authRoutes = require('./routes/auth');
  plotRoutes = require('./routes/plot');
  console.log('Routes loaded');
} catch (err) {
  console.error('Failed to load routes:', err.message);
}

// Mount only if they exist
if (authRoutes) app.use('/api/auth', authRoutes);
if (plotRoutes) app.use('/api/plots', plotRoutes);

// ---------- Test & Home ----------
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send(
    '<h1>Real Estate Backend API</h1><p>Status: LIVE</p><p><a href="/api/test">Test API</a></p>'
  );
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res
    .status(500)
    .json({ message: 'Internal Server Error', error: err.message });
});

// ---------- 404 ----------
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 3000;   // Railway will override with its own port

async function startServer() {
  try {
    // ---- DB connection ----
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment');
    }
    console.log('=== DATABASE_URL CHECK ===');
    console.log('DATABASE_URL: SET');
    console.log(
      'URL:',
      process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')
    );
    console.log('==========================');

    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: false });
    console.log('Database synced');

    // ---- Listen ----
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Railway URL: https://real-estate-backend.up.railway.app`);
    });
  } catch (err) {
    console.error('FATAL STARTUP ERROR:', err.message);
    process.exit(1);
  }
}

startServer();
