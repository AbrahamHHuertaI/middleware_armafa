# OpenPay Middleware API

Una aplicación Node.js con Express bien estructurada para integrar con OpenPay, que permite crear cargos, gestionar webhooks y procesar notificaciones de pagos.

## 🚀 Características

- ✅ Crear cargos con diferentes métodos de pago
- ✅ **Generar checkouts (links de pago)** usando la API oficial de OpenPay
- ✅ Gestión automática de customers (crear o encontrar existentes)
- ✅ Gestionar webhooks de OpenPay
- ✅ Validación robusta de datos
- ✅ Manejo de errores centralizado
- ✅ Middleware de seguridad
- ✅ Rate limiting
- ✅ Logging estructurado
- ✅ Documentación completa

## 📋 Requisitos

- Node.js >= 16.0.0
- npm o yarn
- Cuenta de OpenPay con credenciales

## 🛠️ Instalación

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio>
cd openpay-middleware
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp env.example .env
```

4. **Editar el archivo `.env` con tus credenciales de OpenPay:**
```env
OPENPAY_MERCHANT_ID=tu_merchant_id_aqui
OPENPAY_PRIVATE_KEY=tu_private_key_aqui
OPENPAY_PUBLIC_KEY=tu_public_key_aqui
OPENPAY_PRODUCTION=false
PORT=3000
NODE_ENV=development
```

## 🏃‍♂️ Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Cargos (Charges)

#### Crear un cargo con link de pago
```http
POST /api/charges
Content-Type: application/json

