// src/routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/auth');
const productosController = require('../controllers/productosController');

// 👉 Endpoint público para catálogo (sin auth)
router.get('/public', productosController.publicList);


router.get('/', authRequired, productosController.getAll);
router.get('/:id', authRequired, productosController.getById);
router.post('/', authRequired, productosController.create);
router.put('/:id', authRequired, productosController.update);
router.delete('/:id', authRequired, productosController.remove);

module.exports = router;
