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
  const { tematica } = peticion.query;
  const categoria = datosPreguntas.categorias.find(
    ({ nombre }) => nombre.toLocaleLowerCase() === String(tematica).toLocaleLowerCase()
  );

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

const servidor = aplicacion.listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});

module.exports = { aplicacion, servidor };
