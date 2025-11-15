const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment');
  process.exit(1);
}

console.log('Connecting to DB:', process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@')); // Hide password

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