{
  "method": "card",
  "amount": 100.00,
  "description": "Pago de prueba",
  "currency": "MXN",
  "order_id": "ORD-12345",
  "redirect_url": "https://armafa.com/Usuario/GetTransaction",
  "customer": {
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

### Checkouts (Links de Pago)

#### Crear un checkout
```http
POST /api/checkouts
Content-Type: application/json

{
  "amount": 100.00,
  "description": "Pago de prueba",
  "currency": "MXN",
  "order_id": "ORD-12345",
  "redirect_url": "https://armafa.com/Usuario/GetTransaction",
  "send_email": "true",
  "customer": {
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

#### Obtener un checkout
```http
GET /api/checkouts/{checkoutId}
```

#### Listar checkouts
```http
GET /api/checkouts?limit=10&offset=0
```

#### Actualizar un checkout
```http
PUT /api/checkouts/{checkoutId}
Content-Type: application/json

{
  "status": "available",
  "expiration_date": "2024-12-31 23:59"
}
```

#### Obtener un cargo
```http
GET /api/charges/{chargeId}
```

#### Listar cargos
```http
GET /api/charges?limit=10&offset=0&status=completed
```

#### Obtener métodos de pago
```http
GET /api/charges/methods/payment
```

### Customers

#### Crear un customer
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Juan",
  "last_name": "Pérez",
  "email": "juan@ejemplo.com",
  "phone_number": "5551234567"
}
```

#### Crear o encontrar customer por email
```http
POST /api/customers/create-or-find
Content-Type: application/json

{
  "name": "Juan",
  "last_name": "Pérez",
  "email": "juan@ejemplo.com",
  "phone_number": "5551234567"
}
```

#### Obtener un customer por ID
```http
GET /api/customers/{customerId}
```

#### Buscar customer por email
```http
GET /api/customers/search/email?email=juan@ejemplo.com
```

### Webhooks

#### Crear un webhook
```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://tu-dominio.com/api/webhooks/receive",
  "user": "webhook_user",
  "password": "webhook_password",
  "events": [
    "charge.succeeded",
    "charge.failed",
    "charge.cancelled",
    "charge.refunded",
    "payout.created",
    "payout.succeeded",
    "payout.failed"
  ]
}
```

#### Obtener webhooks activos
```http
GET /api/webhooks
```

#### Obtener un webhook por ID
```http
GET /api/webhooks/{webhookId}
```

#### Actualizar un webhook
```http
PUT /api/webhooks/{webhookId}
Content-Type: application/json

{
  "url": "https://tu-nuevo-dominio.com/api/webhooks/receive",
  "events": [
    "charge.succeeded",
    "charge.failed",
    "order.created",
    "order.completed"
  ]
}
```

#### Eliminar un webhook
```http
DELETE /api/webhooks/{webhookId}
```

#### Endpoint para recibir webhooks
```http
POST /api/webhooks/receive
X-OpenPay-Signature: firma_del_webhook
Content-Type: application/json

{
  "type": "charge.succeeded",
  "id": "trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5",
  "data": { ... }
}
```

#### Obtener tipos de eventos
```http
GET /api/webhooks/events/types
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `OPENPAY_MERCHANT_ID` | ID del comerciante en OpenPay | ✅ | - |
| `OPENPAY_PRIVATE_KEY` | Clave privada de OpenPay | ✅ | - |
| `OPENPAY_PUBLIC_KEY` | Clave pública de OpenPay | ✅ | - |
| `OPENPAY_PRODUCTION` | Usar entorno de producción | ❌ | false |
| `PORT` | Puerto del servidor | ❌ | 3000 |
| `NODE_ENV` | Entorno de ejecución | ❌ | development |
| `API_RATE_LIMIT` | Límite de requests por IP | ❌ | 100 |
| `WEBHOOK_BASE_URL` | URL base para webhooks | ❌ | http://localhost:3000 |

## 🏗️ Estructura del Proyecto

```
src/
├── app.js                 # Archivo principal de la aplicación
├── controllers/           # Controladores de la lógica de negocio
│   ├── chargeController.js
│   ├── customerController.js
│   └── webhookController.js
├── middleware/           # Middlewares personalizados
│   ├── errorHandler.js
│   └── validation.js
├── routes/               # Definición de rutas
│   ├── charges.js
│   ├── customers.js
│   └── webhooks.js
└── services/             # Servicios externos
    └── openpayService.js
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Rate Limiting**: Límite de requests por IP
- **Validación**: Validación robusta de datos con Joi
- **Verificación de firmas**: Verificación de webhooks de OpenPay

## 🧪 Testing

```bash
npm test
```

## 📝 Logs

La aplicación incluye logging estructurado con Morgan para:
- Requests HTTP
- Errores de aplicación
- Webhooks recibidos
- Operaciones de OpenPay

## 🚨 Manejo de Errores

La aplicación maneja diferentes tipos de errores:
- Errores de OpenPay con códigos específicos
- Errores de validación
- Errores de conexión
- Errores de timeout
- Errores internos del servidor

## 🔗 Links de Pago

La API genera **links de pago** en lugar de procesar tarjetas directamente. Esto es más seguro y permite que los usuarios completen el pago en la plataforma de OpenPay.

### Características principales:
- **Sin datos de tarjeta**: No necesitas manejar información sensible de tarjetas
- **Seguridad máxima**: OpenPay maneja toda la seguridad del pago
- **Flexibilidad**: El usuario puede pagar con diferentes métodos
- **Redirección automática**: Después del pago, el usuario regresa a tu sitio

### Flujo de trabajo:
1. Creas un cargo con `confirm: false`
2. La API genera un link de pago
3. Rediriges al usuario al link
4. El usuario completa el pago en OpenPay
5. OpenPay redirige de vuelta a tu sitio
6. Puedes verificar el estado del cargo

## 👤 Gestión de Customers

La API incluye funcionalidad completa para gestionar customers de OpenPay:

### Características principales:
- **Creación automática**: Al crear un cargo, si se proporciona información del customer, se crea o encuentra automáticamente
- **Búsqueda por email**: Encuentra customers existentes por su dirección de email
- **Validación robusta**: Validación completa de datos del customer
- **Integración transparente**: Los customers se manejan automáticamente en el flujo de cargos

## 📨 Gestión de Webhooks

La API incluye gestión completa de **webhooks** para recibir notificaciones automáticas de eventos de OpenPay.

### Características principales:
- **Gestión completa**: Crear, obtener, actualizar y eliminar webhooks
- **Verificación de firmas**: Validación automática de la autenticidad de los webhooks
- **Procesamiento automático**: Manejo inteligente de diferentes tipos de eventos
- **Seguridad**: Verificación de firmas para garantizar la autenticidad
- **Flexibilidad**: Soporte para todos los tipos de eventos de OpenPay

### Tipos de eventos soportados:
- **Cargos**: `charge.succeeded`, `charge.failed`, `charge.cancelled`, `charge.refunded`
- **Payouts**: `payout.created`, `payout.succeeded`, `payout.failed`
- **Órdenes**: `order.created`, `order.activated`, `order.completed`, `order.expired`
- **Suscripciones**: `subscription.created`, `subscription.updated`, `subscription.cancelled`
- **Chargebacks**: `chargeback.created`, `chargeback.rejected`, `chargeback.accepted`

### Flujo de trabajo:
1. Creas un webhook con la URL de tu endpoint
2. OpenPay envía notificaciones automáticas a tu endpoint
3. La API verifica la firma del webhook
4. Procesa automáticamente el evento según su tipo
5. Puedes agregar lógica personalizada para cada tipo de evento

### Ejemplo de uso completo:
```javascript
// Crear link de pago con customer management automático
const chargeData = {
  method: 'card',
  amount: 100.00,
  description: 'Compra en línea',
  order_id: 'ORD-12345',
  redirect_url: 'https://armafa.com/Usuario/GetTransaction',
  send_email: false,
  confirm: 'false',
  use_3d_secure: true,
  
  // Customer se crea o encuentra automáticamente
  customer: {
    name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@ejemplo.com',
    phone_number: '5551234567'
  }
  // NO necesitamos payment_method porque generamos un link de pago
};

// La API maneja automáticamente:
// 1. Busca si el customer existe por email
// 2. Si existe, lo usa
// 3. Si no existe, lo crea
// 4. Crea el cargo con confirm: false
// 5. Genera un link de pago
// 6. Retorna la URL para que el usuario complete el pago

// Respuesta esperada:
{
  "success": true,
  "message": "Link de pago creado exitosamente",
  "data": {
    "charge_id": "trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5",
    "amount": 100.00,
    "currency": "MXN",
    "description": "Compra en línea",
    "status": "in_progress",
    "order_id": "ORD-12345",
    "payment_link": "https://sandbox-dashboard.openpay.mx/paynet-pdf/trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5"
  },
  "customer": {
    "id": "cus123456789",
    "email": "juan.perez@ejemplo.com",
    "name": "Juan",
    "last_name": "Pérez"
  }
}
```

## 📖 Documentación de OpenPay

Para más información sobre la API de OpenPay, consulta:
- [Documentación oficial de OpenPay](https://documents.openpay.mx/docs/node-js.html)
- [Guía de webhooks](https://documents.openpay.mx/docs/webhooks.html)
- [Documentación de customers](https://documents.openpay.mx/docs/customers.html)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de OpenPay
2. Verifica las variables de entorno
3. Revisa los logs de la aplicación
4. Abre un issue en el repositorio
