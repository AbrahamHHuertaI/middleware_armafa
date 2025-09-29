/**
 * Ejemplo de uso de la API de OpenPay con Customer Management y Checkouts
 * 
 * Este ejemplo muestra cómo crear checkouts (links de pago) con customer management,
 * usando la funcionalidad oficial de OpenPay para generar URLs de pago.
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Datos del usuario (equivalente a usuarioEmpresa.Usuario en C#)
const usuarioData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  celular: '5551234567',
  email: 'juan.perez@ejemplo.com'
};

// Datos del cargo (equivalente a customerData en C#)
const chargeData = {
  amount: 100.00,
  orderId: 'ORD-' + Date.now(),
  description: 'Compra en línea'
};

async function crearCheckoutConCustomer() {
  try {
    console.log('🚀 Creando checkout (link de pago) con customer management...');
    
    // Preparar los datos del checkout con customer
    const requestData = {
      amount: chargeData.amount,
      description: chargeData.description,
      currency: 'MXN',
      order_id: chargeData.orderId,
      redirect_url: 'https://armafa.com/Usuario/GetTransaction',
      send_email: 'true',
      
      // Datos del customer (equivalente al objeto Customer en C#)
      customer: {
        name: usuarioData.nombre,
        last_name: usuarioData.apellido,
        phone_number: usuarioData.celular,
        email: usuarioData.email
      }
    };

    // Realizar la petición para crear checkout
    const response = await axios.post(`${API_BASE_URL}/checkouts`, requestData);
    
    console.log('✅ Checkout creado exitosamente:');
    console.log('📋 Datos del checkout:', response.data.data);
    console.log('🔗 URL de pago:', response.data.data.payment_url);
    console.log('👤 Datos del customer:', response.data.customer);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al crear checkout:', error.response?.data || error.message);
    throw error;
  }
}

async function crearCustomerSeparadamente() {
  try {
    console.log('👤 Creando customer por separado...');
    
    const customerData = {
      name: usuarioData.nombre,
      last_name: usuarioData.apellido,
      phone_number: usuarioData.celular,
      email: usuarioData.email
    };

    // Crear o encontrar customer
    const response = await axios.post(`${API_BASE_URL}/customers/create-or-find`, customerData);
    
    console.log('✅ Customer procesado:', response.data.data);
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al procesar customer:', error.response?.data || error.message);
    throw error;
  }
}

async function buscarCustomerPorEmail() {
  try {
    console.log('🔍 Buscando customer por email...');
    
    const response = await axios.get(`${API_BASE_URL}/customers/search/email`, {
      params: { email: usuarioData.email }
    });
    
    console.log('📋 Resultado de búsqueda:', response.data);
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error al buscar customer:', error.response?.data || error.message);
    throw error;
  }
}

// Función principal para ejecutar los ejemplos
async function ejecutarEjemplos() {
  try {
    console.log('='.repeat(60));
    console.log('EJEMPLO 1: Crear checkout (link de pago) con customer management automático');
    console.log('='.repeat(60));
    await crearCheckoutConCustomer();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 2: Crear customer por separado');
    console.log('='.repeat(60));
    await crearCustomerSeparadamente();
    
    console.log('\n' + '='.repeat(60));
    console.log('EJEMPLO 3: Buscar customer existente');
    console.log('='.repeat(60));
    await buscarCustomerPorEmail();
    
  } catch (error) {
    console.error('Error en los ejemplos:', error.message);
  }
}

// Ejecutar ejemplos si se llama directamente
if (require.main === module) {
  ejecutarEjemplos();
}

module.exports = {
  crearCheckoutConCustomer,
  crearCustomerSeparadamente,
  buscarCustomerPorEmail,
  ejecutarEjemplos
};
