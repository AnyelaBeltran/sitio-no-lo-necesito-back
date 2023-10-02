
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');


const errorResponse = require('../utils/error-response.util');
const successResponse = require('../utils/success-response.util');
const User = require('../models/user.model');

const schemaRegister = Joi.object({
  nombre: Joi.string().min(4).max(255).required(),
  apellido: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(12).required(),
  cedula: Joi.string().min(10).max(10).required(),
  telefono: Joi.string().regex(/^\d{10}$/).required(),
  direccion: Joi.string().min(6).max(1024).required(),

});

const registerController = async (req, res) => {

  const { nombre, apellido, email, cedula, telefono, direccion, rol_id } = req.body;


  const { error } = schemaRegister.validate(req.body);

  if (error) return res.status(422).json(errorResponse(error.message, 422));
  

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) return res.status(422).json(errorResponse('El correo electrónico ya está en uso', 422));

  

  const isCedulaExist = await User.findOne({ email: req.body.cedula });
  if (isCedulaExist) return res.status(422).json(errorResponse('La cédula ya está en uso', 422));

  

  if (rol_id !== undefined) return res.status(422).json(errorResponse('Error en el sistema de registro, codigo de error Aoxc45652 contacte a soporte tecnico', 422));
  

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  try {

    const defaultRolId = 2;

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

    return res.status(201).json(successResponse('Usuario creado correctamente', 201, newUser));
  } catch (error) {
    console.error('Error en el controlador de registro:', error);
    return res.status(500).json(errorResponse('Error interno del servidor', 500));
  }
};

module.exports = registerController;
