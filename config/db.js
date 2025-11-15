const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set!');
  process.exit(1);
}

console.log('DB URL set:', !!process.env.DATABASE_URL);
console.log('Connecting to:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

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
