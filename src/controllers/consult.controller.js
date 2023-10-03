const errorResponse = require("../utils/error-response.util");
const Consola = require("../models/consola.model"); 
const Categoria = require("../models/categoria.model");  // Importa el modelo Categoria
const successResponse = require("../utils/success-response.util");
const VideoJuego = require("../models/videoJuego.model");

exports.getLastInStock = async (req, res) => {
  try {
    const consolas = await Consola.findAll({
      limit: 2,
      order: [['created_at', 'DESC']],
    });

    const videojuegos = await VideoJuego.findAll({
      limit: 2,
      order: [['created_at', 'DESC']],
      include: [Categoria, Consola]
    });

    const result = {
      consolas,
      videojuegos,
    };

    return res.status(201).json(successResponse('Registros obtenidos correctamente', 201, result));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error al obtener los registros.", 500));
  }
};
