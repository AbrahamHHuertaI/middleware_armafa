const Joi = require('joi');

/**
 * Middleware de validación para crear cargos con link de pago
 */
const validateCreateCharge = (req, res, next) => {
  const schema = Joi.object({
    method: Joi.string().valid('card', 'bank_account', 'store').required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().min(1).max(250).required(),
    currency: Joi.string().valid('MXN', 'USD').default('MXN'),
    order_id: Joi.string().optional(),
    redirect_url: Joi.string().uri().optional(),
    customer: Joi.object({
      name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().optional(),
      address: Joi.object({
        line1: Joi.string().optional(),
        line2: Joi.string().optional(),
        line3: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        country_code: Joi.string().length(2).default('MX')
      }).optional()
    }).optional(),
    confirm: Joi.boolean().default(false),
    send_email: Joi.boolean().default(false),
    use_3d_secure: Joi.boolean().default(true)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de validación inválidos',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

/**
 * Middleware de validación para crear webhooks
 */
const validateCreateWebhook = (req, res, next) => {
  const schema = Joi.object({
    url: Joi.string().uri().required(),
    user: Joi.string().optional(),
    password: Joi.string().optional(),
    events: Joi.array().items(
      Joi.string().valid(
        'charge.refunded',
        'charge.failed',
        'charge.cancelled',
        'charge.created',
        'charge.succeeded',
        'charge.rescored.to.decline',
        'subscription.charge.failed',
        'payout.created',
        'payout.succeeded',
        'payout.failed',
        'transfer.succeeded',
        'fee.succeeded',
        'fee.refund.succeeded',
        'spei.received',
        'chargeback.created',
        'chargeback.rejected',
        'chargeback.accepted',
        'order.created',
        'order.activated',
        'order.payment.received',
        'order.completed',
        'order.expired',
        'order.cancelled',
        'order.payment.cancelled',
        'subscription.created',
        'subscription.updated',
        'subscription.cancelled',
        'subscription.succeeded',
        'subscription.failed'
      )
    ).min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de webhook inválidos',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

/**
 * Middleware de validación para actualizar webhooks
 */
const validateUpdateWebhook = (req, res, next) => {
  const schema = Joi.object({
    url: Joi.string().uri().optional(),
    user: Joi.string().optional(),
    password: Joi.string().optional(),
    events: Joi.array().items(
      Joi.string().valid(
        'charge.refunded',
        'charge.failed',
        'charge.cancelled',
        'charge.created',
        'charge.succeeded',
        'charge.rescored.to.decline',
        'subscription.charge.failed',
        'payout.created',
        'payout.succeeded',
        'payout.failed',
        'transfer.succeeded',
        'fee.succeeded',
        'fee.refund.succeeded',
        'spei.received',
        'chargeback.created',
        'chargeback.rejected',
        'chargeback.accepted',
        'order.created',
        'order.activated',
        'order.payment.received',
        'order.completed',
        'order.expired',
        'order.cancelled',
        'order.payment.cancelled',
        'subscription.created',
        'subscription.updated',
        'subscription.cancelled',
        'subscription.succeeded',
        'subscription.failed'
      )
    ).min(1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de webhook inválidos',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

/**
 * Middleware de validación para parámetros de ID
 */
const validateId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().min(1).required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El parámetro ID es requerido y debe ser válido'
    });
  }

  next();
};

/**
 * Middleware de validación para crear checkouts y charges
 */
const validateCheckoutData = (req, res, next) => {
  const schema = Joi.object({
    // Campos básicos requeridos
    amount: Joi.number().positive().required(),
    description: Joi.string().min(1).max(250).required(),
    currency: Joi.string().valid('MXN', 'USD', 'COP', 'PEN').default('MXN'),
    order_id: Joi.string().optional(),
    
    // Campos para checkouts
    redirect_url: Joi.string().uri().optional(),
    expiration_date: Joi.string().optional(),
    send_email: Joi.alternatives().try(
      Joi.string().valid('true', 'false'),
      Joi.boolean()
    ).default('true'),
    
    // Campos para charges
    source_id: Joi.string().optional(),
    card_id: Joi.string().optional(), // Alias para source_id
    method: Joi.string().valid('card', 'bank_account', 'store').optional(),
    device_session_id: Joi.string().optional(),
    confirm: Joi.boolean().default(false),
    
    // Información del customer
    customer: Joi.object({
      name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().optional(),
      address: Joi.object({
        line1: Joi.string().optional(),
        line2: Joi.string().optional(),
        line3: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        country_code: Joi.string().length(2).default('MX')
      }).optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de checkout inválidos',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

/**
 * Middleware de validación para datos de customer
 */
const validateCustomerData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().optional(),
    address: Joi.object({
      line1: Joi.string().optional(),
      line2: Joi.string().optional(),
      line3: Joi.string().optional(),
      postal_code: Joi.string().optional(),
      state: Joi.string().optional(),
      city: Joi.string().optional(),
      country_code: Joi.string().length(2).default('MX')
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de customer inválidos',
      message: error.details[0].message,
      details: error.details
    });
  }

  next();
};

/**
 * Middleware de validación para query parameters
 */
const validateQuery = (req, res, next) => {
  const schema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10),
    offset: Joi.number().integer().min(0).default(0),
    creation: Joi.string().optional(),
    creation_gte: Joi.string().optional(),
    creation_lte: Joi.string().optional(),
    amount: Joi.number().optional(),
    amount_gte: Joi.number().optional(),
    amount_lte: Joi.number().optional(),
    status: Joi.string().valid('in_progress', 'completed', 'failed', 'cancelled', 'refunded').optional(),
    email: Joi.string().email().optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      error: 'Parámetros de consulta inválidos',
      message: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateCreateCharge,
  validateCreateWebhook,
  validateUpdateWebhook,
  validateId,
  validateQuery,
  validateCustomerData,
  validateCheckoutData
};
