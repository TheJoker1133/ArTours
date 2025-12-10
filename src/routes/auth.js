// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-artours';

// ... (register igual que ya lo tenías, si quieres)
// Cambiamos SOLO el login:

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(
      'SELECT * FROM usuarios WHERE email = ? AND estado = "activo"',
      [email],
      async (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (rows.length === 0) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = rows[0];
        const match = await bcrypt.compare(password, usuario.password_hash);

        if (!match) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Sesión (para tu auth.html en el navegador)
        req.session.user = {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        };


        const token = jwt.sign(
          {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol 
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.json({
          ok: true,
          message: 'Login exitoso',
          user: req.session.user,
          token 
        });
      }
    );
  });
});

module.exports = router;
