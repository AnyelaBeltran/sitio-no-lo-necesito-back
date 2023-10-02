const sequelize = require('../../db/connection.db');
const { DataTypes } = require('sequelize');

const Marca = sequelize.define('Marca', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true, // Puedes cambiar esto según tus requisitos
  },
  estado: {
    type: DataTypes.BOOLEAN, // Cambiado a BOOLEAN para representar estados verdaderos/falsos
    allowNull: true, // Puedes cambiar esto según tus requisitos
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
  tableName: 'marcas', // Nombre de la tabla en la base de datos
  timestamps: false, // No se utilizarán campos de registro de tiempo automáticamente
});

module.exports = Marca;
