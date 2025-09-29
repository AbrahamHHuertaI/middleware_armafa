const openpayService = require('../services/openpayService');

class CustomerController {
  /**
   * Crear un nuevo customer
   */
  async createCustomer(req, res, next) {
    try {
      const customerData = req.body;
      
      // Validar datos requeridos
      if (!customerData.name || !customerData.last_name || !customerData.email) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'name, last_name y email son requeridos'
        });
      }

      const customer = await openpayService.createCustomer(customerData);
      
      res.status(201).json({
        success: true,
        message: 'Customer creado exitosamente',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear o encontrar un customer basado en email
   */
  async createOrFindCustomer(req, res, next) {
    try {
      const customerData = req.body;
      
      // Validar datos requeridos
      if (!customerData.name || !customerData.last_name || !customerData.email) {
        return res.status(400).json({
          error: 'Datos requeridos faltantes',
          message: 'name, last_name y email son requeridos'
        });
      }

      const customer = await openpayService.createOrFindCustomer(customerData);
      
      res.status(200).json({
        success: true,
        message: customer.id ? 'Customer encontrado' : 'Customer creado exitosamente',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un customer por ID
   */
  async getCustomer(req, res, next) {
    try {
      const { customerId } = req.params;
      
      if (!customerId) {
        return res.status(400).json({
          error: 'ID de customer requerido',
          message: 'El parámetro customerId es obligatorio'
        });
      }

      const customer = await openpayService.getCustomer(customerId);
      
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar customer por email
   */
  async findCustomerByEmail(req, res, next) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          error: 'Email requerido',
          message: 'El parámetro email es obligatorio'
        });
      }

      const customer = await openpayService.findCustomerByEmail(email);
      
      res.json({
        success: true,
        data: customer,
        found: !!customer
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
