const { crearAplicacion } = require('../app');
const datosPreguntas = require('../datos/preguntas.json');

const PREGUNTAS_POR_CUESTIONARIO = 5;

function crearAplicacionPrueba() {
  return crearAplicacion();
}

// Construye un cuerpo valido para POST /api/corregir: las primeras `correctas` respuestas aciertan
// y el resto elige la opcion siguiente a la correcta (modulo 4), que siempre es un fallo
function respuestasDeTematica(tematicaId, { correctas = 0 } = {}) {
  const categoria = datosPreguntas.categorias.find(({ id }) => id === tematicaId);

  return categoria.preguntas
    .slice(0, PREGUNTAS_POR_CUESTIONARIO)
    .map(({ id, respuestaCorrecta }, indice) => ({
      idPregunta: id,
      indiceRespuesta: indice < correctas ? respuestaCorrecta : (respuestaCorrecta + 1) % 4
    }));
}

module.exports = {
  crearAplicacionPrueba,
  respuestasDeTematica
};
