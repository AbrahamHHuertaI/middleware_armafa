const openpayService = require('../services/openpayService');
const axios = require('axios');

class ChargeController {
  /**
   * Reenviar cargo a Directus
   * @param {Object} chargeData - Datos del cargo creado
   */
  async forwardChargeToDirectus(chargeData) {
    try {
      const directusUrl = process.env.WEBHOOK_CHARGE;
      const webhookToken = process.env.WEBHOOK_TOKEN;
      
      if (!directusUrl || !webhookToken) {
        console.warn('⚠️ Variables de entorno WEBHOOK_CHARGE o WEBHOOK_TOKEN no configuradas');
        return;
      }
      
      console.log('🔄 Reenviando cargo a Directus:', directusUrl);
      
      const response = await axios.post(directusUrl, chargeData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webhookToken}`
        },
        timeout: 30000
      });
      
      console.log('✅ Cargo reenviado exitosamente a Directus:', response.status);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al reenviar cargo a Directus:', error.response?.data || error.message);
      // No lanzamos el error para que el cargo principal continúe funcionando
    }
  }

  /**
   * Crear un nuevo cargo con link de pago
   */
  async createCharge(req, res, next) {
    try {
      const chargeData = req.body;
      
      // Validar datos requeridos
      if (!chargeData.method || !chargeData.amount || !chargeData.description) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'method, amount y description son requeridos'
        });
      }

      // Si se proporciona información del customer, crear o encontrar el customer
      let customer = null;
      if (chargeData.customer) {
        try {
          customer = await openpayService.createOrFindCustomer(chargeData.customer);
          console.log('Customer procesado:', customer.id);
        } catch (customerError) {
          console.error('Error al procesar customer:', customerError);
          return res.status(400).json({
            error: 'Error al procesar customer',
            message: customerError.message
          });
        }
      }

      // Preparar los datos del cargo para generar link de pago
      const chargeRequest = {
        method: chargeData.method,
        amount: chargeData.amount,
        description: chargeData.description,
        currency: chargeData.currency || 'MXN',
        order_id: chargeData.order_id || `ORD-${Date.now()}`,
        redirect_url: process.env.WEBHOOK_REDIRECT_URL,
        send_email: chargeData.send_email || false,
        confirm: 'false', // Importante: no confirmar automáticamente para generar link
        use_3d_secure: chargeData.use_3d_secure || true,
        customer: customer ? {
          id: customer.id
        } : undefined
      };

      const charge = await openpayService.createCharge(chargeRequest);
      
      // Generar el link de pago
      const paymentLink = await openpayService.generatePaymentLink(charge.id);
      
      // Preparar datos para reenvío a Directus
      const chargeResponse = {
        success: true,
        message: 'Cargo creado exitosamente',
        data: {
          charge_id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          description: charge.description,
          status: charge.status,
          order_id: charge.order_id,
          creation_date: charge.creation_date,
          payment_link: paymentLink
        },
        customer: customer ? {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          last_name: customer.last_name
        } : null
      };
      console.log('chargeResponse', chargeResponse);
      // Reenviar cargo a Directus
      await this.forwardChargeToDirectus(chargeResponse);
      
      res.status(201).json(chargeResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un cargo por ID
   */
  async getCharge(req, res, next) {
    try {
      const { chargeId } = req.params;
      
      if (!chargeId) {
        return res.status(400).json({
          error: 'ID de cargo requerido',
          message: 'El parámetro chargeId es obligatorio'
        });
      }

      const charge = await openpayService.getCharge(chargeId);
      
      res.json({
        success: true,
        data: charge
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar cargos con filtros opcionales
   */
  async listCharges(req, res, next) {
    try {
      const filters = req.query;
      
      const charges = await openpayService.listCharges(filters);
      
      res.json({
        success: true,
        data: charges,
        count: charges.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear un link de pago específicamente
   */
  async createPaymentLink(req, res, next) {
    try {
      const chargeData = req.body;
      
      // Validar datos requeridos
      if (!chargeData.method || !chargeData.amount || !chargeData.description) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'method, amount y description son requeridos'
        });
      }

      // Si se proporciona información del customer, crear o encontrar el customer
      let customer = null;
      if (chargeData.customer) {
        try {
          customer = await openpayService.createOrFindCustomer(chargeData.customer);
          console.log('Customer procesado:', customer.id);
        } catch (customerError) {
          console.error('Error al procesar customer:', customerError);
          return res.status(400).json({
            error: 'Error al procesar customer',
            message: customerError.message
          });
        }
      }

      // Preparar los datos del cargo para generar link de pago
      const chargeRequest = {
        method: chargeData.method,
        amount: chargeData.amount,
        description: chargeData.description,
        currency: chargeData.currency || 'MXN',
        order_id: chargeData.order_id || `ORD-${Date.now()}`,
        redirect_url: chargeData.redirect_url || 'https://armafa.com/Usuario/GetTransaction',
        send_email: chargeData.send_email || false,
        confirm: 'false', // Importante: no confirmar automáticamente para generar link
        use_3d_secure: chargeData.use_3d_secure || true,
        customer: customer ? {
          id: customer.id
        } : undefined
      };

      const charge = await openpayService.createCharge(chargeRequest);
      
      // Generar el link de pago
      const paymentLink = await openpayService.generatePaymentLink(charge.id);
      
      // Preparar datos para reenvío a Directus
      const chargeResponse = {
        success: true,
        message: 'Link de pago creado exitosamente',
        data: {
          charge_id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          description: charge.description,
          status: charge.status,
          order_id: charge.order_id,
          creation_date: charge.creation_date,
          payment_link: paymentLink,
          expires_at: charge.expires_at || null
        },
        customer: customer ? {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          last_name: customer.last_name
        } : null
      };
      
      // Reenviar cargo a Directus
      await this.forwardChargeToDirectus(chargeResponse);
      
      res.status(201).json(chargeResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener información de métodos de pago disponibles
   */
  async getPaymentMethods(req, res, next) {
    try {
      const paymentMethods = {
        card: {
          name: 'Tarjeta de crédito/débito',
          description: 'Pago con tarjeta Visa, Mastercard, American Express',
          supported: true
        },
        bank_account: {
          name: 'Transferencia bancaria',
          description: 'Pago mediante transferencia bancaria',
          supported: true
        },
        store: {
          name: 'Pago en tienda',
          description: 'Pago en tiendas de conveniencia',
          supported: true
        }
      };

      res.json({
        success: true,
        data: paymentMethods
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChargeController();
