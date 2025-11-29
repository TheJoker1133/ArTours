const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { authRequired } = require('../middlewares/auth');

router.get('/', authRequired, productosController.getAll);
router.get('/:id', authRequired, productosController.getById);
router.post('/', authRequired, productosController.create);
router.put('/:id', authRequired, productosController.update);
router.delete('/:id', authRequired, productosController.remove);

module.exports = router;
