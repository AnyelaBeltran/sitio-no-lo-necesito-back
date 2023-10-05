const { DataTypes } = require('sequelize');
const sequelize = require('../../db/connection.db'); // Asegúrate de importar adecuadamente tu instancia Sequelize
const Categoria = require('./categoria.model');
const Consola = require('./consola.model');

const VideoJuego = sequelize.define('Juego', {
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
    allowNull: true,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  consola_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estado: {
    type: DataTypes.BOOLEAN,
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
  imagen_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'juegos',
  timestamps: false,
});

// Define la relación con Categoria
VideoJuego.belongsTo(Categoria, {
  foreignKey: 'categoria_id', // Nombre de la clave foránea en VideoJuego
});

VideoJuego.belongsTo(Consola, {
  foreignKey: 'consola_id', // Nombre de la clave foránea en VideoJuego
});


module.exports = VideoJuego;
