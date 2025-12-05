// src/controllers/ordenesController.js
const ordenesService = require('../services/ordenesService');

exports.crear = (req, res) => {
  const { items, fecha_tour, hora_tour, num_personas, metodo_pago, notas } = req.body;

  // Validaciones básicas
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  if (!fecha_tour) {
    return res.status(400).json({ error: 'La fecha del tour es requerida' });
  }

  if (!num_personas) {
    return res.status(400).json({ error: 'El número de personas es requerido' });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  // Calcular total y normalizar items
  let total = 0;
  const itemsNormalizados = items.map(it => {
    const cantidad = parseInt(it.cantidad) || 1;
    const precio = parseFloat(it.precio) || 0;
    const subtotal = cantidad * precio;
    total += subtotal;

    return {
      id_producto: it.id_producto,
      nombre: it.nombre,
      precio_unitario: precio,
      cantidad
    };
  });

  const datosOrden = {
    usuario_id: req.user.id,
    tipo: 'reserva',                     // o 'venta' si quieres manejarlo después
    estado: 'pendiente',
    total: total.toFixed(2),
    fecha_tour,
    hora_tour: hora_tour || null,
    num_personas: parseInt(num_personas),
    metodo_pago: metodo_pago || null,
    notas: notas || null
  };

  ordenesService.crearOrden(req, datosOrden, itemsNormalizados, (err, result) => {
    if (err) {
      console.error('Error creando orden:', err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      ok: true,
      id_orden: result.id_orden,
      total: total.toFixed(2)
    });
  });
};

exports.listMine = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const userId = req.user.id;

  req.getConnection((err, conn) => {
    if (err) {
      console.error('Error conexión listMine:', err);
      return res.status(500).json({ error: err.message });
    }

    const sqlOrdenes = `
      SELECT 
        id,
        tipo,
        estado,
        total,
        fecha_tour,
        hora_tour,
        num_personas,
        metodo_pago,
        notas,
        creado_en
      FROM ordenes
      WHERE usuario_id = ?
      ORDER BY creado_en DESC
    `;

    conn.query(sqlOrdenes, [userId], (err, ordenes) => {
      if (err) {
        console.error('Error query ordenes listMine:', err);
        return res.status(500).json({ error: err.message });
      }

      if (ordenes.length === 0) {
        return res.json([]);
      }

      const ids = ordenes.map(o => o.id);

      const sqlItems = `
        SELECT 
          oi.id,
          oi.orden_id,
          oi.producto_id,
          oi.nombre,
          oi.precio_unitario,
          oi.cantidad
        FROM orden_items oi
        WHERE oi.orden_id IN (?)
      `;

      conn.query(sqlItems, [ids], (err, items) => {
        if (err) {
          console.error('Error query orden_items listMine:', err);
          return res.status(500).json({ error: err.message });
        }

        const itemsPorOrden = {};
        items.forEach(it => {
          if (!itemsPorOrden[it.orden_id]) itemsPorOrden[it.orden_id] = [];
          itemsPorOrden[it.orden_id].push(it);
        });

        const respuesta = ordenes.map(o => ({
          ...o,
          items: itemsPorOrden[o.id] || []
        }));

        res.json(respuesta);
      });
    });
  });
};


// 👉 Lista de todas las órdenes (solo admin)
exports.listAll = (req, res) => {
  // Debug: ver qué hay en req.user
  console.log('listAll -> req.user:', req.user);

  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No autenticado' });
  }

  const rol = String(req.user.rol || '').trim().toUpperCase();
  console.log('listAll -> rol normalizado:', rol);

  if (rol !== 'ADMIN') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Solo admin puede ver todas las órdenes'
    });
  }

  req.getConnection((err, conn) => {
    if (err) {
      console.error('Error conexión listAll:', err);
      return res.status(500).json({ error: err.message });
    }

    const sqlOrdenes = `
      SELECT 
        o.id,
        o.tipo,
        o.estado,
        o.total,
        o.fecha_tour,
        o.hora_tour,
        o.num_personas,
        o.metodo_pago,
        o.notas,
        o.creado_en,
        u.email AS usuario_email
      FROM ordenes o
      LEFT JOIN usuarios u ON u.id = o.usuario_id
      ORDER BY o.creado_en DESC
    `;

    conn.query(sqlOrdenes, (err, ordenes) => {
      if (err) {
        console.error('Error query ordenes listAll:', err);
        return res.status(500).json({ error: err.message });
      }

      if (ordenes.length === 0) {
        return res.json([]);
      }

      const ids = ordenes.map(o => o.id);

      const sqlItems = `
        SELECT 
          oi.id,
          oi.orden_id,
          oi.producto_id,
          oi.nombre,
          oi.precio_unitario,
          oi.cantidad
        FROM orden_items oi
        WHERE oi.orden_id IN (?)
      `;

      conn.query(sqlItems, [ids], (err, items) => {
        if (err) {
          console.error('Error query orden_items listAll:', err);
          return res.status(500).json({ error: err.message });
        }

        const itemsPorOrden = {};
        items.forEach(it => {
          if (!itemsPorOrden[it.orden_id]) itemsPorOrden[it.orden_id] = [];
          itemsPorOrden[it.orden_id].push(it);
        });

        const respuesta = ordenes.map(o => ({
          ...o,
          items: itemsPorOrden[o.id] || []
        }));

        res.json(respuesta);
      });
    });
  });
};