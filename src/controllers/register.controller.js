// registerController.js

const User = require('../models/user.model');
const errorResponse = require('../utils/error-response.util');
const successResponse = require('../utils/success-response.util');

const registerController = async (req, res) => {
  try {
    const { nombre, apellido, email, password, cedula, telefono, direccion, rol_id } = req.body;

    // Verifica si se proporcionaron todos los campos obligatorios
    if (!nombre || !apellido || !email || !password || !cedula || !telefono || !direccion) {
      return res.status(422).json(errorResponse('Faltan campos obligatorios', 422));
    }

    // Verifica si se proporciona rol_id en la solicitud
    if (rol_id !== undefined) {
      return res.status(422).json(errorResponse('No se permite proporcionar rol_id', 422));
    }

    // Verifica la unicidad del correo electrónico (email)
    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      return res.status(422).json(errorResponse('El correo electrónico ya está en uso', 422));
    }

    // Verifica la unicidad de la cédula (cedula)
    const existingCedulaUser = await User.findOne({ where: { cedula } });
    if (existingCedulaUser) {
      return res.status(422).json(errorResponse('La cédula ya está en uso', 422));
    }

    // Establece rol_id automáticamente en el servidor (por ejemplo, 1 para cliente)
    const defaultRolId = 1;
    
    // Crea un nuevo usuario en la base de datos
    const newUser = await User.create({
      nombre,
      apellido,
      email,
      password,
      cedula,
      telefono,
      direccion,
      rol_id: defaultRolId, // Rol predeterminado
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Envía una respuesta de éxito
    return res.status(201).json(successResponse('Usuario creado correctamente', 201, newUser));
  } catch (error) {
    console.error('Error en el controlador de registro:', error);
    return res.status(500).json(errorResponse('Error interno del servidor', 500));
  }
};

module.exports = registerController;
