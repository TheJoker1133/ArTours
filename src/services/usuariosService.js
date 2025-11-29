// src/services/usuariosService.js

function getAllUsuarios(req, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM usuarios', callback);
  });
}

function getUsuarioById(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('SELECT * FROM usuarios WHERE id = ?', [id], callback);
  });
}

function createUsuario(req, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('INSERT INTO usuarios SET ?', data, callback);
  });
}

function updateUsuario(req, id, data, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('UPDATE usuarios SET ? WHERE id = ?', [data, id], callback);
  });
}

function deleteUsuario(req, id, callback) {
  req.getConnection((err, conn) => {
    if (err) return callback(err);
    conn.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  });
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
