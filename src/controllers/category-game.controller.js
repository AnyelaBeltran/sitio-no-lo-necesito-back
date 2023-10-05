const { z } = require('zod');
const { Op } = require('sequelize');

const CategoryGame = require('../models/categoria.model'); // Importa tu modelo de CategoryGame
const errorResponse = require('../utils/error-response.util');
const successResponse = require('../utils/success-response.util');

exports.index = async (req, res) => {
  try {
    // Consulta todas las categorías de juegos desde la base de datos
    const categorias = await CategoryGame.findAll();
    const categoriasData = categorias.map((categoria) => categoria.dataValues);

    return res.status(201).json(
      successResponse('Categorías de juegos obtenidas con éxito', 201, categoriasData)
    );
  } catch (error) {
    console.error('Error al obtener las categorías de juegos:', error);
    return res.status(500).json(
      errorResponse('Error interno del servidor', 500)
    );
  }
};

exports.show = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json(
        errorResponse('El ID de la categoría de juegos no es válido', 400)
      );
    }

    const categoria = await CategoryGame.findByPk(categoryId);

    if (!categoria) {
      return res.status(404).json(
        errorResponse('Categoría de juegos no encontrada', 404)
      );
    }

    if (categoria.estado !== 1) {
      return res.status(422).json(
        errorResponse('Categoría de juegos no disponible', 422)
      );
    }

    return res.status(200).json(
      successResponse('Categoría de juegos obtenida con éxito', 200, categoria)
    );
  } catch (error) {
    console.error('Error al obtener la categoría de juegos:', error);
    return res.status(500).json(
      errorResponse('Error interno del servidor', 500)
    );
  }
};

exports.create = async (req, res) => {
  const createCategoryGameSchema = z.object({
    nombre: z.string().min(4).max(256),
    descripcion: z.string().min(4).max(256),
    estado: z.boolean(),
  });

  try {
    const { nombre, descripcion, estado } = req.body;

    const validatedData = createCategoryGameSchema.parse({
      nombre,
      descripcion,
      estado,
    });

    const nombreCapitalizado = nombre.toUpperCase();

    const categoriaExistente = await CategoryGame.findOne({ where: { nombre: nombreCapitalizado } });

    if (categoriaExistente) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Ya existe una categoría de juegos con el mismo nombre',
        response: false,
        data: null,
      });
    }

    const nuevaCategoria = await CategoryGame.create({
      nombre: nombreCapitalizado,
      descripcion,
      estado,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json(
      successResponse('Categoría de juegos creada con éxito', 201, nuevaCategoria)
    );
  } catch (error) {
    console.error('Error al crear la categoría de juegos:', error);

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
        message: 'Datos de entrada inválidos',
        response: false,
        data: null,
        errors: zodErrors,
      });
    }

    return res.status(500).json(errorResponse('Error interno del servidor', 500, error));
  }
};

exports.update = async (req, res) => {
  const updateCategoryGameSchema = z.object({
    nombre: z.string().min(4).max(256),
    descripcion: z.string().min(4).max(256),
    estado: z.boolean(),
  });

  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const validatedData = updateCategoryGameSchema.parse({
      nombre,
      descripcion,
      estado,
    });

    const nombreEnMayusculas = nombre.toUpperCase();

    const categoriaExistente = await CategoryGame.findByPk(id);

    if (!categoriaExistente) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Categoría de juegos no encontrada',
        response: false,
        data: null,
      });
    }

    const otraCategoriaConMismoNombre = await CategoryGame.findOne({
      where: { nombre: nombreEnMayusculas, id: { [Op.not]: id } },
    });

    if (otraCategoriaConMismoNombre) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Ya existe otra categoría de juegos con el mismo nombre',
        response: false,
        data: null,
      });
    }

    // Actualizar la categoría de juegos existente con los nuevos datos
    categoriaExistente.nombre = nombreEnMayusculas;
    categoriaExistente.descripcion = descripcion;
    categoriaExistente.estado = estado;
    categoriaExistente.updated_at = new Date();
    await categoriaExistente.save();

    return res.status(200).json(
      successResponse('Categoría de juegos actualizada con éxito', 200, categoriaExistente)
    );
  } catch (error) {
    console.error('Error al actualizar la categoría de juegos:', error);

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
        message: 'Datos de entrada inválidos',
        response: false,
        data: null,
        errors: zodErrors,
      });
    }

    return res.status(500).json(errorResponse('Error interno del servidor', 500, error));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await CategoryGame.findByPk(id);

    if (!categoria) {
      return res.status(404).json(errorResponse('Categoría de juegos no encontrada', 404));
    }

    if (categoria.estado === 1) {
      return res.status(422).json(errorResponse('La categoría de juegos está en estado activo', 422));
    }

    await categoria.destroy();

    return res.status(200).json(successResponse('Categoría de juegos eliminada con éxito', 200, categoria));
  } catch (error) {
    console.error('Error al eliminar la categoría de juegos:', error);
    return res.status(500).json(errorResponse('Error interno del servidor', 500, error));
  }
};

