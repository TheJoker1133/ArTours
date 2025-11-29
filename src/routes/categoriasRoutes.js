// src/routes/categoriasRoutes.js
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { authRequired } = require('../middlewares/auth');

// Todas protegidas por JWT
router.get('/', authRequired, categoriasController.getAll);
router.get('/:id', authRequired, categoriasController.getById);
router.post('/', authRequired, categoriasController.create);
router.put('/:id', authRequired, categoriasController.update);
router.delete('/:id', authRequired, categoriasController.remove);

module.exports = router;
