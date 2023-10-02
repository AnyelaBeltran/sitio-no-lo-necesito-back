const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const errorResponse = require('../utils/error-response.util');
const User = require('../models/user.model');

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
});

const loginController = async (req, res) => {
  try {
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(422).json(errorResponse(error.message, 422));

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json(errorResponse('Usuario no encontrado', 404));

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(422).json(errorResponse('Usuario o contraseña incorrecto', 422));

    // Crear un token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol_id: user.rol_id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '2h'
      }
    );

    // Enviar el token en el encabezado de respuesta
    res.header('auth-token', token);

    // Enviar los datos del usuario junto con el token en la respuesta JSON
    return res.status(201).json({
      status: 'OK',
      code: 201,
      messages: 'Inicio de sesión correcto',
      response: true,
      result: {
        token,
        userData: {
          nombre: user.dataValues.nombre,
          apellido: user.dataValues.apellido,
          email: user.dataValues.email,
        },
      },
    });
  } catch (error) {
    console.error('Error en el controlador de login:', error);
    return res.status(500).json(errorResponse('Error interno del servidor', 500));
  }
};

module.exports = loginController;
