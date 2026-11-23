function crearRepositorioPreguntas(db) {
  const consultaPorTematica = db.prepare(
    'SELECT id, enunciado, opciones, respuesta_correcta AS respuestaCorrecta FROM preguntas WHERE id_tematica = ?'
  );
  const consultaPorId = db.prepare(
    'SELECT id, enunciado, opciones, respuesta_correcta AS respuestaCorrecta FROM preguntas WHERE id = ?'
  );

  function formatearPregunta(fila) {
    if (!fila) {
      return null;
    }

    return {
      id: fila.id,
      enunciado: fila.enunciado,
      opciones: JSON.parse(fila.opciones),
      respuestaCorrecta: fila.respuestaCorrecta
    };
  }

  return {
    obtenerPorTematica(idTematica) {
      const filas = consultaPorTematica.all(idTematica);
      return filas.map(formatearPregunta);
    },
    obtenerPorId(id) {
      const fila = consultaPorId.get(id);
      return formatearPregunta(fila);
    }
  };
}

module.exports = {
  crearRepositorioPreguntas
};
