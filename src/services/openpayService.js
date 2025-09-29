const Openpay = require('openpay');

class OpenPayService {
  constructor() {
    this.openpay = new Openpay(
      process.env.OPENPAY_MERCHANT_ID,
      process.env.OPENPAY_PRIVATE_KEY,
      process.env.OPENPAY_PRODUCTION === 'true'
    );
  }

  /**
   * Crear un cargo
   * @param {Object} chargeData - Datos del cargo
   * @returns {Promise<Object>} Respuesta del cargo
   */
  async createCharge(chargeData) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.charges.create(chargeData, (error, charge) => {
          if (error) {
            reject(error);
          } else {
            resolve(charge);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al crear cargo: ${error.message}`);
    }
  }

  /**
   * Obtener un cargo por ID
   * @param {string} chargeId - ID del cargo
   * @returns {Promise<Object>} Datos del cargo
   */
  async getCharge(chargeId) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.charges.get(chargeId, (error, charge) => {
          if (error) {
            reject(error);
          } else {
            resolve(charge);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener cargo: ${error.message}`);
    }
  }

  /**
   * Listar todos los cargos
   * @param {Object} filters - Filtros para la búsqueda
   * @returns {Promise<Object>} Lista de cargos
   */
  async listCharges(filters = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.charges.list(filters, (error, charges) => {
          if (error) {
            reject(error);
          } else {
            resolve(charges);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al listar cargos: ${error.message}`);
    }
  }

  /**
   * Crear un webhook
   * @param {Object} webhookData - Datos del webhook
   * @returns {Promise<Object>} Respuesta del webhook
   */
  async createWebhook(webhookData) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.webhooks.create(webhookData, (error, webhook) => {
          if (error) {
            reject(error);
          } else {
            resolve(webhook);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al crear webhook: ${error.message}`);
    }
  }

  /**
   * Obtener webhooks activos
   * @returns {Promise<Array>} Lista de webhooks activos
   */
  async getActiveWebhooks() {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.webhooks.list((error, webhooks) => {
          if (error) {
            reject(error);
          } else {
            resolve(webhooks);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener webhooks: ${error.message}`);
    }
  }

  /**
   * Obtener un webhook por ID
   * @param {string} webhookId - ID del webhook
   * @returns {Promise<Object>} Datos del webhook
   */
  async getWebhook(webhookId) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.webhooks.get(webhookId, (error, webhook) => {
          if (error) {
            reject(error);
          } else {
            resolve(webhook);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener webhook: ${error.message}`);
    }
  }

  /**
   * Actualizar un webhook
   * @param {string} webhookId - ID del webhook
   * @param {Object} updateData - Datos para actualizar
   * @returns {Promise<Object>} Respuesta de la actualización
   */
  async updateWebhook(webhookId, updateData) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.webhooks.update(webhookId, updateData, (error, webhook) => {
          if (error) {
            reject(error);
          } else {
            resolve(webhook);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al actualizar webhook: ${error.message}`);
    }
  }

  /**
   * Eliminar un webhook
   * @param {string} webhookId - ID del webhook
   * @returns {Promise<Object>} Respuesta de eliminación
   */
  async deleteWebhook(webhookId) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.webhooks.delete(webhookId, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al eliminar webhook: ${error.message}`);
    }
  }

  /**
   * Verificar la firma del webhook
   * @param {string} payload - Payload del webhook
   * @param {string} signature - Firma del webhook
   * @returns {boolean} Verdadero si la firma es válida
   */
  verifyWebhookSignature(payload, signature) {
    try {
      return this.openpay.webhooks.verifySignature(payload, signature);
    } catch (error) {
      console.error('Error al verificar firma del webhook:', error);
      return false;
    }
  }

  /**
   * Crear un customer
   * @param {Object} customerData - Datos del customer
   * @returns {Promise<Object>} Respuesta del customer creado
   */
  async createCustomer(customerData) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.customers.create(customerData, (error, customer) => {
          if (error) {
            reject(error);
          } else {
            resolve(customer);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al crear customer: ${error.message}`);
    }
  }

  /**
   * Buscar un customer por email
   * @param {string} email - Email del customer
   * @returns {Promise<Object|null>} Datos del customer o null si no existe
   */
  async findCustomerByEmail(email) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.customers.list({ email: email }, (error, customers) => {
          if (error) {
            reject(error);
          } else {
            // Retornar el primer customer encontrado o null
            resolve(customers && customers.length > 0 ? customers[0] : null);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al buscar customer: ${error.message}`);
    }
  }

  /**
   * Obtener un customer por ID
   * @param {string} customerId - ID del customer
   * @returns {Promise<Object>} Datos del customer
   */
  async getCustomer(customerId) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.customers.get(customerId, (error, customer) => {
          if (error) {
            reject(error);
          } else {
            resolve(customer);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener customer: ${error.message}`);
    }
  }

  /**
   * Generar link de pago para un cargo
   * @param {string} chargeId - ID del cargo
   * @returns {Promise<string>} URL del link de pago
   */
  async generatePaymentLink(chargeId) {
    try {
      // En OpenPay, el link de pago se genera automáticamente cuando se crea un cargo
      // con confirm: false. El link está disponible en la respuesta del cargo.
      const charge = await this.getCharge(chargeId);
      
      if (charge && charge.payment_method && charge.payment_method.url) {
        return charge.payment_method.url;
      }
      
      // Si no hay URL en el cargo, generar una URL de pago manual
      const baseUrl = process.env.OPENPAY_PRODUCTION === 'true' 
        ? 'https://dashboard.openpay.mx' 
        : 'https://sandbox-dashboard.openpay.mx';
      
      return `${baseUrl}/paynet-pdf/${chargeId}`;
    } catch (error) {
      throw new Error(`Error al generar link de pago: ${error.message}`);
    }
  }

  /**
   * Crear o encontrar un customer basado en email
   * @param {Object} customerData - Datos del customer
   * @returns {Promise<Object>} Customer existente o nuevo
   */
  async createOrFindCustomer(customerData) {
    try {
      // Primero buscar si el customer ya existe por email
      const existingCustomer = await this.findCustomerByEmail(customerData.email);
      
      if (existingCustomer) {
        console.log('Customer existente encontrado:', existingCustomer.id);
        return existingCustomer;
      }

      // Si no existe, crear uno nuevo
      console.log('Creando nuevo customer...');
      const newCustomer = await this.createCustomer(customerData);
      return newCustomer;
    } catch (error) {
      throw new Error(`Error al crear o encontrar customer: ${error.message}`);
    }
  }

  /**
   * Crear un checkout (link de pago)
   * @param {Object} checkoutData - Datos del checkout
   * @returns {Promise<Object>} Respuesta del checkout creado
   */
  async createCheckout(checkoutData) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.checkouts.create(checkoutData, (error, checkout) => {
          if (error) {
            reject(error);
          } else {
            resolve(checkout);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al crear checkout: ${error.message}`);
    }
  }

  /**
   * Crear un cargo para un customer existente
   * @param {string} customerId - ID del customer
   * @param {Object} chargeData - Datos del cargo
   * @returns {Promise<Object>} Respuesta del cargo creado
   */
  async createCustomerCharge(customerId, chargeData) {
    try {
      return new Promise((resolve, reject) => {
        console.log('Creando cargo para customer:', customerId);
        console.log('Datos del cargo:', chargeData);
        console.log(this.openpay)
        this.openpay.customers.charges.create(customerId, chargeData, (error, charge) => {
          if (error) {
            reject(error);
          } else {
            resolve(charge);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al crear cargo de customer: ${error.message}`);
    }
  }

  /**
   * Obtener un checkout por ID
   * @param {string} checkoutId - ID del checkout
   * @returns {Promise<Object>} Datos del checkout
   */
  async getCheckout(checkoutId) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.checkouts.get(checkoutId, (error, checkout) => {
          if (error) {
            reject(error);
          } else {
            resolve(checkout);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener checkout: ${error.message}`);
    }
  }

  /**
   * Listar checkouts con filtros
   * @param {Object} filters - Filtros para la búsqueda
   * @returns {Promise<Object>} Lista de checkouts
   */
  async listCheckouts(filters = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.checkouts.list(filters, (error, checkouts) => {
          if (error) {
            reject(error);
          } else {
            resolve(checkouts);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al listar checkouts: ${error.message}`);
    }
  }

  /**
   * Actualizar un checkout
   * @param {string} checkoutId - ID del checkout
   * @param {string} status - Nuevo estado del checkout
   * @param {Object} data - Datos adicionales para actualizar
   * @returns {Promise<Object>} Respuesta de la actualización
   */
  async updateCheckout(checkoutId, status, data = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.openpay.checkouts.update(checkoutId, status, data, (error, checkout) => {
          if (error) {
            reject(error);
          } else {
            resolve(checkout);
          }
        });
      });
    } catch (error) {
      throw new Error(`Error al actualizar checkout: ${error.message}`);
    }
  }
}

module.exports = new OpenPayService();
