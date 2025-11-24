const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// POST /auth/register
router.post('/register', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length > 0) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }

      try {
        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = {
          nombre,
          email,
          password_hash: hash,
          rol: 'USER',
          estado: 'activo'
        };

        conn.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          req.session.user = {
            id: result.insertId,
            nombre,
            email,
            rol: 'USER'
          };

          res.status(201).json({
            ok: true,
            message: 'Usuario registrado y sesión iniciada',
            user: req.session.user
          });
        });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  });
});

// POST /auth/login
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

        req.session.user = {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        };

        res.json({
          ok: true,
          message: 'Login exitoso',
          user: req.session.user
        });
      }
    );
  });
});

// GET /auth/me
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false });
  }
  res.json({ loggedIn: true, user: req.session.user });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.clearCookie('connect.sid');
    res.json({ ok: true, message: 'Sesión cerrada' });
  });
});

module.exports = router;
