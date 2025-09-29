const openpayService = require('../services/openpayService');
const axios = require('axios');

class WebhookController {
  /**
   * Reenviar webhook a Directus
   * @param {Object} webhookData - Datos completos del webhook
   */
  async forwardToDirectus(webhookData) {
    try {
      const directusUrl = process.env.WEBHOOK_DIRECTUS;
      const webhookToken = process.env.WEBHOOK_TOKEN;
      
      if (!directusUrl || !webhookToken) {
        console.warn('⚠️ Variables de entorno WEBHOOK_DIRECTUS o WEBHOOK_TOKEN no configuradas');
        return;
      }
      
      console.log('🔄 Reenviando webhook a Directus:', directusUrl);
      
      const response = await axios.post(directusUrl, webhookData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webhookToken}`
        },
        timeout: 30000
      });
      
      console.log('✅ Webhook reenviado exitosamente a Directus:', response.status);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al reenviar webhook a Directus:', error.response?.data || error.message);
      // No lanzamos el error para que el webhook principal continúe funcionando
    }
  }

  /**
   * Crear un nuevo webhook
   */
  async createWebhook(req, res, next) {
    try {
      const { url, events, user, password } = req.body;
      
      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'url y events (array) son requeridos. Internamente se convierte a event_types para OpenPay'
        });
      }

      const webhookData = {
        url,
        events
      };

      // Agregar credenciales si están presentes
      if (user) webhookData.user = user;
      if (password) webhookData.password = password;

      console.log('📤 Enviando datos de webhook a OpenPay:', webhookData);

      const webhook = await openpayService.createWebhook(webhookData);
      
      res.status(201).json({
        success: true,
        message: 'Webhook creado exitosamente',
        data: webhook
      });
    } catch (error) {
      console.error('❌ Error al crear webhook:', error);
      next(error);
    }
  }

  /**
   * Obtener webhooks activos
   */
  async getActiveWebhooks(req, res, next) {
    try {
      const webhooks = await openpayService.getActiveWebhooks();
      
      res.json({
        success: true,
        data: webhooks,
        count: webhooks.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un webhook por ID
   */
  async getWebhook(req, res, next) {
    try {
      const { webhookId } = req.params;
      
      if (!webhookId) {
        return res.status(400).json({
          error: 'ID de webhook requerido',
          message: 'El parámetro webhookId es obligatorio'
        });
      }

      const webhook = await openpayService.getWebhook(webhookId);
      
      res.json({
        success: true,
        data: webhook
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar un webhook
   */
  async updateWebhook(req, res, next) {
    try {
      const { webhookId } = req.params;
      const { url, events, user, password } = req.body;
      
      if (!webhookId) {
        return res.status(400).json({
          error: 'ID de webhook requerido',
          message: 'El parámetro webhookId es obligatorio'
        });
      }

      const updateData = {};
      if (url) updateData.url = url;
      if (events) updateData.events = events;
      if (user) updateData.user = user;
      if (password) updateData.password = password;

      const webhook = await openpayService.updateWebhook(webhookId, updateData);
      
      res.json({
        success: true,
        message: 'Webhook actualizado exitosamente',
        data: webhook
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un webhook
   */
  async deleteWebhook(req, res, next) {
    try {
      const { webhookId } = req.params;
      
      if (!webhookId) {
        return res.status(400).json({
          error: 'ID de webhook requerido',
          message: 'El parámetro webhookId es obligatorio'
        });
      }

      const result = await openpayService.deleteWebhook(webhookId);
      
      res.json({
        success: true,
        message: 'Webhook eliminado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint para recibir webhooks de OpenPay
   */
  async receiveWebhook(req, res, next) {
    try {
     

      const webhookData = req.body;
      
      // Log del webhook recibido
      console.log('📨 Webhook recibido:', {
        type: webhookData.type,
        id: webhookData.id,
        timestamp: new Date().toISOString(),
        data: webhookData
      });

      // Procesar el webhook según su tipo
      await this.processWebhook(webhookData);

      res.status(200).json({
        success: true,
        message: 'Webhook procesado exitosamente'
      });
    } catch (error) {
      console.error('Error al procesar webhook:', error);
      next(error);
    }
  }

  /**
   * Procesar el webhook según su tipo
   */
  async processWebhook(webhookData) {
    try {
      const { type, data } = webhookData;
      
      // Reenviar el webhook completo a Directus
      await this.forwardToDirectus(webhookData);
      
      switch (type) {
        case 'charge.succeeded':
          await this.handleChargeSucceeded(data, webhookData);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(data, webhookData);
          break;
        case 'charge.cancelled':
          await this.handleChargeCancelled(data, webhookData);
          break;
        case 'charge.refunded':
          await this.handleChargeRefunded(data, webhookData);
          break;
        case 'payout.created':
          await this.handlePayoutCreated(data, webhookData);
          break;
        case 'payout.succeeded':
          await this.handlePayoutSucceeded(data, webhookData);
          break;
        case 'payout.failed':
          await this.handlePayoutFailed(data, webhookData);
          break;
        default:
          console.log(`Tipo de webhook no manejado: ${type}`);
      }
    } catch (error) {
      console.error('Error al procesar webhook:', error);
      throw error;
    }
  }

  /**
   * Manejar cargo exitoso
   */
  async handleChargeSucceeded(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para cargos exitosos
    // Por ejemplo: actualizar base de datos, enviar email de confirmación, etc.
  }

  /**
   * Manejar cargo fallido
   */
  async handleChargeFailed(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para cargos fallidos
    // Por ejemplo: notificar al usuario, registrar en logs, etc.
  }

  /**
   * Manejar cargo cancelado
   */
  async handleChargeCancelled(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para cargos cancelados
  }

  /**
   * Manejar cargo reembolsado
   */
  async handleChargeRefunded(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para reembolsos
  }

  /**
   * Manejar payout creado
   */
  async handlePayoutCreated(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para payouts creados
  }

  /**
   * Manejar payout exitoso
   */
  async handlePayoutSucceeded(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para payouts exitosos
  }

  /**
   * Manejar payout fallido
   */
  async handlePayoutFailed(data, webhookData) {
    console.log('📋 Webhook completo:', JSON.stringify(webhookData, null, 2));
    // Aquí puedes agregar lógica específica para payouts fallidos
  }

  /**
   * Obtener tipos de eventos disponibles para webhooks
   */
  async getWebhookEventTypes(req, res, next) {
    try {
      const eventTypes = [
        'charge.succeeded',
        'charge.failed',
        'charge.cancelled',
        'charge.refunded',
        'payout.created',
        'payout.succeeded',
        'payout.failed',
        'subscription.created',
        'subscription.updated',
        'subscription.cancelled',
        'subscription.succeeded',
        'subscription.failed'
      ];

      res.json({
        success: true,
        data: eventTypes,
        description: 'Tipos de eventos disponibles para webhooks'
      });
    } catch (error) {
      next(error);
    }
  }
}

// Crear instancia y bindear métodos para mantener el contexto
const webhookController = new WebhookController();

// Bindear todos los métodos para mantener el contexto de 'this'
const boundController = {
  createWebhook: webhookController.createWebhook.bind(webhookController),
  getActiveWebhooks: webhookController.getActiveWebhooks.bind(webhookController),
  getWebhook: webhookController.getWebhook.bind(webhookController),
  updateWebhook: webhookController.updateWebhook.bind(webhookController),
  deleteWebhook: webhookController.deleteWebhook.bind(webhookController),
  receiveWebhook: webhookController.receiveWebhook.bind(webhookController),
  processWebhook: webhookController.processWebhook.bind(webhookController),
  forwardToDirectus: webhookController.forwardToDirectus.bind(webhookController),
  handleChargeSucceeded: webhookController.handleChargeSucceeded.bind(webhookController),
  handleChargeFailed: webhookController.handleChargeFailed.bind(webhookController),
  handleChargeCancelled: webhookController.handleChargeCancelled.bind(webhookController),
  handleChargeRefunded: webhookController.handleChargeRefunded.bind(webhookController),
  handlePayoutCreated: webhookController.handlePayoutCreated.bind(webhookController),
  handlePayoutSucceeded: webhookController.handlePayoutSucceeded.bind(webhookController),
  handlePayoutFailed: webhookController.handlePayoutFailed.bind(webhookController),
  getWebhookEventTypes: webhookController.getWebhookEventTypes.bind(webhookController)
};

module.exports = boundController;
