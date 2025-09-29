const request = require('supertest');
const app = require('../src/app');

describe('OpenPay Middleware API', () => {
  describe('GET /', () => {
    it('debería devolver información de la API', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body).toHaveProperty('message', 'OpenPay Middleware API');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('status', 'active');
    });
  });

  describe('POST /api/charges', () => {
    it('debería rechazar request sin datos requeridos', async () => {
      const res = await request(app)
        .post('/api/charges')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('debería rechazar datos inválidos', async () => {
      const invalidData = {
        method: 'invalid_method',
        amount: -100,
        description: ''
      };

      const res = await request(app)
        .post('/api/charges')
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/charges/methods/payment', () => {
    it('debería devolver métodos de pago disponibles', async () => {
      const res = await request(app)
        .get('/api/charges/methods/payment')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('card');
      expect(res.body.data).toHaveProperty('bank_account');
      expect(res.body.data).toHaveProperty('store');
    });
  });

  describe('POST /api/webhooks', () => {
    it('debería rechazar webhook sin URL', async () => {
      const res = await request(app)
        .post('/api/webhooks')
        .send({
          events: ['charge.succeeded']
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('debería rechazar webhook sin eventos', async () => {
      const res = await request(app)
        .post('/api/webhooks')
        .send({
          url: 'https://example.com/webhook'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/webhooks/events/types', () => {
    it('debería devolver tipos de eventos disponibles', async () => {
      const res = await request(app)
        .get('/api/webhooks/events/types')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toContain('charge.succeeded');
      expect(res.body.data).toContain('charge.failed');
    });
  });

  describe('POST /api/webhooks/receive', () => {
    it('debería rechazar webhook sin firma', async () => {
      const res = await request(app)
        .post('/api/webhooks/receive')
        .send({
          type: 'charge.succeeded',
          id: 'test_id'
        })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Rutas no encontradas', () => {
    it('debería devolver 404 para rutas inexistentes', async () => {
      const res = await request(app)
        .get('/ruta/inexistente')
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Ruta no encontrada');
    });
  });
});
