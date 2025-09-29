/**
 * Script de prueba para verificar el reenvío de webhooks a Directus
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Simular diferentes tipos de webhooks de OpenPay
const webhookExamples = {
  chargeSucceeded: {
    type: 'charge.succeeded',
    id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
    data: {
      id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
      amount: 100.00,
      currency: 'MXN',
      description: 'Compra en línea exitosa',
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
  },
  
  chargeFailed: {
    type: 'charge.failed',
    id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z6',
    data: {
      id: 'trh8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z6',
      amount: 50.00,
      currency: 'MXN',
      description: 'Compra fallida',
      status: 'failed',
      order_id: 'ORD-12346',
      customer: {
        id: 'cus123456790',
        email: 'maria.garcia@ejemplo.com',
        name: 'María',
        last_name: 'García'
      },
      error_message: 'Tarjeta declinada',
      creation_date: '2024-01-15T10:35:00Z'
    }
  },
  
  payoutSucceeded: {
    type: 'payout.succeeded',
    id: 'payout123456789',
    data: {
      id: 'payout123456789',
      amount: 500.00,
      currency: 'MXN',
      status: 'completed',
      bank_account: {
        holder_name: 'Juan Pérez',
        account_number: '****1234'
      },
      creation_date: '2024-01-15T11:00:00Z'
    }
  }
};

async function testWebhookForwarding(webhookType, webhookData) {
  try {
    console.log(`🧪 Probando reenvío de webhook: ${webhookType}`);
    console.log('📋 Payload del webhook:', JSON.stringify(webhookData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/webhooks/receive`, webhookData, {
      headers: {
        'Content-Type': 'application/json',
        'X-OpenPay-Signature': 'test-signature'
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Webhook procesado y reenviado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error al procesar webhook ${webhookType}:`, error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('WEBHOOK_DIRECTUS')) {
      console.log('\n🔍 Configuración requerida:');
      console.log('1. Agrega WEBHOOK_DIRECTUS a tu archivo .env');
      console.log('2. Agrega WEBHOOK_TOKEN a tu archivo .env');
      console.log('3. Reinicia el servidor');
    }
    
    throw error;
  }
}

async function testAllWebhookTypes() {
  try {
    console.log('='.repeat(60));
    console.log('PRUEBA DE REENVÍO DE WEBHOOKS A DIRECTUS');
    console.log('='.repeat(60));
    
    // Probar cada tipo de webhook
    for (const [type, data] of Object.entries(webhookExamples)) {
      console.log(`\n📤 Probando: ${type}`);
      console.log('-'.repeat(40));
      
      await testWebhookForwarding(type, data);
      
      // Pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('Todos los webhooks fueron reenviados a Directus');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ PRUEBAS FALLARON');
    console.log('='.repeat(60));
    console.error('Error final:', error.message);
  }
}

async function testSingleWebhook() {
  try {
    console.log('🧪 Probando un solo webhook...');
    
    const webhookData = webhookExamples.chargeSucceeded;
    await testWebhookForwarding('charge.succeeded', webhookData);
    
    console.log('\n✅ Prueba individual completada');
    
  } catch (error) {
    console.error('❌ Error en prueba individual:', error.message);
  }
}

// Función para mostrar configuración requerida
function showConfiguration() {
  console.log('\n🔧 CONFIGURACIÓN REQUERIDA:');
  console.log('='.repeat(40));
  console.log('Agrega estas variables a tu archivo .env:');
  console.log('');
  console.log('WEBHOOK_DIRECTUS=https://tu-directus-instance.com/webhooks/openpay');
  console.log('WEBHOOK_TOKEN=tu_token_de_directus_aqui');
  console.log('');
  console.log('Ejemplo:');
  console.log('WEBHOOK_DIRECTUS=https://cms.armafa.com/webhooks/openpay');
  console.log('WEBHOOK_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

// Ejecutar pruebas según el argumento
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'single':
    testSingleWebhook();
    break;
  case 'config':
    showConfiguration();
    break;
  case 'all':
  default:
    testAllWebhookTypes();
    break;
}

module.exports = {
  testWebhookForwarding,
  testAllWebhookTypes,
  testSingleWebhook,
  showConfiguration
};
