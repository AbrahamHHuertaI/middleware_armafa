const express = require('express');
const webhookController = require('../controllers/webhookController');
const { validateCreateWebhook, validateUpdateWebhook, validateId } = require('../middleware/validation');
const { validateHeaders } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @route POST /api/webhooks
 * @desc Crear un nuevo webhook
 * @access Public
 */
router.post('/', validateCreateWebhook, webhookController.createWebhook);

/**
 * @route GET /api/webhooks
 * @desc Obtener webhooks activos
 * @access Public
 */
router.get('/', webhookController.getActiveWebhooks);

/**
 * @route GET /api/webhooks/:webhookId
 * @desc Obtener un webhook por ID
 * @access Public
 */
router.get('/:webhookId', validateId, webhookController.getWebhook);

/**
 * @route PUT /api/webhooks/:webhookId
 * @desc Actualizar un webhook
 * @access Public
 */
router.put('/:webhookId', validateId, validateUpdateWebhook, webhookController.updateWebhook);

/**
 * @route DELETE /api/webhooks/:webhookId
 * @desc Eliminar un webhook
 * @access Public
 */
router.delete('/:webhookId', validateId, webhookController.deleteWebhook);

/**
 * @route POST /api/webhooks/receive
 * @desc Endpoint para recibir webhooks de OpenPay
 * @access Public
 */
router.post('/receive', validateHeaders, webhookController.receiveWebhook);

/**
 * @route GET /api/webhooks/events/types
 * @desc Obtener tipos de eventos disponibles para webhooks
 * @access Public
 */
router.get('/events/types', webhookController.getWebhookEventTypes);

module.exports = router;
