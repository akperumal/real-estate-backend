const { Sequelize } = require('sequelize');
require('dotenv').config();

// === DEBUG: LOG DATABASE_URL ===
console.log('=== DATABASE_URL CHECK ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');
if (process.env.DATABASE_URL) {
  console.log('URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
}
console.log('==========================');

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set!');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = { sequelize };
