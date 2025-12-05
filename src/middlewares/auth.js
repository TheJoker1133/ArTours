// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Usa la MISMA secret que en el login
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-artours';


function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    console.log('authRequired: sin token o formato incorrecto. Header:', header);
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token requerido'
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Ejemplo de payload esperado:
    // { sub, email, rol, iat, exp }
    req.user = {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol
    };

    console.log('authRequired OK -> req.user:', req.user);
    next();
  } catch (e) {
    console.error('Error verificando token en authRequired:', e.message);
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = { authRequired };
