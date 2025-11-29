// src/controllers/productosController.js
const productoService = require('../services/productosService');

// Obtener todos los productos
exports.getAll = (req, res) => {
  productoService.getAllProductos(req, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener producto por ID
exports.getById = (req, res) => {
  const { id } = req.params;

  productoService.getProductoById(req, id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  });
};

// Crear producto
exports.create = (req, res) => {
  const {
    nombre,
    descripcion_corta,
    descripcion,
    precio,
    duracion_min,
    ubicacion,
    ubicacion_lat,
    ubicacion_lng,
    capacidad,
    estado = 'activo',
    id_categoria
  } = req.body;

  if (!nombre || precio == null || !id_categoria) {
    return res.status(400).json({ 
      error: 'Los campos nombre, precio e id_categoria son obligatorios' 
    });
  }

  const data = {
    nombre,
    descripcion_corta,
    descripcion,
    precio,
    duracion_min,
    ubicacion,
    ubicacion_lat,
    ubicacion_lng,
    capacidad,
    estado,
    id_categoria
  };

  productoService.createProducto(req, data, (err, result) => {
    if (err) {
      console.error('Error creando producto:', err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: result.insertId,
      ...data
    });
  });
};


// Actualizar producto
exports.update = (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    descripcion_corta,
    descripcion,
    precio,
    duracion_min,
    ubicacion,
    ubicacion_lat,
    ubicacion_lng,
    capacidad,
    estado,
    id_categoria
  } = req.body;

  const data = {};

  if (nombre) data.nombre = nombre;
  if (descripcion_corta) data.descripcion_corta = descripcion_corta;
  if (descripcion) data.descripcion = descripcion;
  if (precio != null) data.precio = precio;
  if (duracion_min != null) data.duracion_min = duracion_min;
  if (ubicacion) data.ubicacion = ubicacion;
  if (ubicacion_lat != null) data.ubicacion_lat = ubicacion_lat;
  if (ubicacion_lng != null) data.ubicacion_lng = ubicacion_lng;
  if (capacidad != null) data.capacidad = capacidad;
  if (estado) data.estado = estado;
  if (id_categoria != null) data.id_categoria = id_categoria;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  productoService.updateProducto(req, id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ ok: true });
  });
};

// Eliminar producto
exports.remove = (req, res) => {
  const { id } = req.params;

  productoService.deleteProducto(req, id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ ok: true });
  });
};
