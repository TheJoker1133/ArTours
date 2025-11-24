const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// GET /api/usuarios
router.get('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(
      'SELECT id, nombre, email, rol, estado, creado_en, actualizado_en FROM usuarios',
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });
});

// GET /api/usuarios/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(
      'SELECT id, nombre, email, rol, estado, creado_en, actualizado_en FROM usuarios WHERE id = ?',
      [id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
      }
    );
  });
});

// POST /api/usuarios
router.post('/', (req, res) => {
  const { nombre, email, password, rol = 'USER' } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'nombre, email y password son requeridos' });
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
        const nuevo = {
          nombre,
          email,
          password_hash: hash,
          rol,
          estado: 'activo'
        };

        conn.query('INSERT INTO usuarios SET ?', nuevo, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({
            id: result.insertId,
            nombre,
            email,
            rol,
            estado: 'activo'
          });
        });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  });
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol, estado } = req.body;

  const fields = [];
  const values = [];

  if (nombre) { fields.push('nombre = ?'); values.push(nombre); }
  if (email)  { fields.push('email = ?');  values.push(email); }
  if (rol)    { fields.push('rol = ?');    values.push(rol); }
  if (estado) { fields.push('estado = ?'); values.push(estado); }

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    fields.push('password_hash = ?');
    values.push(hash);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  values.push(id);

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
      values,
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya está registrado' });
          }
          return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ ok: true });
      }
    );
  });
});

// DELETE /api/usuarios/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ ok: true, message: `Usuario con ID ${id} eliminado` });
    });
  });
});

module.exports = router;
