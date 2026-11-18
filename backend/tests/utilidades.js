const request = require('supertest');
const { crearAplicacion, PREGUNTAS_POR_CUESTIONARIO, OPCIONES_POR_PREGUNTA } = require('../app');
const datosPreguntas = require('../datos/preguntas.json');

function crearAplicacionPrueba() {
  return crearAplicacion();
}

// Construye un cuerpo valido para POST /api/corregir: las primeras `correctas` respuestas aciertan
// y el resto elige la opcion siguiente a la correcta (modulo OPCIONES_POR_PREGUNTA), que siempre es un fallo
function respuestasDeTematica(tematicaId, { correctas = 0 } = {}) {
  const categoria = datosPreguntas.categorias.find(({ id }) => id === tematicaId);

  if (!categoria) {
    throw new Error(`La tematica ${tematicaId} no existe en datos/preguntas.json`);
  }

  return categoria.preguntas
    .slice(0, PREGUNTAS_POR_CUESTIONARIO)
    .map(({ id, respuestaCorrecta }, indice) => ({
      idPregunta: id,
      indiceRespuesta:
        indice < correctas ? respuestaCorrecta : (respuestaCorrecta + 1) % OPCIONES_POR_PREGUNTA
    }));
}

function enviarCorreccion(aplicacion, cuerpo) {
  return request(aplicacion).post('/api/corregir').send(cuerpo);
}

module.exports = {
  crearAplicacionPrueba,
  respuestasDeTematica,
  enviarCorreccion
};
