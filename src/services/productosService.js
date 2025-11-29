// src/services/productosService.js

// Obtener todos los productos
function getAllProductos(req, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM productos', callback);
  });
}

// Obtener producto por ID
function getProductoById(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM productos WHERE id = ?', [id], callback);
  });
}

// Crear producto
function createProducto(req, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);

    conn.query('INSERT INTO productos SET ?', data, callback);
  });
}

// Actualizar producto
function updateProducto(req, id, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);

    conn.query('UPDATE productos SET ? WHERE id = ?', [data, id], callback);
  });
}

// Eliminar producto
function deleteProducto(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);

    conn.query('DELETE FROM productos WHERE id = ?', [id], callback);
  });
}

// Exportar funciones (IMPORTANTE)
module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
