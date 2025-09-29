const openpayService = require('../services/openpayService');

class WebhookController {
  /**
   * Crear un nuevo webhook
   */
  async createWebhook(req, res, next) {
    try {
      const { url, events } = req.body;
      
      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'url y events (array) son requeridos'
        });
      }

      const webhookData = {
        url,
        events
      };

      const webhook = await openpayService.createWebhook(webhookData);
      
      res.status(201).json({
        success: true,
        message: 'Webhook creado exitosamente',
        data: webhook
      });
    } catch (error) {
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
      const signature = req.headers['x-openpay-signature'];
      const payload = JSON.stringify(req.body);
      
      // Verificar la firma del webhook
      const isValidSignature = openpayService.verifyWebhookSignature(payload, signature);
      
      if (!isValidSignature) {
        return res.status(401).json({
          error: 'Firma inválida',
          message: 'La firma del webhook no es válida'
        });
      }

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
      
      switch (type) {
        case 'charge.succeeded':
          await this.handleChargeSucceeded(data);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(data);
          break;
        case 'charge.cancelled':
          await this.handleChargeCancelled(data);
          break;
        case 'charge.refunded':
          await this.handleChargeRefunded(data);
          break;
        case 'payout.created':
          await this.handlePayoutCreated(data);
          break;
        case 'payout.succeeded':
          await this.handlePayoutSucceeded(data);
          break;
        case 'payout.failed':
          await this.handlePayoutFailed(data);
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
  async handleChargeSucceeded(data) {
    console.log('✅ Cargo exitoso:', data.id);
    // Aquí puedes agregar lógica específica para cargos exitosos
    // Por ejemplo: actualizar base de datos, enviar email de confirmación, etc.
  }

  /**
   * Manejar cargo fallido
   */
  async handleChargeFailed(data) {
    console.log('❌ Cargo fallido:', data.id);
    // Aquí puedes agregar lógica específica para cargos fallidos
    // Por ejemplo: notificar al usuario, registrar en logs, etc.
  }

  /**
   * Manejar cargo cancelado
   */
  async handleChargeCancelled(data) {
    console.log('🚫 Cargo cancelado:', data.id);
    // Aquí puedes agregar lógica específica para cargos cancelados
  }

  /**
   * Manejar cargo reembolsado
   */
  async handleChargeRefunded(data) {
    console.log('💰 Cargo reembolsado:', data.id);
    // Aquí puedes agregar lógica específica para reembolsos
  }

  /**
   * Manejar payout creado
   */
  async handlePayoutCreated(data) {
    console.log('📤 Payout creado:', data.id);
    // Aquí puedes agregar lógica específica para payouts creados
  }

  /**
   * Manejar payout exitoso
   */
  async handlePayoutSucceeded(data) {
    console.log('✅ Payout exitoso:', data.id);
    // Aquí puedes agregar lógica específica para payouts exitosos
  }

  /**
   * Manejar payout fallido
   */
  async handlePayoutFailed(data) {
    console.log('❌ Payout fallido:', data.id);
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

module.exports = new WebhookController();
