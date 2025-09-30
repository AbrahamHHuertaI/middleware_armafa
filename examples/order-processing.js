/**
 * Ejemplo de uso del endpoint de procesamiento de pedidos
 * 
 * Este archivo muestra cómo usar el nuevo endpoint /api/orders/process
 * para procesar pedidos desde webhooks de Directus
 */

const axios = require('axios');

// URL del middleware
const MIDDLEWARE_URL = 'http://localhost:3000';

// Ejemplo de payload que se enviaría desde Directus webhook
const ejemploPayload = {
  "event": "Carrito.items.create",
  "payload": {
    "Usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",
    "NoOrden": "ORD-1759174992005-265",
    "Total": 649.6,
    "Subtotal": 649.6,
    "IVA": 649.6,
    "Estatus": "PendientePago",
    "Nombre": "comprador2s",
    "Apellidos": "comprador2",
    "Email": "comprador2@mailinator.com",
    "Telefono": "4773804422",
    "Direccion": "asdasd",
    "Ciudad": "Jerécuaro",
    "Estado": "Guanajuato ",
    "Codigo_Postal": "37420",
    "Referencias": "",
    "Productos": "[{\"id\":3,\"nombre\":\"BLOQUES DECORATIVO 3D TIPO HOJAS\",\"cantidad\":1,\"precioUnitario\":649.6,\"total\":649.6}]"
  },
  "key": 25,
  "collection": "Carrito"
};

/**
 * Función para procesar un pedido
 */
async function procesarPedido(payload) {
  try {
    console.log('🚀 Enviando pedido para procesamiento...');
    
    const response = await axios.post(`${MIDDLEWARE_URL}/api/orders/process`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pedido procesado exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error procesando pedido:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

/**
 * Función para probar con múltiples productos
 */
async function probarConMultiplesProductos() {
  const payloadMultiples = {
    "event": "Carrito.items.create",
    "payload": {
      "Usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",
      "NoOrden": "ORD-1759174992005-266",
      "Total": 1299.2,
      "Subtotal": 1299.2,
      "IVA": 1299.2,
      "Estatus": "PendientePago",
      "Nombre": "Juan",
      "Apellidos": "Pérez",
      "Email": "juan.perez@ejemplo.com",
      "Telefono": "5551234567",
      "Direccion": "Calle Principal 123",
      "Ciudad": "Ciudad de México",
      "Estado": "CDMX",
      "Codigo_Postal": "01000",
      "Referencias": "Casa azul con portón blanco",
      "Productos": JSON.stringify([
        {
          "id": 3,
          "nombre": "BLOQUES DECORATIVO 3D TIPO HOJAS",
          "cantidad": 1,
          "precioUnitario": 649.6,
          "total": 649.6
        },
        {
          "id": 5,
          "nombre": "PRODUCTO DE OTRO PROVEEDOR",
          "cantidad": 2,
          "precioUnitario": 324.8,
          "total": 649.6
        }
      ])
    },
    "key": 26,
    "collection": "Carrito"
  };

  return await procesarPedido(payloadMultiples);
}

// Ejecutar ejemplo si se llama directamente
if (require.main === module) {
  console.log('📦 Ejemplo de procesamiento de pedidos');
  console.log('=====================================\n');
  
  procesarPedido(ejemploPayload)
    .then(() => {
      console.log('\n🎉 Ejemplo completado exitosamente');
    })
    .catch((error) => {
      console.log('\n💥 Ejemplo falló');
      process.exit(1);
    });
}

module.exports = {
  procesarPedido,
  probarConMultiplesProductos,
  ejemploPayload
};
