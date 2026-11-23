const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacion } = require('../app');
const { respuestasDeTematica, enviarCorreccion } = require('./utilidades');

const TEMATICA_ID = 'cat-filosofia';

test('GET /api/historial de una aplicacion nueva llega vacio', async () => {
  const respuesta = await request(crearAplicacion()).get('/api/historial');

  assert.equal(respuesta.status, 200);
  assert.deepEqual(respuesta.body, { historial: [], estadisticas: [] });
});

test('GET /api/historial registra las partidas y calcula las estadisticas', async () => {
  const aplicacion = crearAplicacion();

  for (const correctas of [5, 2]) {
    await enviarCorreccion(aplicacion, {
      tematicaId: TEMATICA_ID,
      respuestas: respuestasDeTematica(TEMATICA_ID, { correctas })
    }).expect(200);
  }

  const respuesta = await request(aplicacion).get('/api/historial');

  assert.equal(respuesta.status, 200);
  assert.deepEqual(
    respuesta.body.historial.map(({ id, aciertos, total, nota }) => ({
      id,
      aciertos,
      total,
      nota
    })),
    [
      { id: 'hist-1', aciertos: 5, total: 5, nota: 10 },
      { id: 'hist-2', aciertos: 2, total: 5, nota: 4 }
    ]
  );
  assert.deepEqual(respuesta.body.estadisticas, [
    { tematicaId: TEMATICA_ID, tematicaNombre: 'Filosofía', totalTests: 2, notaMedia: 7 }
  ]);
});

test('GET /api/historial no comparte partidas entre aplicaciones', async () => {
  const cuerpo = {
    tematicaId: 'cat-lengua',
    respuestas: respuestasDeTematica('cat-lengua', { correctas: 3 })
  };

  for (const aplicacion of [crearAplicacion(), crearAplicacion()]) {
    await enviarCorreccion(aplicacion, cuerpo).expect(200);
    const respuesta = await request(aplicacion).get('/api/historial');

    assert.equal(respuesta.body.historial.length, 1);
    assert.equal(respuesta.body.historial[0].id, 'hist-1');
  }
});
