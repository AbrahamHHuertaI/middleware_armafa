/**
 * Ejemplo actualizado de creación de webhook con el formato correcto de OpenPay
 * 
 * PROBLEMA IDENTIFICADO Y SOLUCIONADO:
 * - OpenPay espera "event_types" no "events"
 * - El SDK de OpenPay puede tener problemas, por eso implementamos fallback a REST API
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// ✅ FORMATO CORRECTO - Tu aplicación puede seguir usando "events"
// pero internamente se convierte a "event_types" para OpenPay
const webhookData = {
  url: 'https://qa-middleware.dkvzeq.easypanel.host/api/webhooks/receive',
  user: 'webhook_user',
  password: 'webhook_password',
  events: [  // ← Tu API sigue usando "events"
    'charge.succeeded',
    'charge.failed',
    'charge.cancelled',
    'charge.refunded',
    'payout.created',
    'payout.succeeded',
    'payout.failed'
  ]
};

async function crearWebhookCorregido() {
  try {
    console.log('🔧 Creando webhook con formato corregido...');
    console.log('📋 Datos enviados a tu API:', JSON.stringify(webhookData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData);
    
    console.log('✅ ¡Webhook creado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Ejemplo de cómo OpenPay recibe los datos internamente
function mostrarFormatoInterno() {
  console.log('\n🔍 FORMATO INTERNO ENVIADO A OPENPAY:');
  console.log(JSON.stringify({
    url: webhookData.url,
    user: webhookData.user,
    password: webhookData.password,
    event_types: webhookData.events  // ← Conversión automática
  }, null, 2));
}

// Ejecutar ejemplo
async function ejecutarEjemplo() {
  try {
    console.log('='.repeat(60));
    console.log('EJEMPLO DE WEBHOOK CORREGIDO');
    console.log('='.repeat(60));
    
    mostrarFormatoInterno();
    
    console.log('\n' + '='.repeat(60));
    console.log('CREANDO WEBHOOK...');
    console.log('='.repeat(60));
    
    await crearWebhookCorregido();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ PROBLEMA RESUELTO');
    console.log('='.repeat(60));
    console.log('El error 1001 se debía a usar "events" en lugar de "event_types"');
    console.log('Ahora tu API maneja la conversión automáticamente');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ ERROR PERSISTENTE');
    console.log('='.repeat(60));
    console.log('Si el error persiste, verifica:');
    console.log('1. Credenciales de OpenPay correctas');
    console.log('2. URL del webhook accesible');
    console.log('3. Configuración del entorno');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarEjemplo();
}

module.exports = {
  crearWebhookCorregido,
  mostrarFormatoInterno,
  ejecutarEjemplo
};
