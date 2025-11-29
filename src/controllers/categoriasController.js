// src/controllers/categoriasController.js
const categoriaService = require('../services/categoriasService');

exports.getAll = (req, res) => {
  categoriaService.getAllCategorias(req, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;
  categoriaService.getCategoriaById(req, id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  });
};

exports.create = (req, res) => {
  const { nombre, descripcion, estado = 'activo' } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'nombre es requerido' });
  }

  const data = { nombre, descripcion, estado };

  categoriaService.createCategoria(req, data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...data });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;
  const data = {};

  if (nombre) data.nombre = nombre;
  if (descripcion) data.descripcion = descripcion;
  if (estado) data.estado = estado;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  categoriaService.updateCategoria(req, id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ok: true });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;

  categoriaService.deleteCategoria(req, id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ok: true });
  });
};
