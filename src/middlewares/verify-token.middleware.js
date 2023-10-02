const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/error-response.util');
const User = require('../models/user.model');

// Middleware para validar el token y el rol del usuario
const verifyTokenAndRole = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json(errorResponse('Acceso denegado', 401));

  try {
    // Verificar el token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    // Buscar al usuario por ID y correo electrónico en la base de datos
    const user = await User.findOne({
      _id: decodedToken.id,
      email: decodedToken.email,
    });

    if (!user) return res.status(401).json(errorResponse('Acceso Denegado', 401));

    // Verificar el rol del usuario (1 para permitir, 2 para denegar)
    if (user.rol_id === 1) {
      // El usuario tiene un rol de 1, se le permite el acceso
      req.user = decodedToken;
      next(); // Continuamos
    } else if (user.rol_id === 2) {
      // El usuario tiene un rol de 2, se le deniega el acceso
      return res.status(403).json(errorResponse('Permiso denegado', 403));
    } else {
      // Otros roles o valores no permitidos
      return res.status(403).json(errorResponse('Permiso denegado', 403));
    }
  } catch (error) {
    return res.status(400).json(errorResponse('Token inválido', 400));
  }
};

module.exports = verifyTokenAndRole;
