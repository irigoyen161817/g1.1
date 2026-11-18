const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacionPrueba } = require('./utilidades');
const datosPreguntas = require('../datos/preguntas.json');

test('GET /api/tematicas devuelve todas las tematicas sin sus preguntas', async () => {
  const respuesta = await request(crearAplicacionPrueba()).get('/api/tematicas');

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.length, datosPreguntas.categorias.length);

  for (const tematica of respuesta.body) {
    assert.deepEqual(Object.keys(tematica).sort(), ['descripcion', 'id', 'logo', 'nombre']);
  }
});
