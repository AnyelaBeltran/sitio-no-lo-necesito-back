const { z } = require('zod');
const path = require('path');
const fs = require('fs');
const errorResponse = require("../utils/error-response.util");
const successResponse = require("../utils/success-response.util");
const Consola = require("../models/consola.model")
const Marca = require("../models/marca.model")



exports.index = async (req, res) => {
    try {
        // Consulta todas las consolas desde la base de datos
        const consolas = await Consola.findAll({
            include: [Marca],
            where: {
                estado: 1
            }

        });
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
        const consola = await Consola.findByPk(consolaId, {
            include: [Marca],
        });

        if (!consola) {
            return res.status(404).json(errorResponse('Consola no encontrada', 404));
        }

        return res.status(201).json(successResponse('Consola obtenida con éxito', 201, consola));
    } catch (error) {
        console.error('Error al obtener la consola:', error);
        return res.status(500).json(errorResponse('Error interno del servidor', 500));
    }
};


exports.create = async (req, res) => {
    try {
        const { nombre, precio, stock, marca_id, descripcion, estado } = req.body;

        const image = req.files.file;

        if (!req.files || !req.files.file) {
            return res.status(422).json({ message: 'Debes proporcionar una imagen' });
        }


        const createSchemaConsola = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.string().nonempty(),
            stock: z.string().nonempty(),
            marca_id: z.string().nonempty(),
            descripcion: z.string().nonempty().min(4).max(256),
            estado: z.string().refine((value) => value === "1" || value === "2", {
                message: "El campo 'estado' debe ser '1' (Activo) o '2' (Inactivo)",
            }),
        });

        const validatedData = createSchemaConsola.parse({
            nombre, precio, stock, marca_id, descripcion, estado,
        });





        const dir = './images/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Mover la imagen al directorio
        const newImagePath = path.join(dir, image.name);
        image.mv(newImagePath, function (err) {
            if (err) {
                return res.status(422).json(errorResponse('Error al mover la imagen', 422));
            }
        });

        const nuevaConsola = await Consola.create({
            nombre,
            precio,
            stock,
            marca_id,
            descripcion,
            estado,
            created_at: new Date(),
            updated_at: new Date(),
            imagen_path: newImagePath
        });
        res.status(201).json({ message: 'Consola creada correctamente', consola: nuevaConsola });

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

        return res.status(500).json(errorResponse('Internal server error', 500));
    }

};



exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, marca_id, descripcion, estado } = req.body;


        const image = req.files.file;

        if (!req.files || !req.files.file) {
            return res.status(422).json({ message: 'Debes proporcionar una imagen' });
        }


        const createSchemaConsola = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.string().nonempty(),
            stock: z.string().nonempty(),
            marca_id: z.string().nonempty(),
            descripcion: z.string().nonempty().min(4).max(256),
            estado: z.string().refine((value) => value === "1" || value === "2", {
                message: "El campo 'estado' debe ser '1' (Activo) o '2' (Inactivo)",
            }),
        });

        const validatedData = createSchemaConsola.parse({
            nombre, precio, stock, marca_id, descripcion, estado,
        });

        // Find the consola by ID
        const consola = await Consola.findByPk(id);

        if (!consola) {
            return res.status(404).json(errorResponse('Consola no encontrada', 404));
        }


        const dir = './images/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Mover la imagen al directorio
        const newImagePath = path.join(dir, image.name);
        image.mv(newImagePath, function (err) {
            if (err) {
                return res.status(422).json(errorResponse('Error al mover la imagen', 422));
            }
        });






        // Update the consola data
        consola.nombre = nombre.toUpperCase();
        consola.precio = precio;
        consola.stock = stock;
        consola.marca_id = marca_id;
        consola.descripcion = descripcion;
        consola.estado = estado;
        consola.imagen_path = newImagePath;

        await consola.save(); // Use save() to update the consola

        return res.status(200).json(successResponse('Consola actualizada con éxito', 200, consola));
    } catch (error) {
        console.error('Error al actualizar la consola:', error);
        // Rest of your error handling code...
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
