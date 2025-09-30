/**
 * Test específico para el formato problemático de payload
 */

const { procesarPedido } = require('./order-processing');

// Test del formato problemático específico
async function testFormatoProblematico() {
  console.log('🧪 Probando formato problemático...\n');
  
  const payloadProblematico = {
    '{\n    "id": 26,\n    "Usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",\n    "NoOrden": "ORD-1759243942019-646",\n    "Total": "1299.20000",\n    "Subtotal": "1299.20000",\n    "IVA": "1299.20000",\n    "IdTransaccion": "tr96gosfohu8fwn5l86z",\n    "Estatus": "Pagado",\n    "Url_de_pago": "https://sandbox-api.openpay.mx/v1/mrnqcupnxje2fiajbl0b/charges/tr96gosfohu8fwn5l86z/card_capture",\n    "Nombre": "comprador2s",\n    "Apellidos": "comprador2",\n    "Email": "comprador2@mailinator.com",\n    "Telefono": "4773804422",\n    "Direccion": "asdasd",\n    "Ciudad": "Jerécuaro",\n    "Estado": "Guanajuato ",\n    "Codigo_Postal": "37420",\n    "Referencias": "",\n    "Productos": "': {
      '{"id":1,"nombre":"BLOQUES DECORATIVO 3D TIPO TRIANGULO","cantidad":1,"precioUnitario":649.6,"total":649.6},{"id":3,"nombre":"BLOQUES DECORATIVO 3D TIPO HOJAS","cantidad":1,"precioUnitario":649.6,"total":649.6}': ''
    }
  };

  try {
    console.log('📥 Payload problemático recibido:');
    console.log(JSON.stringify(payloadProblematico, null, 2));
    console.log('\n🔄 Procesando...\n');
    
    const resultado = await procesarPedido(payloadProblematico);
    
    console.log('✅ Resultado exitoso:');
    console.log(JSON.stringify(resultado, null, 2));
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    throw error;
  }
}

// Test del formato normal para comparación
async function testFormatoNormal() {
  console.log('🧪 Probando formato normal...\n');
  
  const payloadNormal = {
    "id": 26,
    "Usuario": "4f9726da-4499-4c1e-98c8-f5f47be6ba8b",
    "NoOrden": "ORD-1759243942019-646",
    "Total": "1299.20000",
    "Subtotal": "1299.20000",
    "IVA": "1299.20000",
    "IdTransaccion": "tr96gosfohu8fwn5l86z",
    "Estatus": "Pagado",
    "Url_de_pago": "https://sandbox-api.openpay.mx/v1/mrnqcupnxje2fiajbl0b/charges/tr96gosfohu8fwn5l86z/card_capture",
    "Nombre": "comprador2s",
    "Apellidos": "comprador2",
    "Email": "comprador2@mailinator.com",
    "Telefono": "4773804422",
    "Direccion": "asdasd",
    "Ciudad": "Jerécuaro",
    "Estado": "Guanajuato ",
    "Codigo_Postal": "37420",
    "Referencias": "",
    "Productos": JSON.stringify([
      {"id":1,"nombre":"BLOQUES DECORATIVO 3D TIPO TRIANGULO","cantidad":1,"precioUnitario":649.6,"total":649.6},
      {"id":3,"nombre":"BLOQUES DECORATIVO 3D TIPO HOJAS","cantidad":1,"precioUnitario":649.6,"total":649.6}
    ]),
    "Numero_De_Contrato": null,
    "OpenPayTransactionId": null,
    "OpenPayAuthorizationCode": null,
    "OpenPayMethod": null,
    "OpenPayStatus": null,
    "OpenPayAmount": null,
    "OpenPayCardType": null,
    "OpenPayCardBrand": null,
    "OpenPayCardNumber": null,
    "OpenPayBankName": null
  };

  try {
    console.log('📥 Payload normal recibido:');
    console.log(JSON.stringify(payloadNormal, null, 2));
    console.log('\n🔄 Procesando...\n');
    
    const resultado = await procesarPedido(payloadNormal);
    
    console.log('✅ Resultado exitoso:');
    console.log(JSON.stringify(resultado, null, 2));
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    throw error;
  }
}

// Ejecutar ambos tests
async function ejecutarTests() {
  console.log('🚀 Iniciando tests de normalización de payload\n');
  console.log('=' .repeat(60));
  
  try {
    // Test formato normal
    await testFormatoNormal();
    
    console.log('\n' + '=' .repeat(60));
    
    // Test formato problemático
    await testFormatoProblematico();
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Todos los tests completados exitosamente!');
    
  } catch (error) {
    console.error('\n💥 Error en los tests:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarTests();
}

module.exports = {
  testFormatoNormal,
  testFormatoProblematico,
  ejecutarTests
};
