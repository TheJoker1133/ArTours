// src/controllers/usuariosController.js
const bcrypt = require('bcryptjs');
const usuarioService = require('../services/usuariosService');

// Quitar el password_hash de la respuesta
function stripPassword(rows) {
  return rows.map(u => {
    const { password_hash, ...rest } = u;
    return rest;
  });
}

// GET /api/usuarios
exports.getAll = (req, res) => {
  usuarioService.getAllUsuarios(req, (err, rows) => {
    if (err) {
      console.error('Error obteniendo usuarios:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(stripPassword(rows));
  });
};

// GET /api/usuarios/:id
exports.getById = (req, res) => {
  const { id } = req.params;

  usuarioService.getUsuarioById(req, id, (err, rows) => {
    if (err) {
      console.error('Error obteniendo usuario por id:', err);
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(stripPassword(rows)[0]);
  });
};

// POST /api/usuarios
exports.create = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol = 'CLIENTE',
      estado = 'activo'
    } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const data = {
      nombre,
      email,
      password_hash,
      rol,
      estado
    };

    usuarioService.createUsuario(req, data, (err, result) => {
      if (err) {
        console.error('Error creando usuario:', err);
        return res.status(500).json({ error: err.message });
      }
      const { password_hash, ...rest } = data;
      res.status(201).json({ id: result.insertId, ...rest });
    });
  } catch (e) {
    console.error('Error en create usuario:', e);
    res.status(500).json({ error: e.message });
  }
};

// PUT /api/usuarios/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      email,
      password,
      rol,
      estado
    } = req.body;

    const data = {};

    if (nombre) data.nombre = nombre;
    if (email) data.email = email;
    if (rol) data.rol = rol;
    if (estado) data.estado = estado;

    // Si viene password, la re-encriptamos
    if (password && password.trim() !== '') {
      data.password_hash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    usuarioService.updateUsuario(req, id, data, (err, result) => {
      if (err) {
        console.error('Error actualizando usuario:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ ok: true });
    });
  } catch (e) {
    console.error('Error en update usuario:', e);
    res.status(500).json({ error: e.message });
  }
};

// DELETE /api/usuarios/:id
exports.remove = (req, res) => {
  const { id } = req.params;

  usuarioService.deleteUsuario(req, id, (err, result) => {
    if (err) {
      console.error('Error eliminando usuario:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ ok: true });
  });
};
