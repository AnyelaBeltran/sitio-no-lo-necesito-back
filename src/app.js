const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const morgan = require('morgan');

require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(cors()); 

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


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
app.use('/', router);



module.exports = app;
