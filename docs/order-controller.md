# Controlador de Pedidos (OrderController)

Este controlador maneja el procesamiento de pedidos desde webhooks de Directus, incluyendo la obtención de información de productos y proveedores, y el envío de notificaciones por correo electrónico.

## Funcionalidades

### 1. Procesamiento de Pedidos
- **Endpoint**: `POST /api/orders/process`
- **Descripción**: Procesa un nuevo pedido recibido desde un webhook de Directus
- **Payload**: Recibe el payload completo del webhook de Directus

### 2. Funciones Principales

#### `processOrder(req, res, next)`
Función principal que orquesta todo el proceso:
1. Parsea los productos del payload
2. Extrae la información del cliente
3. Obtiene información completa de productos desde Directus
4. Agrupa productos por proveedor
5. Envía correos a cada proveedor

#### `parseProductos(productosString)`
Convierte el string JSON de productos en un array de objetos JavaScript.

#### `extractClienteInfo(payload)`
Extrae y formatea la información del cliente del payload.

#### `obtenerProductosDirectus(productos)`
Hace llamadas a la API de Directus para obtener información completa de cada producto incluyendo su proveedor.

#### `agruparPorProveedor(productosCompletos)`
Agrupa los productos por proveedor para facilitar el envío de correos.

#### `enviarCorreosProveedores(productosPorProveedor, clienteInfo, payload)`
Envía correos electrónicos a cada proveedor con la información del pedido.

## Configuración Requerida

### Variables de Entorno

```env
# Configuración de Directus
DIRECTUS_URL=https://tu-directus-instance.com
WEBHOOK_TOKEN=tu_webhook_token_aqui

# Configuración de correo electrónico
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
SMTP_FROM=noreply@tu-dominio.com
```

### Estructura de Datos en Directus

El controlador espera que en Directus existan las siguientes colecciones:

#### Colección `productos`
- `id`: ID único del producto
- `nombre`: Nombre del producto
- `proveedor`: Relación con la colección `proveedores`

#### Colección `proveedores`
- `id`: ID único del proveedor
- `nombre`: Nombre del proveedor
- `email`: Email del proveedor

## Ejemplo de Uso

### Payload de Entrada
```json
{
  "id": 25,
  "Usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",
  "NoOrden": "ORD-1759174992005-265",
  "Total": "649.60000",
  "Subtotal": "649.60000",
  "IVA": "649.60000",
  "IdTransaccion": "trvniv9b2sdpupfepgeb",
  "Estatus": "Pendiente de pago",
  "Url_de_pago": "https://sandbox-api.openpay.mx/v1/mrnqcupnxje2fiajbl0b/charges/trvniv9b2sdpupfepgeb/card_capture",
  "Nombre": "comprador2s",
  "Apellidos": "comprador2",
  "Email": "comprador2@mailinator.com",
  "Telefono": "4773804422",
  "Direccion": "asdasd",
  "Ciudad": "Jerécuaro",
  "Estado": "Guanajuato ",
  "Codigo_Postal": "37420",
  "Referencias": "",
  "Productos": "[{\"id\":3,\"nombre\":\"BLOQUES DECORATIVO 3D TIPO HOJAS\",\"cantidad\":1,\"precioUnitario\":649.6,\"total\":649.6}]",
  "Numero_De_Contrato": null,
  "OpenPayTransactionId": null,
  "OpenPayAuthorizationCode": null,
  "OpenPayMethod": null,
  "OpenPayStatus": null,
  "OpenPayAmount": null,
  "OpenPayCardType": null,
  "OpenPayCardBrand": null,
  "OpenPayCardNumber": null,
  "OpenPayBankName": null
}
```

### Respuesta de Éxito
```json
{
  "success": true,
  "message": "Pedido procesado exitosamente",
  "data": {
    "cliente": {
      "usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",
      "nombre": "comprador2s",
      "apellidos": "comprador2",
      "email": "comprador2@mailinator.com",
      "telefono": "4773804422",
      "direccion": "asdasd",
      "ciudad": "Jerécuaro",
      "estado": "Guanajuato ",
      "codigoPostal": "37420",
      "referencias": ""
    },
    "productos": [
      {
        "id": 3,
        "nombre": "BLOQUES DECORATIVO 3D TIPO HOJAS",
        "cantidad": 1,
        "precioUnitario": 649.6,
        "total": 649.6,
        "proveedor": {
          "id": 1,
          "nombre": "Proveedor ABC",
          "email": "proveedor@abc.com"
        }
      }
    ],
    "correosEnviados": [
      {
        "proveedorId": 1,
        "proveedorNombre": "Proveedor ABC",
        "proveedorEmail": "proveedor@abc.com",
        "exito": true,
        "messageId": "message-id-del-correo"
      }
    ]
  }
}
```

## Manejo de Errores

El controlador maneja varios tipos de errores:

1. **Error de parsing de productos**: Si el JSON de productos es inválido
2. **Error de conexión con Directus**: Si no se puede conectar a la API
3. **Error de envío de correos**: Si falla el envío a algún proveedor
4. **Proveedores sin email**: Se registra el error pero continúa con otros proveedores

## Correos Electrónicos

Los correos enviados a los proveedores incluyen:

- Información completa del pedido
- Datos del cliente
- Lista de productos específicos del proveedor
- Formato HTML y texto plano

## Dependencias

- `axios`: Para llamadas HTTP a Directus
- `nodemailer`: Para envío de correos electrónicos

## Archivos Relacionados

- `src/controllers/orderController.js`: Controlador principal
- `src/routes/orders.js`: Rutas del controlador
- `examples/order-processing.js`: Ejemplos de uso
