const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacionPrueba, respuestasDeTematica } = require('./utilidades');

const TEMATICA_ID = 'cat-filosofia';

function corregir(cuerpo) {
  return request(crearAplicacionPrueba()).post('/api/corregir').send(cuerpo);
}

test('POST /api/corregir calcula aciertos, fallos y nota', async () => {
  const respuestas = respuestasDeTematica(TEMATICA_ID, { correctas: 4 });
  const respuesta = await corregir({ tematicaId: TEMATICA_ID, respuestas });

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.aciertos, 4);
  assert.equal(respuesta.body.fallos, 1);
  assert.equal(respuesta.body.nota, 8);
  assert.deepEqual(
    respuesta.body.detalle.map(({ esCorrecta }) => esCorrecta),
    [true, true, true, true, false]
  );
});

test('POST /api/corregir responde 400 si el cuerpo es invalido', async () => {
  const sinTematica = await corregir({ respuestas: [] });
  const sinRespuestas = await corregir({ tematicaId: TEMATICA_ID });

  assert.equal(sinTematica.status, 400);
  assert.equal(sinRespuestas.status, 400);
  assert.equal(sinTematica.body.error, 'El cuerpo de la peticion es invalido');
});

test('POST /api/corregir responde 400 si el numero de respuestas no coincide', async () => {
  const respuestas = respuestasDeTematica(TEMATICA_ID).slice(0, 4);
  const respuesta = await corregir({ tematicaId: TEMATICA_ID, respuestas });

  assert.equal(respuesta.status, 400);
  assert.equal(respuesta.body.error, 'Se esperaban 5 respuestas y se han recibido 4');
});

test('POST /api/corregir responde 400 si hay preguntas duplicadas', async () => {
  const respuestas = respuestasDeTematica(TEMATICA_ID);
  respuestas[1] = { ...respuestas[0] };
  const respuesta = await corregir({ tematicaId: TEMATICA_ID, respuestas });

  assert.equal(respuesta.status, 400);
  assert.equal(respuesta.body.error, 'Las respuestas contienen preguntas duplicadas');
});

test('POST /api/corregir responde 400 si un indice no es un entero entre 0 y 3', async () => {
  for (const indiceInvalido of [4, -1, 1.5, '1']) {
    const respuestas = respuestasDeTematica(TEMATICA_ID);
    respuestas[0].indiceRespuesta = indiceInvalido;
    const respuesta = await corregir({ tematicaId: TEMATICA_ID, respuestas });

    assert.equal(respuesta.status, 400, `indice ${JSON.stringify(indiceInvalido)}`);
  }
});

test('POST /api/corregir responde 404 si la tematica no existe', async () => {
  const respuestas = respuestasDeTematica(TEMATICA_ID);
  const respuesta = await corregir({ tematicaId: 'cat-inexistente', respuestas });

  assert.equal(respuesta.status, 404);
  assert.equal(respuesta.body.error, 'La tematica solicitada no existe');
});

test('POST /api/corregir responde 404 si una pregunta no existe', async () => {
  const respuestas = respuestasDeTematica(TEMATICA_ID);
  respuestas[0].idPregunta = 'preg-inexistente';
  const respuesta = await corregir({ tematicaId: TEMATICA_ID, respuestas });

  assert.equal(respuesta.status, 404);
  assert.equal(respuesta.body.error, 'La pregunta solicitada no existe');
});
