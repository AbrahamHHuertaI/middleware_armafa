/**
 * Ejemplos de uso de la API de OpenPay Middleware
 * 
 * Este archivo contiene ejemplos de cómo usar los diferentes endpoints
 * de la API para crear cargos y gestionar webhooks.
 */

const axios = require('axios');

// Configuración base
const API_BASE_URL = 'http://localhost:3000/api';

// Ejemplo de creación de cargo con tarjeta
async function crearCargoConTarjeta() {
  try {
    const cargoData = {
      method: 'card',
      amount: 100.00,
      description: 'Pago de prueba con tarjeta',
      currency: 'MXN',
      customer: {
        name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone_number: '5551234567',
        address: {
          line1: 'Calle Principal 123',
          line2: 'Colonia Centro',
          postal_code: '01000',
          state: 'Ciudad de México',
          city: 'Ciudad de México',
          country_code: 'MX'
        }
      },
      payment_method: {
        type: 'card',
        card: {
          card_number: '4111111111111111', // Tarjeta de prueba
          holder_name: 'Juan Pérez',
          expiration_year: '2025',
          expiration_month: '12',
          cvv2: '123'
        }
      },
      confirm: true,
      send_email: true
    };

    const response = await axios.post(`${API_BASE_URL}/charges`, cargoData);
    console.log('✅ Cargo creado exitosamente:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear cargo:', error.response?.data || error.message);
  }
}

// Ejemplo de creación de cargo con transferencia bancaria
async function crearCargoConTransferencia() {
  try {
    const cargoData = {
      method: 'bank_account',
      amount: 250.00,
      description: 'Pago con transferencia bancaria',
      currency: 'MXN',
      customer: {
        name: 'María',
        last_name: 'González',
        email: 'maria.gonzalez@ejemplo.com'
      },
      payment_method: {
        type: 'bank_account',
        bank_account: {
          clabe: '123456789012345678',
          holder_name: 'María González'
        }
      },
      confirm: false
    };

    const response = await axios.post(`${API_BASE_URL}/charges`, cargoData);
    console.log('✅ Cargo con transferencia creado:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear cargo con transferencia:', error.response?.data || error.message);
  }
}

// Ejemplo de creación de cargo para pago en tienda
async function crearCargoEnTienda() {
  try {
    const cargoData = {
      method: 'store',
      amount: 75.50,
      description: 'Pago en tienda de conveniencia',
      currency: 'MXN',
      customer: {
        name: 'Carlos',
        last_name: 'López',
        email: 'carlos.lopez@ejemplo.com'
      },
      payment_method: {
        type: 'store',
        store: {
          reference: 'REF123456789',
          barcode_url: 'https://example.com/barcode.png',
          barcode: '12345678901234567890'
        }
      },
      confirm: false
    };

    const response = await axios.post(`${API_BASE_URL}/charges`, cargoData);
    console.log('✅ Cargo en tienda creado:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear cargo en tienda:', error.response?.data || error.message);
  }
}

// Ejemplo de obtener un cargo por ID
async function obtenerCargo(chargeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/charges/${chargeId}`);
    console.log('📋 Cargo obtenido:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener cargo:', error.response?.data || error.message);
  }
}

// Ejemplo de listar cargos con filtros
async function listarCargos() {
  try {
    const params = {
      limit: 10,
      offset: 0,
      status: 'completed'
    };

    const response = await axios.get(`${API_BASE_URL}/charges`, { params });
    console.log('📋 Lista de cargos:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al listar cargos:', error.response?.data || error.message);
  }
}

// Ejemplo de crear webhook
async function crearWebhook() {
  try {
    const webhookData = {
      url: 'https://tu-dominio.com/webhook',
      events: [
        'charge.succeeded',
        'charge.failed',
        'charge.cancelled',
        'charge.refunded'
      ]
    };

    const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData);
    console.log('🔗 Webhook creado:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear webhook:', error.response?.data || error.message);
  }
}

// Ejemplo de obtener webhooks activos
async function obtenerWebhooksActivos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/webhooks`);
    console.log('🔗 Webhooks activos:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener webhooks:', error.response?.data || error.message);
  }
}

// Ejemplo de eliminar webhook
async function eliminarWebhook(webhookId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/webhooks/${webhookId}`);
    console.log('🗑️ Webhook eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar webhook:', error.response?.data || error.message);
  }
}

// Ejemplo de obtener métodos de pago disponibles
async function obtenerMetodosPago() {
  try {
    const response = await axios.get(`${API_BASE_URL}/charges/methods/payment`);
    console.log('💳 Métodos de pago disponibles:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener métodos de pago:', error.response?.data || error.message);
  }
}

// Ejemplo de obtener tipos de eventos para webhooks
async function obtenerTiposEventos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/webhooks/events/types`);
    console.log('📝 Tipos de eventos disponibles:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener tipos de eventos:', error.response?.data || error.message);
  }
}

// Función principal para ejecutar ejemplos
async function ejecutarEjemplos() {
  console.log('🚀 Iniciando ejemplos de uso de la API...\n');

  try {
    // Obtener información básica
    console.log('1. Obteniendo métodos de pago disponibles...');
    await obtenerMetodosPago();

    console.log('\n2. Obteniendo tipos de eventos para webhooks...');
    await obtenerTiposEventos();

    // Crear cargos
    console.log('\n3. Creando cargo con tarjeta...');
    const cargoTarjeta = await crearCargoConTarjeta();

    console.log('\n4. Creando cargo con transferencia...');
    const cargoTransferencia = await crearCargoConTransferencia();

    console.log('\n5. Creando cargo en tienda...');
    const cargoTienda = await crearCargoEnTienda();

    // Obtener cargo específico
    if (cargoTarjeta && cargoTarjeta.id) {
      console.log('\n6. Obteniendo cargo por ID...');
      await obtenerCargo(cargoTarjeta.id);
    }

    // Listar cargos
    console.log('\n7. Listando cargos...');
    await listarCargos();

    // Gestionar webhooks
    console.log('\n8. Creando webhook...');
    const webhook = await crearWebhook();

    console.log('\n9. Obteniendo webhooks activos...');
    await obtenerWebhooksActivos();

    // Eliminar webhook si se creó
    if (webhook && webhook.id) {
      console.log('\n10. Eliminando webhook...');
      await eliminarWebhook(webhook.id);
    }

    console.log('\n✅ Ejemplos completados exitosamente!');
  } catch (error) {
    console.error('❌ Error en los ejemplos:', error.message);
  }
}

// Exportar funciones para uso individual
module.exports = {
  crearCargoConTarjeta,
  crearCargoConTransferencia,
  crearCargoEnTienda,
  obtenerCargo,
  listarCargos,
  crearWebhook,
  obtenerWebhooksActivos,
  eliminarWebhook,
  obtenerMetodosPago,
  obtenerTiposEventos,
  ejecutarEjemplos
};

// Ejecutar ejemplos si se llama directamente
if (require.main === module) {
  ejecutarEjemplos();
}
