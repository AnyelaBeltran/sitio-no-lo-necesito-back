const { z } = require('zod');
const path = require('path');
const fs = require('fs');
const errorResponse = require("../utils/error-response.util");
const successResponse = require("../utils/success-response.util");
const Consola = require("../models/consola.model")
const Categoria = require("../models/categoria.model")
const VideoJuego = require("../models/videoJuego.model")


exports.index = async (req, res) => {
    try {
        
        const consolas = await VideoJuego.findAll({
            include: [Categoria, Consola],
           

        });
        const consolasData = consolas.map((consola) => consola.dataValues);

        return res.status(201).json(successResponse('Videojuegos obtenidas con éxito', 201, consolasData));
    } catch (error) {
        console.error('Error al obtener las videojuegos:', error);
        return res.status(500).json(errorResponse('Error interno del servidor', 500));
    }
};

exports.show = async (req, res) => {
    try {
        const videoJuegoId = parseInt(req.params.id);
        console.log(videoJuegoId)
        if (isNaN(videoJuegoId) || videoJuegoId <= 0) {
            return res.status(400).json(errorResponse('El ID de videojuego no es válido', 400));
        }

        // Consulta la consola por su ID en la base de datos
        const videoJuego = await VideoJuego.findByPk(videoJuegoId, {
            include: [Consola, Categoria],
        });

        if (!videoJuego) {
            return res.status(404).json(errorResponse('Videojuego no encontrado', 404));
        }

        return res.status(201).json(successResponse('Videojuego obtenida con éxito', 201, videoJuego));
    } catch (error) {
        console.error('Error al obtener la consola:', error);
        return res.status(500).json(errorResponse('Error interno del servidor', 500));
    }
};


exports.create = async (req, res) => {
    try {
        const { nombre, descripcion, categoria_id, consola_id, precio, stock, estado } = req.body;

        const image = req.files.selectedFile;

        if (!req.files || !req.files.selectedFile) {
            return res.status(422).json({ message: 'Debes proporcionar una imagen' });
        }


        const createSchemaConsola = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.string().nonempty(),
            categoria_id: z.string().nonempty(),
            consola_id: z.string().nonempty(),
            precio: z.string().nonempty(),
            stock: z.string().nonempty(),
            estado: z.string().refine((value) => value === "1" || value === "2", {
                message: "El campo 'estado' debe ser '1' (Activo) o '2' (Inactivo)",
            }),
        });

        const validatedData = createSchemaConsola.parse({
            nombre, descripcion, categoria_id, consola_id, precio, stock, estado
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



        const nuevoVideoJuego = await VideoJuego.create({
            nombre,
            descripcion,
            categoria_id,
            consola_id,
            precio,
            stock,
            estado,
            created_at: new Date(),
            updated_at: new Date(),
            imagen_path: newImagePath
        });
        res.status(201).json({ message: 'Videojuego creado correctamente', videojuego: nuevoVideoJuego });

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
        const { nombre, descripcion, categoria_id, consola_id, precio, stock, estado } = req.body;


        const image = req.files.imagen;
        console.log(image);

        if (!req.files || !req.files.imagen) {
            return res.status(422).json({ message: 'Debes proporcionar una imagen' });
        }

        const createSchemaConsola = z.object({
            nombre: z.string().nonempty().min(4).max(256),
            precio: z.string().nonempty(),
            categoria_id: z.string().nonempty(),
            consola_id: z.string().nonempty(),
            precio: z.string().nonempty(),
            stock: z.string().nonempty(),
            estado: z.string().refine((value) => value === "1" || value === "2", {
                message: "El campo 'estado' debe ser '1' (Activo) o '2' (Inactivo)",
            }),
        });

        const validatedData = createSchemaConsola.parse({
            nombre, descripcion, categoria_id, consola_id, precio, stock, estado
        });


        // Find the consola by ID
        const videojuego = await VideoJuego.findByPk(id);

        if (!videojuego) {
            return res.status(404).json(errorResponse('Videjuego no encontrada', 404));
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
        videojuego.nombre = nombre.toUpperCase();
        videojuego.precio = precio;
        videojuego.stock = stock;
        videojuego.categoria_id = categoria_id;
        videojuego.consola_id = consola_id;
        videojuego.descripcion = descripcion;
        videojuego.estado = estado;
        videojuego.imagen_path = newImagePath;

        await videojuego.save();

        return res.status(200).json(successResponse('VideoJuego actualizado con éxito', 200, videojuego));
    } catch (error) {
        console.log(error);
        console.error('Error al actualizar el videojuego:', error);
       
    }
};



exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la marca por su ID
        const videojuego = await VideoJuego.findByPk(id);

        if (!videojuego) {
            return res.status(404).json(errorResponse('videojuego no encontrada', 404));
        }

        if (videojuego.estado == 1) {
            return res.status(422).json(errorResponse('el videojuego esta en estado activo', 422));
        }

        
        await videojuego.destroy();

        return res.status(200).json(successResponse('videojuego eliminado con éxito', 200, consola));
    } catch (error) {
        console.error('Error al eliminar el videojuego:', error);
        return res.status(500).json(errorResponse('Internal server error', 500, error));
    }
};
