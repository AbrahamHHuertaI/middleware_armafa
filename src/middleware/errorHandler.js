/**
 * Middleware de manejo de errores global
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de OpenPay
  if (err.error_code) {
    return res.status(err.http_code || 400).json({
      error: 'Error de OpenPay',
      message: err.description || err.message,
      code: err.error_code,
      category: err.category,
      request_id: err.request_id
    });
  }

  // Error de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Error de validación',
      message: 'Los datos proporcionados no son válidos',
      details: err.details
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Error de sintaxis JSON',
      message: 'El JSON enviado no es válido'
    });
  }

  // Error de conexión
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Error de conexión',
      message: 'No se pudo conectar con el servicio externo'
    });
  }

  // Error de timeout
  if (err.code === 'ETIMEDOUT') {
    return res.status(504).json({
      error: 'Timeout',
      message: 'La operación tardó demasiado tiempo'
    });
  }

  // Error interno del servidor
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error interno' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Middleware para logging de requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * Middleware para validar headers requeridos
 */
const validateHeaders = (req, res, next) => {
  // Solo aplicar en rutas de webhook
  if (req.path.includes('/webhooks/receive')) {
    const signature = req.headers['x-openpay-signature'];
    if (!signature) {
      return res.status(401).json({
        error: 'Header requerido faltante',
        message: 'El header x-openpay-signature es requerido'
      });
    }
  }
  
  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  validateHeaders
};
