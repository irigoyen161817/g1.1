const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacionPrueba } = require('./utilidades');

test('GET /api/preguntas por id devuelve 5 preguntas sin la respuesta correcta', async () => {
  const respuesta = await request(crearAplicacionPrueba()).get('/api/preguntas?id=cat-filosofia');

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.length, 5);

  for (const pregunta of respuesta.body) {
    assert.match(pregunta.id, /^preg-fil-/);
    assert.equal(pregunta.opciones.length, 4);
    assert.equal('respuestaCorrecta' in pregunta, false);
  }
});

test('GET /api/preguntas por nombre no distingue mayusculas', async () => {
  const respuesta = await request(crearAplicacionPrueba())
    .get('/api/preguntas')
    .query({ tematica: 'FILOSOFÍA' });

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.length, 5);
});

test('GET /api/preguntas responde 404 si la tematica no existe', async () => {
  const respuesta = await request(crearAplicacionPrueba()).get('/api/preguntas?id=cat-inexistente');

  assert.equal(respuesta.status, 404);
  assert.equal(respuesta.body.error, 'La tematica solicitada no existe');
});

test('GET /api/preguntas responde 404 sin parametros', async () => {
  const respuesta = await request(crearAplicacionPrueba()).get('/api/preguntas');

  assert.equal(respuesta.status, 404);
});
