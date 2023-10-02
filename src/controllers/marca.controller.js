// marcaController.js

const { z, ZodError } = require('zod');
const { Op } = require('sequelize');

const Marca = require('../models/marca.model'); // Importa tu modelo de marca
const errorResponse = require('../utils/error-response.util');
const successResponse = require('../utils/success-response.util');

exports.index = async (req, res) => {
  try {
    // Consulta todas las marcas desde la base de datos
    const marcas = await Marca.findAll();
    const marcasData = marcas.map((marca) => marca.dataValues);
    console.log(marcasData);

    return res.status(200).json(
      successResponse('Marcas obtenidas con éxito', 200, marcasData)
    );
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    return res.status(500).json(
      errorResponse('Error interno del servidor', 500)
    );
  }
};

exports.show = async (req, res) => {
  try {
    const marcaId = parseInt(req.params.id); // Convierte el ID de la marca en un entero

    if (isNaN(marcaId) || marcaId <= 0) {
      return res.status(400).json(
        errorResponse('El ID de la marca no es válido', 400)
      );
    }

    // Consulta la marca por su ID en la base de datos
    const marca = await Marca.findByPk(marcaId);

    if (!marca) {
      return res.status(404).json(
        errorResponse('Marca no encontrada', 404)
      );
    }


    if (marca.estado != 1) {
      return res.status(422).json(
        errorResponse('Marca no disponible', 422)
      );
    }


    return res.status(200).json(
      successResponse('Marca obtenida con éxito', 200, marca)
    );
  } catch (error) {
    console.error('Error al obtener la marca:', error);
    return res.status(500).json(
      errorResponse('Error interno del servidor', 500)
    );
  }
};


exports.create = async (req, res) => {
  const createMarcaSchema = z.object({
    nombre: z.string().nonempty().min(4).max(256),
    descripcion: z.string().nonempty().min(4).max(256),
    estado: z.boolean(),
  });

  try {
    const { nombre, descripcion, estado } = req.body;

    // Validar los datos de entrada
    const validatedData = createMarcaSchema.parse({
      nombre,
      descripcion,
      estado,
    });

    // Convertir el nombre a mayúsculas antes de verificar si existe en la base de datos
    const nombreCapitalizado = nombre.toUpperCase();

    // Verificar si ya existe una marca con el mismo nombre en la base de datos
    const marcaExistente = await Marca.findOne({ where: { nombre: nombreCapitalizado } });

    if (marcaExistente) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        messages: 'Ya existe una marca con el mismo nombre',
        response: false,
        data: null,
      });
    }

    // Crear la nueva marca
    const nuevaMarca = await Marca.create({
      nombre: nombreCapitalizado,
      descripcion,
      estado,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json(
      successResponse('Marca creada con éxito', 201, nuevaMarca)
    );
  } catch (error) {
    console.error('Error al crear la marca:', error);

    if (error instanceof z.ZodError) {
      const zodErrors = error.issues.map((issue) => {
        return {
          field: issue.path.join('.'),
          message: issue.message,
        };
      });

      return res.status(400).json({
        status: 'error',
        code: 400,
        messages: 'Datos de entrada inválidos',
        response: false,
        data: null,
        errors: zodErrors,
      });
    }

    return res.status(500).json(errorResponse('Internal server error', 500, error));
  }
};


exports.update = async (req, res) => {
  const updateMarcaSchema = z.object({
    nombre: z.string().nonempty().min(4).max(256),
    descripcion: z.string().nonempty().min(4).max(256),
    estado: z.boolean(),
  });

  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    // Validar los datos de entrada
    const validatedData = updateMarcaSchema.parse({
      nombre,
      descripcion,
      estado,
      
    });

    // Convertir el nombre a mayúsculas antes de verificar si existe en la base de datos
    const nombreEnMayusculas = nombre.toUpperCase();

    // Buscar la marca existente por su ID
    const marcaExistente = await Marca.findByPk(id);

    if (!marcaExistente) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        messages: 'Marca no encontrada',
        response: false,
        data: null,
      });
    }

    // Verificar si ya existe otra marca con el mismo nombre
    const otraMarcaConMismoNombre = await Marca.findOne({
      where: { nombre: nombreEnMayusculas, id: { [Op.not]: id } },
    });

    if (otraMarcaConMismoNombre) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        messages: 'Ya existe otra marca con el mismo nombre',
        response: false,
        data: null,
      });
    }

    // Actualizar la marca existente con los nuevos datos
    marcaExistente.nombre = nombreEnMayusculas;
    marcaExistente.descripcion = descripcion;
    marcaExistente.estado = estado;
    marcaExistente.updated_at = new Date(),
    await marcaExistente.save();

    return res.status(200).json(
      successResponse('Marca actualizada con éxito', 200, marcaExistente)
    );
  } catch (error) {
    console.error('Error al actualizar la marca:', error);

    if (error instanceof z.ZodError) {
      const zodErrors = error.issues.map((issue) => {
        return {
          field: issue.path.join('.'),
          message: issue.message,
        };
      });

      return res.status(400).json({
        status: 'error',
        code: 400,
        messages: 'Datos de entrada inválidos',
        response: false,
        data: null,
        errors: zodErrors,
      });
    }

    return res.status(500).json(errorResponse('Internal server error', 500, error));

  }
};


exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la marca por su ID
    const marca = await Marca.findByPk(id);

    if (!marca) {
      return res.status(404).json(errorResponse('Marca no encontrada', 404));
    }

    if (marca.estado == 1) {
      return res.status(422).json(errorResponse('La Marca esta en estado activo', 422));
    }

    // Realizar la eliminación de la marca
    await marca.destroy();

    return res.status(200).json(successResponse('Marca eliminada con éxito', 200, marca));
  } catch (error) {
    console.error('Error al eliminar la marca:', error);
    return res.status(500).json(errorResponse('Internal server error', 500, error));
  }
};
