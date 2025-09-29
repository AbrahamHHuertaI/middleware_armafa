/**
 * Ejemplo de uso de la API de OpenPay con Webhooks
 * 
 * Este ejemplo muestra cómo crear, gestionar y procesar webhooks de OpenPay
 * para recibir notificaciones automáticas de eventos de pago.
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Datos de ejemplo para crear webhook
const webhookData = {
  url: 'https://tu-dominio.com/api/webhooks/receive',
  user: 'webhook_user',
  password: 'webhook_password',
  events: [
    'charge.succeeded',
    'charge.failed',
    'charge.cancelled',
    'charge.refunded',
    'payout.created',
    'payout.succeeded',
    'payout.failed'
  ]
};

async function crearWebhook() {
  try {
    console.log('🔗 Creando webhook...');
    
    const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData);
    
    console.log('✅ Webhook creado exitosamente:');
    console.log('📋 Datos del webhook:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al crear webhook:', error.response?.data || error.message);
    throw error;
  }
}

async function obtenerWebhooks() {
  try {
    console.log('📋 Obteniendo webhooks activos...');
    
    const response = await axios.get(`${API_BASE_URL}/webhooks`);
    
    console.log('✅ Webhooks obtenidos:');
    console.log('📊 Total de webhooks:', response.data.count);
    console.log('📋 Lista de webhooks:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al obtener webhooks:', error.response?.data || error.message);
    throw error;
  }
}

async function obtenerWebhookPorId(webhookId) {
  try {
    console.log(`🔍 Obteniendo webhook con ID: ${webhookId}`);
    
    const response = await axios.get(`${API_BASE_URL}/webhooks/${webhookId}`);
    
    console.log('✅ Webhook obtenido:');
    console.log('📋 Datos del webhook:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al obtener webhook:', error.response?.data || error.message);
    throw error;
  }
}

async function actualizarWebhook(webhookId) {
  try {
    console.log(`✏️ Actualizando webhook con ID: ${webhookId}`);
    
    const updateData = {
      url: 'https://tu-nuevo-dominio.com/api/webhooks/receive',
      events: [
        'charge.succeeded',
        'charge.failed',
        'order.created',
        'order.completed'
      ]
    };
    
    const response = await axios.put(`${API_BASE_URL}/webhooks/${webhookId}`, updateData);
    
    console.log('✅ Webhook actualizado exitosamente:');
    console.log('📋 Datos actualizados:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al actualizar webhook:', error.response?.data || error.message);
    throw error;
  }
}

async function obtenerTiposDeEventos() {
  try {
    console.log('📝 Obteniendo tipos de eventos disponibles...');
    
    const response = await axios.get(`${API_BASE_URL}/webhooks/events/types`);
    
    console.log('✅ Tipos de eventos obtenidos:');
    console.log('📋 Eventos disponibles:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al obtener tipos de eventos:', error.response?.data || error.message);
    throw error;
  }
}

async function eliminarWebhook(webhookId) {
  try {
    console.log(`🗑️ Eliminando webhook con ID: ${webhookId}`);
    
    const response = await axios.delete(`${API_BASE_URL}/webhooks/${webhookId}`);
    
    console.log('✅ Webhook eliminado exitosamente:');
    console.log('📋 Respuesta:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al eliminar webhook:', error.response?.data || error.message);
    throw error;
  }
}

// Función para simular la recepción de un webhook
function simularWebhookRecibido() {
  console.log('\n📨 Simulando webhook recibido...');
  
  // Ejemplo de payload que OpenPay enviaría
  const webhookPayload = {
    type: 'charge.succeeded',
    id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
    data: {
      id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
      amount: 100.00,
      currency: 'MXN',
      description: 'Compra en línea',
      status: 'completed',
      order_id: 'ORD-12345',
      customer: {
        id: 'cus123456789',
        email: 'juan.perez@ejemplo.com',
        name: 'Juan',
        last_name: 'Pérez'
      },
      payment_method: {
        type: 'card',
        card: {
          brand: 'visa',
          last_four_digits: '1111'
        }
      },
      creation_date: '2024-01-15T10:30:00Z'
    }
  };
  
  console.log('📋 Payload del webhook:', JSON.stringify(webhookPayload, null, 2));
  
  // Aquí normalmente harías una petición POST a tu endpoint de webhook
  console.log('💡 Para recibir webhooks reales, configura tu endpoint en OpenPay:');
  console.log(`   POST ${API_BASE_URL}/webhooks/receive`);
  console.log('   Headers: X-OpenPay-Signature: [firma_del_webhook]');
}

// Función principal para ejecutar los ejemplos
async function ejecutarEjemplos() {
  try {
    console.log('='.repeat(60));
    console.log('EJEMPLO 1: Crear webhook');
    console.log('='.repeat(60));
    const webhook = await crearWebhook();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 2: Obtener todos los webhooks');
    console.log('='.repeat(60));
    await obtenerWebhooks();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 3: Obtener webhook por ID');
    console.log('='.repeat(60));
    await obtenerWebhookPorId(webhook.id);
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 4: Actualizar webhook');
    console.log('='.repeat(60));
    await actualizarWebhook(webhook.id);
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 5: Obtener tipos de eventos');
    console.log('='.repeat(60));
    await obtenerTiposDeEventos();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 6: Simular webhook recibido');
    console.log('='.repeat(60));
    simularWebhookRecibido();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 7: Eliminar webhook');
    console.log('='.repeat(60));
    await eliminarWebhook(webhook.id);
    
  } catch (error) {
    console.error('Error en los ejemplos:', error.message);
  }
}

// Ejecutar ejemplos si se llama directamente
if (require.main === module) {
  ejecutarEjemplos();
}

module.exports = {
  crearWebhook,
  obtenerWebhooks,
  obtenerWebhookPorId,
  actualizarWebhook,
  obtenerTiposDeEventos,
  eliminarWebhook,
  simularWebhookRecibido,
  ejecutarEjemplos
};
