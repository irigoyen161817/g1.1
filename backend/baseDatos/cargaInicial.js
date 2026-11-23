const datosPreguntasPorDefecto = require('../datos/preguntas.json');

// Inserta las tematicas y preguntas desde preguntas.json si la tabla tematicas se encuentra vacia
function cargarDatosInicialesSiVacia(db, datos = datosPreguntasPorDefecto) {
  const totalTematicas = db.prepare('SELECT COUNT(*) AS total FROM tematicas').get().total;

  if (totalTematicas > 0) {
    return;
  }

  const insertarTematica = db.prepare(`
    INSERT INTO tematicas (id, nombre, descripcion, logo)
    VALUES (@id, @nombre, @descripcion, @logo)
  `);

  const insertarPregunta = db.prepare(`
    INSERT INTO preguntas (id, id_tematica, enunciado, opciones, respuesta_correcta)
    VALUES (@id, @id_tematica, @enunciado, @opciones, @respuesta_correcta)
  `);

  db.transaction(() => {
    for (const categoria of datos.categorias) {
      insertarTematica.run({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        logo: categoria.logo
      });

      for (const pregunta of categoria.preguntas) {
        insertarPregunta.run({
          id: pregunta.id,
          id_tematica: categoria.id,
          enunciado: pregunta.enunciado,
          opciones: JSON.stringify(pregunta.opciones),
          respuesta_correcta: pregunta.respuestaCorrecta
        });
      }
    }
  })();
}

module.exports = {
  cargarDatosInicialesSiVacia
};
