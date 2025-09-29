#!/bin/bash

# Script de prueba directo con curl para verificar el formato correcto de OpenPay
# Basado en el ejemplo oficial de OpenPay

echo "🧪 Probando creación de webhook con curl..."

# Reemplaza estos valores con tus credenciales reales
MERCHANT_ID="mzdtln0bmtms6o3kck8f"
PRIVATE_KEY="sk_e568c42a6c384b7ab02cd47d2e407cab"
WEBHOOK_URL="https://qa-middleware.dkvzeq.easypanel.host/api/webhooks/receive"

curl https://sandbox-api.openpay.mx/v1/$MERCHANT_ID/webhooks \
   -u $PRIVATE_KEY: \
   -H "Content-type: application/json" \
   -X POST -d "{
    \"url\" : \"$WEBHOOK_URL\",
    \"user\" : \"webhook_user\",
    \"password\" : \"webhook_password\",
    \"event_types\" : [
      \"charge.succeeded\",
      \"charge.failed\",
      \"charge.cancelled\",
      \"charge.refunded\",
      \"payout.created\",
      \"payout.succeeded\",
      \"payout.failed\"
    ]
}"

echo ""
echo "✅ Prueba completada"
