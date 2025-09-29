/**
 * Script de prueba para verificar que el webhook funciona correctamente
 * después de corregir el problema de contexto
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Simular un webhook de OpenPay
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

async function testWebhookReceive() {
  try {
    console.log('🧪 Probando recepción de webhook...');
    console.log('📋 Payload del webhook:', JSON.stringify(webhookPayload, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/webhooks/receive`, webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-OpenPay-Signature': 'test-signature' // Firma de prueba
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Webhook procesado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al procesar webhook:', error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('processWebhook')) {
      console.log('\n🔍 El error de contexto persiste. Verificando...');
      console.log('- Asegúrate de que el servidor se haya reiniciado');
      console.log('- Verifica que no haya errores de sintaxis en el controlador');
    }
    
    throw error;
  }
}

async function testWebhookCreation() {
  try {
    console.log('\n🔗 Probando creación de webhook...');
    
    const webhookData = {
      url: 'https://qa-middleware.dkvzeq.easypanel.host/api/webhooks/receive',
      user: 'webhook_user',
      password: 'webhook_password',
      events: [
        'charge.succeeded',
        'charge.failed',
        'charge.cancelled',
        'charge.refunded'
      ]
    };
    
    const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData);
    
    console.log('✅ ¡Webhook creado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al crear webhook:', error.response?.data || error.message);
    throw error;
  }
}

async function runTests() {
  try {
    console.log('='.repeat(60));
    console.log('PRUEBA DE CORRECCIÓN DEL WEBHOOK CONTROLLER');
    console.log('='.repeat(60));
    
    // Probar creación de webhook
    await testWebhookCreation();
    
    // Probar recepción de webhook
    await testWebhookReceive();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('El problema de contexto ha sido resuelto');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ PRUEBAS FALLARON');
    console.log('='.repeat(60));
    console.error('Error final:', error.message);
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  runTests();
}

module.exports = {
  testWebhookReceive,
  testWebhookCreation,
  runTests
};
