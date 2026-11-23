const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacion, PREGUNTAS_POR_CUESTIONARIO, OPCIONES_POR_PREGUNTA } = require('../app');

test('GET /api/preguntas por id devuelve las preguntas del cuestionario sin la respuesta correcta', async () => {
  const respuesta = await request(crearAplicacion()).get('/api/preguntas?id=cat-filosofia');

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.length, PREGUNTAS_POR_CUESTIONARIO);

  for (const pregunta of respuesta.body) {
    assert.ok(pregunta.id.startsWith('preg-fil-'), pregunta.id);
    assert.equal(pregunta.opciones.length, OPCIONES_POR_PREGUNTA);
    assert.equal('respuestaCorrecta' in pregunta, false);
  }
});

test('GET /api/preguntas por nombre no distingue mayusculas', async () => {
  const respuesta = await request(crearAplicacion())
    .get('/api/preguntas')
    .query({ tematica: 'FILOSOFÍA' });

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.length, PREGUNTAS_POR_CUESTIONARIO);
});

test('GET /api/preguntas responde 404 si la tematica no existe', async () => {
  const respuesta = await request(crearAplicacion()).get('/api/preguntas?id=cat-inexistente');

  assert.equal(respuesta.status, 404);
  assert.equal(respuesta.body.error, 'La tematica solicitada no existe');
});

test('GET /api/preguntas responde 404 sin parametros', async () => {
  const respuesta = await request(crearAplicacion()).get('/api/preguntas');

  assert.equal(respuesta.status, 404);
});
