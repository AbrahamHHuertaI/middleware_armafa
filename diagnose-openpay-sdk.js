/**
 * Script de diagnóstico para verificar métodos disponibles en el SDK de OpenPay
 */

const Openpay = require('openpay');

async function diagnoseOpenPaySDK() {
  try {
    console.log('🔍 Diagnóstico del SDK de OpenPay');
    console.log('='.repeat(50));
    
    // Verificar variables de entorno
    console.log('📋 Variables de entorno:');
    console.log('OPENPAY_MERCHANT_ID:', process.env.OPENPAY_MERCHANT_ID ? '✅ Configurado' : '❌ No configurado');
    console.log('OPENPAY_PRIVATE_KEY:', process.env.OPENPAY_PRIVATE_KEY ? '✅ Configurado' : '❌ No configurado');
    console.log('OPENPAY_PRODUCTION:', process.env.OPENPAY_PRODUCTION || 'false');
    
    if (!process.env.OPENPAY_MERCHANT_ID || !process.env.OPENPAY_PRIVATE_KEY) {
      console.log('\n⚠️ Variables de entorno faltantes. Usando valores de prueba...');
      process.env.OPENPAY_MERCHANT_ID = 'test_merchant_id';
      process.env.OPENPAY_PRIVATE_KEY = 'test_private_key';
    }
    
    // Crear instancia del SDK
    console.log('\n🔧 Creando instancia del SDK...');
    const openpay = new Openpay(
      process.env.OPENPAY_MERCHANT_ID,
      process.env.OPENPAY_PRIVATE_KEY,
      process.env.OPENPAY_PRODUCTION === 'true'
    );
    
    // Verificar métodos principales
    console.log('\n📋 Métodos principales disponibles:');
    const mainMethods = Object.keys(openpay);
    console.log('Métodos:', mainMethods);
    
    // Verificar métodos específicos
    console.log('\n🔍 Verificando métodos específicos:');
    
    // Charges
    if (openpay.charges) {
      console.log('✅ openpay.charges disponible');
      console.log('   Métodos:', Object.keys(openpay.charges));
    } else {
      console.log('❌ openpay.charges NO disponible');
    }
    
    // Customers
    if (openpay.customers) {
      console.log('✅ openpay.customers disponible');
      console.log('   Métodos:', Object.keys(openpay.customers));
    } else {
      console.log('❌ openpay.customers NO disponible');
    }
    
    // Webhooks
    if (openpay.webhooks) {
      console.log('✅ openpay.webhooks disponible');
      console.log('   Métodos:', Object.keys(openpay.webhooks));
    } else {
      console.log('❌ openpay.webhooks NO disponible');
    }
    
    // Checkouts
    if (openpay.checkouts) {
      console.log('✅ openpay.checkouts disponible');
      console.log('   Métodos:', Object.keys(openpay.checkouts));
    } else {
      console.log('❌ openpay.checkouts NO disponible');
      console.log('   Esto explica el error "Cannot read properties of undefined (reading \'list\')"');
    }
    
    // Verificar versión del SDK
    console.log('\n📦 Información del SDK:');
    if (openpay.version) {
      console.log('Versión:', openpay.version);
    } else {
      console.log('Versión: No disponible');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Diagnóstico completado');
    
    // Recomendaciones
    console.log('\n💡 Recomendaciones:');
    if (!openpay.checkouts) {
      console.log('1. El SDK actual no tiene soporte para checkouts');
      console.log('2. Considera usar la API REST directamente para checkouts');
      console.log('3. O actualiza a una versión más reciente del SDK');
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
  }
}

// Ejecutar diagnóstico
diagnoseOpenPaySDK();
