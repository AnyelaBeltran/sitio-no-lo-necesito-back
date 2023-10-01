// sequelize.config.js

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  DATABASE: process.env.DB_DATABASE || '',
  USER: process.env.DB_USER || '',
  PASSWORD: process.env.DB_PASSWORD || '',
  HOST: process.env.DB_HOST || '',
};

const sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 30000,
  },
  logging: true,
});

module.exports = sequelize;
