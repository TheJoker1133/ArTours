// src/services/ordenesService.js

function crearOrden(req, datosOrden, items, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);

    conn.beginTransaction(err => {
      if (err) return callback(err);

      // 1) Insertar encabezado de la orden
      conn.query(
        'INSERT INTO ordenes SET ?',
        datosOrden,
        (err, resultOrden) => {
          if (err) {
            return conn.rollback(() => callback(err));
          }

          const ordenId = resultOrden.insertId;

          // 2) Insertar items (detalle)
          // orden_items tiene: orden_id, producto_id, nombre, precio_unitario, cantidad
          const valores = items.map(it => [
            ordenId,
            it.id_producto,
            it.nombre,
            it.precio_unitario,
            it.cantidad
          ]);

          const sqlItems = `
            INSERT INTO orden_items
              (orden_id, producto_id, nombre, precio_unitario, cantidad)
            VALUES ?
          `;

          conn.query(sqlItems, [valores], (err) => {
            if (err) {
              return conn.rollback(() => callback(err));
            }

            conn.commit(err => {
              if (err) {
                return conn.rollback(() => callback(err));
              }
              callback(null, { id_orden: ordenId });
            });
          });
        }
      );
    });
  });
}

module.exports = {
  crearOrden
};
