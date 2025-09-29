const express = require('express');
const chargeController = require('../controllers/chargeController');
const { validateCreateCharge, validateQuery } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/charges
 * @desc Crear un nuevo cargo
 * @access Public
 */
router.post('/', validateCreateCharge, chargeController.createCharge);

/**
 * @route GET /api/charges/:chargeId
 * @desc Obtener un cargo por ID
 * @access Public
 */
router.get('/:chargeId', chargeController.getCharge);

/**
 * @route GET /api/charges
 * @desc Listar cargos con filtros opcionales
 * @access Public
 */
router.get('/', validateQuery, chargeController.listCharges);

/**
 * @route GET /api/charges/methods/payment
 * @desc Obtener métodos de pago disponibles
 * @access Public
 */
router.get('/methods/payment', chargeController.getPaymentMethods);

/**
 * @route POST /api/charges/payment-link
 * @desc Crear un link de pago específicamente
 * @access Public
 */
router.post('/payment-link', validateCreateCharge, chargeController.createPaymentLink);

module.exports = router;
