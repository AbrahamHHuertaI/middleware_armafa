const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateCustomerData } = require('../middleware/validation');

/**
 * @route POST /api/customers
 * @desc Crear un nuevo customer
 * @access Public
 */
router.post('/', validateCustomerData, customerController.createCustomer);

/**
 * @route POST /api/customers/create-or-find
 * @desc Crear o encontrar un customer basado en email
 * @access Public
 */
router.post('/create-or-find', validateCustomerData, customerController.createOrFindCustomer);

/**
 * @route GET /api/customers/:customerId
 * @desc Obtener un customer por ID
 * @access Public
 */
router.get('/:customerId', customerController.getCustomer);

/**
 * @route GET /api/customers/search/email
 * @desc Buscar customer por email
 * @access Public
 */
router.get('/search/email', customerController.findCustomerByEmail);

module.exports = router;
