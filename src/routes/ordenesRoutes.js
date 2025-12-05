// src/routes/ordenesRoutes.js
const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/auth');
const ordenesController = require('../controllers/ordenesController');

// Crear nueva orden
router.post('/', authRequired, ordenesController.crear);

// Pedidos del usuario logueado
router.get('/mias', authRequired, ordenesController.listMine);

// TODAS las órdenes (solo admin)
router.get('/', authRequired, ordenesController.listAll);

module.exports = router;
