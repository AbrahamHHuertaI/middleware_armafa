/**
 * Script de prueba para verificar el reenvío de cargos a Directus
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Datos de ejemplo para crear un cargo
const chargeData = {
  method: 'card',
  amount: 100.00,
  description: 'Compra de prueba para Directus',
  currency: 'MXN',
  order_id: 'TEST-CHARGE-' + Date.now(),
  send_email: false,
  use_3d_secure: true,
  customer: {
    name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@ejemplo.com',
    phone_number: '5551234567'
  }
};

async function testChargeCreation() {
  try {
    console.log('🧪 Probando creación de cargo con reenvío a Directus...');
    console.log('📋 Datos del cargo:', JSON.stringify(chargeData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/charges`, chargeData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Cargo creado y reenviado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al crear cargo:', error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('WEBHOOK_CHARGE')) {
      console.log('\n🔍 Configuración requerida:');
      console.log('1. Agrega WEBHOOK_CHARGE a tu archivo .env');
      console.log('2. Agrega WEBHOOK_TOKEN a tu archivo .env');
      console.log('3. Reinicia el servidor');
    }
    
    throw error;
  }
}

async function testPaymentLinkCreation() {
  try {
    console.log('\n🔗 Probando creación de link de pago con reenvío a Directus...');
    
    const paymentLinkData = {
      method: 'card',
      amount: 50.00,
      description: 'Link de pago de prueba para Directus',
      currency: 'MXN',
      order_id: 'TEST-LINK-' + Date.now(),
      redirect_url: 'https://armafa.com/Usuario/GetTransaction',
      send_email: true,
      customer: {
        name: 'María',
        last_name: 'García',
        email: 'maria.garcia@ejemplo.com'
      }
    };
    
    console.log('📋 Datos del link de pago:', JSON.stringify(paymentLinkData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/charges/payment-link`, paymentLinkData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Link de pago creado y reenviado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al crear link de pago:', error.response?.data || error.message);
    throw error;
  }
}

async function testAllChargeTypes() {
  try {
    console.log('='.repeat(60));
    console.log('PRUEBA DE REENVÍO DE CARGOS A DIRECTUS');
    console.log('='.repeat(60));
    
    // Probar creación de cargo
    console.log('\n📤 Probando: Creación de cargo');
    console.log('-'.repeat(40));
    await testChargeCreation();
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Probar creación de link de pago
    console.log('\n📤 Probando: Creación de link de pago');
    console.log('-'.repeat(40));
    await testPaymentLinkCreation();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('Todos los cargos fueron reenviados a Directus');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ PRUEBAS FALLARON');
    console.log('='.repeat(60));
    console.error('Error final:', error.message);
  }
}

async function testSingleCharge() {
  try {
    console.log('🧪 Probando un solo cargo...');
    
    await testChargeCreation();
    
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
  console.log('WEBHOOK_CHARGE=https://tu-directus-instance.com/webhooks/charges');
  console.log('WEBHOOK_TOKEN=tu_token_de_directus_aqui');
  console.log('');
  console.log('Ejemplo:');
  console.log('WEBHOOK_DIRECTUS=https://cms.armafa.com/webhooks/openpay');
  console.log('WEBHOOK_CHARGE=https://cms.armafa.com/webhooks/charges');
  console.log('WEBHOOK_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

// Ejecutar pruebas según el argumento
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'single':
    testSingleCharge();
    break;
  case 'config':
    showConfiguration();
    break;
  case 'all':
  default:
    testAllChargeTypes();
    break;
}

module.exports = {
  testChargeCreation,
  testPaymentLinkCreation,
  testAllChargeTypes,
  testSingleCharge,
  showConfiguration
};
