const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db');
require('dotenv').config();

const app = express();

// === DEBUG: Log env on startup ===
console.log('=== ENVIRONMENT CHECK ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('==========================');

// === CORS: Allow Vercel frontend ===
app.use(cors({
  origin: 'https://real-estate-client-gules.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight
app.options('*', cors());

// === Middleware ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Request Logging ===
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// === Routes ===
let authRoutes, plotRoutes;
try {
  authRoutes = require('./routes/auth');
  plotRoutes = require('./routes/plot');
  console.log('Routes loaded successfully');
} catch (err) {
  console.error('FAILED to load routes:', err.message);
}

// Mount routes only if loaded
if (authRoutes) app.use('/api/auth', authRoutes);
if (plotRoutes) app.use('/api/plots', plotRoutes);

// === Test & Home ===
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('<h1>Real Estate Backend API</h1><p>Status: LIVE</p><p><a href="/api/test">Test API</a></p>');
});

// === Error Handlers ===
app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ 
    message: 'Server Error',
    error: err.message 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment');
    }

    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync({ alter: false });
    console.log('Database synced');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit: https://real-estate-api-xpqq.onrender.com`);
    });
  } catch (err) {
    console.error('FATAL STARTUP ERROR:', err.message);
    process.exit(1);
  }
}

startServer();
