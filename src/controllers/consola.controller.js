const { z } = require('zod');
const { Op } = require('sequelize');
const fs = require("fs");
const { writeFile } = require('fs/promises');

const errorResponse = require("../utils/error-response.util");
const successResponse = require("../utils/success-response.util");
const Consola = require("../models/consola.model")
const Marca = require("../models/marca.model")


exports.index = async (req, res) => {
    try {
        // Consulta todas las consolas desde la base de datos
        const consolas = await Consola.findAll();
        const consolasData = consolas.map((consola) => consola.dataValues);

        return res.status(200).json(successResponse('Consolas obtenidas con éxito', 200, consolasData));
    } catch (error) {
        console.error('Error al obtener las consolas:', error);
        return res.status(500).json(errorResponse('Error interno del servidor', 500));
    }
};

exports.show = async (req, res) => {
    try {
        const consolaId = parseInt(req.params.id);
        console.log(consolaId)
        if (isNaN(consolaId) || consolaId <= 0) {
            return res.status(400).json(errorResponse('El ID de la consola no es válido', 400));
        }

        // Consulta la consola por su ID en la base de datos
        const consola = await Consola.findByPk(consolaId);

        if (!consola) {
            return res.status(404).json(errorResponse('Consola no encontrada', 404));
        }

        if (consola.estado === 1) {
            return res.status(200).json(successResponse('Consola obtenida con éxito', 200, consola));
        } else {
            return res.status(422).json(errorResponse('Consola no disponible', 422));
        }
    } catch (error) {
        console.error('Error al obtener la consola:', error);
        return res.status(500).json(errorResponse('Error interno del servidor', 500));
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, precio, stock, marca_id, descripcion, estado } = req.body;

        // Validar los datos de entrada
        const createConsolaSchema = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.number().positive(),
            stock: z.number().positive(),
            marca_id: z.number().positive(),
            descripcion: z.string().nonempty().min(4).max(256),
            estado: z.boolean(),

        });

        const validatedData = createConsolaSchema.parse({
            nombre, precio, stock, marca_id, descripcion, estado,
        });

        // Validar la imagen
        // if (!imagen) {
        //     return res.status(400).json(errorResponse('Se requiere una imagen', 400));
        // }

        // Validar la marca
        const marca = await Marca.findByPk(marca_id);

        if (!marca) {
            return res.status(400).json(errorResponse('La marca no existe', 400));
        }

        // Guardar la imagen
        // const fecha = new Date();
        // const nombreImagen = `${fecha.getTime()}-${imagen.filename}`;
        // const rutaImagen = `storage/imagenesConsolas/${nombreImagen}`;

        // await fs.writeFile(rutaImagen, imagen.data);

        // Crear la nueva consola
        const consola = new Consola({
            nombre: nombre.toUpperCase(),
            precio,
            stock,
            marca_id,
            descripcion,
            estado,
            //imagen_path: rutaImagen,
        });

        await consola.save();

        return res.status(201).json(successResponse('Consola creada con éxito', 201, consola));
    } catch (error) {
        console.error('Error al crear la consola:', error);

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
    try {
        const { id, nombre, precio, stock, marca_id, descripcion, estado } = req.body;

        // Validar los datos de entrada
        const updateConsolaSchema = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.number().positive(),
            stock: z.number().positive(),
            marca_id: z.number().positive(),
            descripcion: z.string().nonempty().min(4).max(256),
            estado: z.boolean(),
        });

        const validatedData = updateConsolaSchema.parse({
            nombre, precio, stock, marca_id, descripcion, estado,
        });

        // Buscar la consola por su ID
        const consola = await Consola.findByPk(id);

        if (!consola) {
            return res.status(404).json(errorResponse('Consola no encontrada', 404));
        }

        // Actualizar los datos de la consola
        consola.nombre = nombre.toUpperCase();
        consola.precio = precio;
        consola.stock = stock;
        consola.marca_id = marca_id;
        consola.descripcion = descripcion;
        consola.estado = estado;

        // Guardar los cambios en la base de datos
        await consola.save();

        return res.status(200).json(successResponse('Consola actualizada con éxito', 200, consola));
    } catch (error) {
        console.error('Error al actualiza la consola:', error);

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
      const consola = await Consola.findByPk(id);
  
      if (!consola) {
        return res.status(404).json(errorResponse('Consola no encontrada', 404));
      }
  
      if (consola.estado == 1) {
        return res.status(422).json(errorResponse('La consola esta en estado activo', 422));
      }
  
      // Realizar la eliminación de la marca
      await consola.destroy();
  
      return res.status(200).json(successResponse('Consola eliminada con éxito', 200, consola));
    } catch (error) {
      console.error('Error al eliminar la consola:', error);
      return res.status(500).json(errorResponse('Internal server error', 500, error));
    }
  };
  