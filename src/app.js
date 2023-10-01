const express = require('express');
const cors = require('cors');

const morgan = require('morgan');

require('dotenv').config();

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

/**Base de datos */
const dataBase = require('../db/connection.db');

const connectDB = async () => {
  try {
    await dataBase.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDB();


const router = require('./routes/router');
app.use('/register', router);



module.exports = app;