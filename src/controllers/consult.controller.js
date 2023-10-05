const errorResponse = require("../utils/error-response.util");
const successResponse = require("../utils/success-response.util");
const VideoJuego = require("../models/videoJuego.model");
const Marca = require("../models/marca.model");
const Categoria = require("../models/categoria.model");
const Consola = require("../models/consola.model");

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


exports.getMarcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll({
      where: {
        estado: 1
      },
      order: [['created_at', 'DESC']],
    });

    
    const result = {
      marcas
    };

    return res.status(201).json(successResponse('Registros obtenidos correctamente', 201, result));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error al obtener los registros.", 500));
  }
};


exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: {
        estado: 1
      },
      order: [['created_at', 'DESC']],
    });

    
    const result = {
      categorias
    };

    return res.status(201).json(successResponse('Registros obtenidos correctamente', 201, result));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error al obtener los registros.", 500));
  }
};

exports.getConsolas = async (req, res) => {
  try {
    const consolas = await Consola.findAll({
      where: {
        estado: 1
      },
      order: [['created_at', 'DESC']],
    });

    
    const result = {
      consolas
    };

    return res.status(201).json(successResponse('Registros obtenidos correctamente', 201, result));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error al obtener los registros.", 500));
  }
};


