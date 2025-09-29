const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { validateCheckoutData, validateQuery } = require('../middleware/validation');

/**
 * @route POST /api/checkouts
 * @desc Crear un nuevo checkout (link de pago)
 * @access Public
 */
router.post('/', validateCheckoutData, checkoutController.createCheckout);

/**
 * @route GET /api/checkouts/:checkoutId
 * @desc Obtener un checkout por ID
 * @access Public
 */
router.get('/:checkoutId', checkoutController.getCheckout);

/**
 * @route GET /api/checkouts
 * @desc Listar checkouts con filtros opcionales
 * @access Public
 */
router.get('/', validateQuery, checkoutController.listCheckouts);

/**
 * @route PUT /api/checkouts/:checkoutId
 * @desc Actualizar un checkout
 * @access Public
 */
router.put('/:checkoutId', checkoutController.updateCheckout);

module.exports = router;
