// Ejemplos de uso correcto del middleware

// 1. Para customer NUEVO (usará checkout)
const newCustomerRequest = {
    "amount": 50,
    "description": "Compra en línea",
    "currency": "MXN",
    "order_id": "ORD-12345",
    "redirect_url": "https://armafa.com/Usuario/GetTransaction",
    "send_email": "true",
    "customer": {
        "name": "Juan",
        "last_name": "Pérez",
        "phone_number": "5551234567",
        "email": "juan.perez@ejemplo.com"
    }
};

// 2. Para customer EXISTENTE (usará charge)
const existingCustomerRequest = {
    "amount": 50,
    "description": "Compra en línea",
    "currency": "MXN",
    "order_id": "ORD-12345",
    "source_id": "kdx205scoizh93upqbte",  // REQUERIDO: ID de tarjeta guardada
    "method": "card",                     // REQUERIDO: método de pago
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f",  // OPCIONAL: sesión del dispositivo
    "confirm": false,                     // IMPORTANTE: false = pendiente, true = procesar inmediatamente
    "send_email": false,                  // OPCIONAL: enviar email de confirmación
    "redirect_url": "https://armafa.com/Usuario/GetTransaction"  // OPCIONAL: URL de redirección
};

console.log('=== INSTRUCCIONES DE USO ===');
console.log('1. Para customer nuevo, incluye el objeto "customer"');
console.log('2. Para customer existente, incluye "source_id" y "method"');
console.log('3. El sistema detectará automáticamente qué tipo usar');
console.log('');
console.log('=== CAMPO CONFIRM ===');
console.log('• confirm: false = Crear cargo pendiente (requiere confirmación posterior)');
console.log('• confirm: true = Procesar cargo inmediatamente');
console.log('• Por defecto se usa false si no se especifica');
console.log('');
console.log('Customer nuevo:', newCustomerRequest);
console.log('Customer existente:', existingCustomerRequest);
