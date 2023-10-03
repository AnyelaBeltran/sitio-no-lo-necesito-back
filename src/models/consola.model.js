const sequelize = require('../../db/connection.db');
const { DataTypes } = require('sequelize');

const Consola = sequelize.define('Consolas', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    minLength: 4,
    maxLength: 256,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    positive: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    positive: true,
  },
  marca_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Marcas',
      field: 'id',
    },
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
    minLength: 4,
    maxLength: 256,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  imagen_path: {
    type: DataTypes.STRING,
    allowNull: true,
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
  tableName: 'consolas', 
  timestamps: false, 
});

module.exports = Consola;
