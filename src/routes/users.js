// src/routes/users.js
const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');
const { authRequired } = require('../middlewares/auth');

// Protegemos CRUD con JWT (solo autenticados)
router.get('/', authRequired, usuariosController.getAll);
router.get('/:id', authRequired, usuariosController.getById);
router.post('/', authRequired, usuariosController.create);
router.put('/:id', authRequired, usuariosController.update);
router.delete('/:id', authRequired, usuariosController.remove);

module.exports = router;
