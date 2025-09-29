/**
 * Script de prueba para verificar la corrección del error 1001 de OpenPay
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Datos de prueba para crear webhook (usando el formato correcto de OpenPay)
const webhookTestData = {
  url: 'https://qa-middleware.dkvzeq.easypanel.host/api/webhooks/receive',
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

async function testWebhookCreation() {
  try {
    console.log('🧪 Iniciando prueba de creación de webhook...');
    console.log('📋 Datos de prueba:', JSON.stringify(webhookTestData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookTestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Webhook creado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    
    if (error.response?.data?.error_code === 1001) {
      console.log('\n🔍 Análisis del error 1001:');
      console.log('- El error persiste después de las correcciones');
      console.log('- Posibles causas adicionales:');
      console.log('  1. Problema con las credenciales de OpenPay');
      console.log('  2. URL del webhook no accesible');
      console.log('  3. Configuración incorrecta del entorno');
      console.log('  4. Limitaciones de la cuenta de OpenPay');
    }
    
    throw error;
  }
}

async function testWebhookList() {
  try {
    console.log('\n📋 Probando listado de webhooks...');
    
    const response = await axios.get(`${API_BASE_URL}/webhooks`);
    
    console.log('✅ Webhooks obtenidos exitosamente');
    console.log('📊 Total de webhooks:', response.data.count);
    console.log('📋 Lista:', JSON.stringify(response.data.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al obtener webhooks:', error.response?.data || error.message);
    throw error;
  }
}

async function runTests() {
  try {
    console.log('='.repeat(60));
    console.log('PRUEBA DE CORRECCIÓN DEL ERROR 1001 DE OPENPAY');
    console.log('='.repeat(60));
    
    // Probar creación de webhook
    await testWebhookCreation();
    
    // Probar listado de webhooks
    await testWebhookList();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));
    
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
  testWebhookCreation,
  testWebhookList,
  runTests
};
