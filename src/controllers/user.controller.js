const User = require("../models/user.model");
const errorResponse = require("../utils/error-response.util");

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json(errorResponse('Usuario no encontrado', 404));

    return res.status(200).json({
      status: 'OK',
      code: 200,
      messages: 'Datos del usuario obtenidos correctamente',
      response: true,
      result: {
        userData: {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Error en el controlador de getUserData:', error);
    return res.status(500).json(errorResponse('Error interno del servidor', 500));
  }
};
