/**
 * Script de prueba para verificar que los métodos de checkouts funcionan con API REST
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

async function testListCheckouts() {
  try {
    console.log('🧪 Probando listado de checkouts...');
    
    const response = await axios.get(`${API_BASE_URL}/checkouts`, {
      params: {
        limit: 10,
        offset: 0
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Checkouts listados exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al listar checkouts:', error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('OPENPAY_MERCHANT_ID')) {
      console.log('\n🔍 Configuración requerida:');
      console.log('1. Agrega OPENPAY_MERCHANT_ID a tu archivo .env');
      console.log('2. Agrega OPENPAY_PRIVATE_KEY a tu archivo .env');
      console.log('3. Reinicia el servidor');
    }
    
    throw error;
  }
}

async function testCreateCheckout() {
  try {
    console.log('\n🔗 Probando creación de checkout...');
    
    const checkoutData = {
      amount: 100.00,
      description: 'Checkout de prueba',
      currency: 'MXN',
      order_id: 'TEST-CHECKOUT-' + Date.now(),
      redirect_url: 'https://armafa.com/Usuario/GetTransaction',
      send_email: true,
      customer: {
        name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@ejemplo.com'
      }
    };
    
    console.log('📋 Datos del checkout:', JSON.stringify(checkoutData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/checkouts`, checkoutData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ ¡Checkout creado exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al crear checkout:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetCheckout(checkoutId) {
  try {
    console.log(`\n🔍 Probando obtención de checkout: ${checkoutId}`);
    
    const response = await axios.get(`${API_BASE_URL}/checkouts/${checkoutId}`, {
      timeout: 30000
    });
    
    console.log('✅ ¡Checkout obtenido exitosamente!');
    console.log('📋 Respuesta:', JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al obtener checkout:', error.response?.data || error.message);
    throw error;
  }
}

async function testAllCheckoutMethods() {
  try {
    console.log('='.repeat(60));
    console.log('PRUEBA DE MÉTODOS DE CHECKOUTS CON API REST');
    console.log('='.repeat(60));
    
    // Probar listado de checkouts
    console.log('\n📤 Probando: Listado de checkouts');
    console.log('-'.repeat(40));
    await testListCheckouts();
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Probar creación de checkout
    console.log('\n📤 Probando: Creación de checkout');
    console.log('-'.repeat(40));
    const checkout = await testCreateCheckout();
    
    // Si se creó un checkout, probar obtenerlo
    if (checkout && checkout.data && checkout.data.id) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('\n📤 Probando: Obtención de checkout');
      console.log('-'.repeat(40));
      await testGetCheckout(checkout.data.id);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('Los métodos de checkouts funcionan correctamente con API REST');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ PRUEBAS FALLARON');
    console.log('='.repeat(60));
    console.error('Error final:', error.message);
  }
}

async function testSingleMethod() {
  try {
    console.log('🧪 Probando un solo método...');
    
    await testListCheckouts();
    
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
  console.log('OPENPAY_MERCHANT_ID=tu_merchant_id');
  console.log('OPENPAY_PRIVATE_KEY=tu_private_key');
  console.log('OPENPAY_PRODUCTION=false');
  console.log('');
  console.log('Ejemplo:');
  console.log('OPENPAY_MERCHANT_ID=mzdtln0bmtms6o3kck8f');
  console.log('OPENPAY_PRIVATE_KEY=sk_e568c42a6c384b7ab02cd47d2e407cab');
  console.log('OPENPAY_PRODUCTION=false');
}

// Ejecutar pruebas según el argumento
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'single':
    testSingleMethod();
    break;
  case 'config':
    showConfiguration();
    break;
  case 'all':
  default:
    testAllCheckoutMethods();
    break;
}

module.exports = {
  testListCheckouts,
  testCreateCheckout,
  testGetCheckout,
  testAllCheckoutMethods,
  testSingleMethod,
  showConfiguration
};
