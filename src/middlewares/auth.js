// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-artours';

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ 
      error: "UNAUTHORIZED", 
      message: "Token requerido" 
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Ej: { sub: id, email, iat, exp }
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  } catch (e) {
    return res.status(401).json({ 
      error: "UNAUTHORIZED", 
      message: "Token inválido o expirado" 
    });
  }
}

module.exports = { authRequired };
