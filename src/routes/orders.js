const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateRequest } = require('../middleware/validation');

/**
 * @route POST /api/orders/process
 * @desc Procesar nuevo pedido desde webhook
 * @access Public
 */
router.post('/process', orderController.processOrder);

module.exports = router;
