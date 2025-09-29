const openpayService = require('../services/openpayService');

class CheckoutController {
  /**
   * Crear un checkout (link de pago) con customer management automático
   */
  async createCheckout(req, res, next) {
    try {
      const checkoutData = req.body;
      
      // Validar datos requeridos
      if (!checkoutData.amount || !checkoutData.description) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'amount y description son requeridos'
        });
      }

      // Si se proporciona información del customer, crear o encontrar el customer
      let customer = null;
      if (checkoutData.customer) {
        try {
          customer = await openpayService.createOrFindCustomer(checkoutData.customer);
          console.log('Customer procesado:', customer.id);
        } catch (customerError) {
          console.error('Error al procesar customer:', customerError);
          return res.status(400).json({
            error: 'Error al procesar customer',
            message: customerError.message
          });
        }
      }

      // Crear el checkout o cargo
      let result;
      if (customer) {
        // Para customers existentes, usar charges - preparar datos específicos para charges
        const chargeRequest = {
          amount: checkoutData.amount,
          currency: checkoutData.currency || 'MXN',
          description: checkoutData.description,
          order_id: checkoutData.order_id || `ORD-${Date.now()}`,
          // Campos requeridos para charges
          source_id: checkoutData.source_id || checkoutData.card_id,
          method: checkoutData.method || 'card',
          device_session_id: checkoutData.device_session_id,
          // Campo confirm para determinar si procesar inmediatamente o crear pendiente
          confirm: checkoutData.confirm !== undefined ? checkoutData.confirm : false,
          send_email: checkoutData.send_email || false,
          redirect_url: checkoutData.redirect_url
        };
        
        // Remover campos undefined
        Object.keys(chargeRequest).forEach(key => {
          if (chargeRequest[key] === undefined) {
            delete chargeRequest[key];
          }
        });
        
        result = await openpayService.createCustomerCharge(customer.id, chargeRequest);
      } else {
        // Para nuevos customers, usar checkouts - preparar datos específicos para checkouts
        const checkoutRequest = {
          amount: checkoutData.amount,
          currency: checkoutData.currency || 'MXN',
          description: checkoutData.description,
          order_id: checkoutData.order_id || `ORD-${Date.now()}`,
          redirect_url: checkoutData.redirect_url || 'https://armafa.com/Usuario/GetTransaction',
          expiration_date: checkoutData.expiration_date || null,
          send_email: checkoutData.send_email || 'true',
          customer: checkoutData.customer
        };
        
        result = await openpayService.createCheckout(checkoutRequest);
      }
      
      res.status(201).json({
        success: true,
        message: customer ? 'Cargo creado exitosamente' : 'Checkout creado exitosamente',
        data: {
          id: result.id,
          amount: result.amount,
          currency: result.currency,
          description: result.description,
          order_id: result.order_id,
          status: result.status,
          payment_url: result.payment_url || result.payment_method?.url,
          expiration_date: result.expiration_date,
          creation_date: result.creation_date,
          type: customer ? 'charge' : 'checkout'
        },
        customer: customer ? {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          last_name: customer.last_name
        } : null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un checkout por ID
   */
  async getCheckout(req, res, next) {
    try {
      const { checkoutId } = req.params;
      
      if (!checkoutId) {
        return res.status(400).json({
          error: 'ID de checkout requerido',
          message: 'El parámetro checkoutId es obligatorio'
        });
      }

      const checkout = await openpayService.getCheckout(checkoutId);
      
      res.json({
        success: true,
        data: checkout
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar checkouts con filtros opcionales
   */
  async listCheckouts(req, res, next) {
    try {
      const filters = req.query;
      
      const checkouts = await openpayService.listCheckouts(filters);
      
      res.json({
        success: true,
        data: checkouts,
        count: checkouts.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar un checkout
   */
  async updateCheckout(req, res, next) {
    try {
      const { checkoutId } = req.params;
      const { status, expiration_date } = req.body;
      
      if (!checkoutId) {
        return res.status(400).json({
          error: 'ID de checkout requerido',
          message: 'El parámetro checkoutId es obligatorio'
        });
      }

      if (!status) {
        return res.status(400).json({
          error: 'Estado requerido',
          message: 'El campo status es obligatorio'
        });
      }

      const updateData = {};
      if (expiration_date) {
        updateData.expiration_date = expiration_date;
      }

      const checkout = await openpayService.updateCheckout(checkoutId, status, updateData);
      
      res.json({
        success: true,
        message: 'Checkout actualizado exitosamente',
        data: checkout
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CheckoutController();
