const express = require('express');
const cors = require('cors');
const datosPreguntas = require('./datos/preguntas.json');

const aplicacion = express();
const PUERTO = process.env.PUERTO || 3000;

aplicacion.use(cors());

aplicacion.use(express.json());

aplicacion.get('/', (peticion, respuesta) => {
  respuesta.send('Servidor backend funcionando correctamente');
});

aplicacion.get('/api/mensajes', (peticion, respuesta) => {
  respuesta.json({
    estado: 'conectado',
    mensaje: 'Servidor backend conectado exitosamente con el frontend',
    marcaTiempo: new Date().toISOString()
  });
});

aplicacion.get('/api/tematicas', (peticion, respuesta) => {
  const tematicas = datosPreguntas.categorias.map(({ id, nombre, descripcion, logo }) => ({
    id,
    nombre,
    descripcion,
    logo
  }));

  respuesta.json(tematicas);
});

aplicacion.get('/api/preguntas', (peticion, respuesta) => {
  const { tematica, id } = peticion.query;
  const categoria = datosPreguntas.categorias.find(({ id: categoriaId, nombre }) => {
    if (id) {
      return categoriaId === String(id);
    }

    return nombre.toLocaleLowerCase() === String(tematica).toLocaleLowerCase();
  });

  if (!categoria) {
    respuesta.status(404).json({
      error: 'La tematica solicitada no existe'
    });
    return;
  }

  const preguntas = [...categoria.preguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((pregunta) => {
      const preguntaPublica = { ...pregunta };
      delete preguntaPublica.respuestaCorrecta;
      return preguntaPublica;
    });

  respuesta.json(preguntas);
});

aplicacion.post('/api/corregir', (peticion, respuesta) => {
  const { tematicaId, respuestas } = peticion.body ?? {};

  if (!tematicaId || !Array.isArray(respuestas)) {
    respuesta.status(400).json({
      error: 'El cuerpo de la peticion es invalido'
    });
    return;
  }

  const categoria = datosPreguntas.categorias.find(({ id }) => id === String(tematicaId));

  if (!categoria) {
    respuesta.status(404).json({
      error: 'La tematica solicitada no existe'
    });
    return;
  }

  if (respuestas.length !== categoria.preguntas.length) {
    respuesta.status(400).json({
      error: 'Las respuestas enviadas estan incompletas'
    });
    return;
  }

  const idsPreguntasUnicos = new Set(respuestas.map(({ idPregunta }) => idPregunta));

  if (idsPreguntasUnicos.size !== respuestas.length) {
    respuesta.status(400).json({
      error: 'Las respuestas contienen preguntas duplicadas'
    });
    return;
  }

  const tieneIndicesValidos = respuestas.every(
    ({ indiceRespuesta }) => Number.isInteger(indiceRespuesta) && indiceRespuesta >= 0 && indiceRespuesta <= 3
  );

  if (!tieneIndicesValidos) {
    respuesta.status(400).json({
      error: 'Los indices de respuesta deben ser numeros enteros entre 0 y 3'
    });
    return;
  }

  const detalle = [];

  for (const { idPregunta, indiceRespuesta } of respuestas) {
    const pregunta = categoria.preguntas.find(({ id }) => id === idPregunta);

    if (!pregunta) {
      respuesta.status(404).json({
        error: 'La pregunta solicitada no existe'
      });
      return;
    }

    detalle.push({
      idPregunta,
      respuestaSeleccionada: indiceRespuesta,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      esCorrecta: indiceRespuesta === pregunta.respuestaCorrecta
    });
  }

  const aciertos = detalle.filter(({ esCorrecta }) => esCorrecta).length;
  const fallos = detalle.length - aciertos;
  const nota = Number(((aciertos / detalle.length) * 10).toFixed(1));

  respuesta.json({ aciertos, fallos, nota, detalle });
});

const servidor = aplicacion.listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});

module.exports = { aplicacion, servidor };
