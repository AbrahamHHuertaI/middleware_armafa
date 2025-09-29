// Ejemplo de uso del checkout/cargo corregido
const testCheckoutData = {
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

// Ejemplo de cargo con customer existente (usando charges)
const testCustomerChargeData = {
    "amount": 50,
    "description": "Compra en línea",
    "currency": "MXN",
    "order_id": "ORD-12345",
    "source_id": "kdx205scoizh93upqbte",  // ID de la tarjeta guardada
    "method": "card",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f",
    "confirm": false,  // false = crear pendiente, true = procesar inmediatamente
    "send_email": false,
    "redirect_url": "https://armafa.com/Usuario/GetTransaction"
};

console.log('Datos de prueba preparados correctamente');
console.log('Checkout con customer nuevo:', testCheckoutData);
console.log('Cargo con customer existente:', testCustomerChargeData);
