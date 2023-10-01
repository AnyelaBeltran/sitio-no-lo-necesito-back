// registerController.js

const sequelize = require('../../db/connection.db'); 
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', { // Define el modelo con nombre 'User'
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, 

  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false, 

  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false, 

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, 

  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false, 

  },
  telefono: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
      defaultValue: 1, 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = User;
