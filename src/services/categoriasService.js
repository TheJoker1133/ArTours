// src/services/categoriasService.js

// Obtener todas las categorías
function getAllCategorias(req, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM categorias', callback);
  });
}

// Obtener una categoría por ID
function getCategoriaById(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM categorias WHERE id = ?', [id], callback);
  });
}

// Crear categoría
function createCategoria(req, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('INSERT INTO categorias SET ?', data, callback);
  });
}

// Actualizar categoría
function updateCategoria(req, id, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('UPDATE categorias SET ? WHERE id = ?', [data, id], callback);
  });
}

// Eliminar categoría
function deleteCategoria(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('DELETE FROM categorias WHERE id = ?', [id], callback);
  });
}

// 👇 IMPORTANTE: exportar así
module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
