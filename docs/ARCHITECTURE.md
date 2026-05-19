# Arquitectura FONDIX PAY

## Principio de producto

La app no intenta sentirse como banco. El flujo principal es corto:

```txt
Abrir app -> ver servicios pendientes -> pagar -> recibir comprobante
```

## Backend

FastAPI expone una API modular:

- `auth`: telefono, OTP mock y JWT.
- `users`: perfil minimo.
- `service_providers`: catalogo de proveedores.
- `user_services`: servicios guardados por usuario.
- `payments`: creacion y simulacion de pago.
- `receipts`: comprobantes.
- `notifications`: mensajes simples.
- `integrations/aggregator_mock`: reemplazable por agregadores reales.

## Mobile

Expo mantiene una navegacion simple:

- Onboarding
- Login por telefono
- OTP
- Home
- Agregar servicio
- Detalle de servicio
- Confirmar pago
- Exito
- Historial
- Perfil

## Integraciones

No hay pagos reales en esta version. La integracion mock simula:

- consulta de saldo
- pago de servicio
- generacion de comprobante

