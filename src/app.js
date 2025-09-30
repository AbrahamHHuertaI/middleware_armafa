const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const { validateRequest } = require('./middleware/validation');
const chargeRoutes = require('./routes/charges');
const webhookRoutes = require('./routes/webhooks');
const customerRoutes = require('./routes/customers');
const checkoutRoutes = require('./routes/checkouts');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.API_RATE_LIMIT || 100,
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.get('/', (req, res) => {
  res.json({
    message: 'OpenPay Middleware API',
    version: '1.0.0',
    status: 'active'
  });
});

// Rutas de la API
app.use('/api/charges', chargeRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/checkouts', checkoutRoutes);
app.use('/api/orders', orderRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

module.exports = app;
