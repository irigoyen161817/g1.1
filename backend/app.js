const express = require('express');
const cors = require('cors');
const { inicializarBaseDatos, RUTA_BASE_DATOS_POR_DEFECTO } = require('./baseDatos/conexion');
const { crearRepositorioTematicas } = require('./baseDatos/repositorioTematicas');
const { crearRepositorioPreguntas } = require('./baseDatos/repositorioPreguntas');
const { crearRepositorioHistorial } = require('./baseDatos/repositorioHistorial');

const PREGUNTAS_POR_CUESTIONARIO = 5;
const OPCIONES_POR_PREGUNTA = 4;

// Agrupa las entradas del historial por tematica y calcula metricas acumuladas (totalTests y notaMedia)
function calcularEstadisticasHistorial(entradasHistorial) {
  const acumuladosPorTematica = {};

  for (const entrada of entradasHistorial) {
    const { tematicaId, tematicaNombre, nota } = entrada;

    if (!acumuladosPorTematica[tematicaId]) {
      acumuladosPorTematica[tematicaId] = {
        tematicaId,
        tematicaNombre,
        totalTests: 0,
        sumaNotas: 0
      };
    }

    acumuladosPorTematica[tematicaId].totalTests += 1;
    acumuladosPorTematica[tematicaId].sumaNotas += nota;
  }

  return Object.values(acumuladosPorTematica).map(
    ({ tematicaId, tematicaNombre, totalTests, sumaNotas }) => ({
      tematicaId,
      tematicaNombre,
      totalTests,
      notaMedia: Number((sumaNotas / totalTests).toFixed(1))
    })
  );
}

function crearAplicacion({ rutaBaseDatos = process.env.RUTA_BASE_DATOS || ':memory:' } = {}) {
  const aplicacion = express();
  const db = inicializarBaseDatos(rutaBaseDatos);
  const repositorioTematicas = crearRepositorioTematicas(db);
  const repositorioPreguntas = crearRepositorioPreguntas(db);
  const repositorioHistorial = crearRepositorioHistorial(db);

  aplicacion.db = db;

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
    const tematicas = repositorioTematicas.obtenerTodas();
    respuesta.json(tematicas);
  });

  aplicacion.get('/api/preguntas', (peticion, respuesta) => {
    const { tematica, id } = peticion.query;
    let categoria = null;

    if (id) {
      categoria = repositorioTematicas.obtenerPorId(String(id));
    } else if (tematica) {
      categoria = repositorioTematicas.obtenerPorNombre(String(tematica));
    }

    if (!categoria) {
      respuesta.status(404).json({
        error: 'La tematica solicitada no existe'
      });
      return;
    }

    const preguntas = repositorioPreguntas.obtenerPorTematica(categoria.id);
    const preguntasPublicas = [...preguntas]
      .sort(() => Math.random() - 0.5)
      .slice(0, PREGUNTAS_POR_CUESTIONARIO)
      .map((pregunta) => {
        const copia = { ...pregunta };
        delete copia.respuestaCorrecta;
        return copia;
      });

    respuesta.json(preguntasPublicas);
  });

  aplicacion.post('/api/corregir', (peticion, respuesta) => {
    const { tematicaId, respuestas } = peticion.body ?? {};

    if (
      !tematicaId ||
      !Array.isArray(respuestas) ||
      !respuestas.every((elemento) => elemento && typeof elemento === 'object')
    ) {
      respuesta.status(400).json({
        error: 'El cuerpo de la peticion es invalido'
      });
      return;
    }

    const categoria = repositorioTematicas.obtenerPorId(String(tematicaId));

    if (!categoria) {
      respuesta.status(404).json({
        error: 'La tematica solicitada no existe'
      });
      return;
    }

    const preguntasDeTematica = repositorioPreguntas.obtenerPorTematica(categoria.id);

    // GET /api/preguntas sirve un subconjunto de la tematica, asi que se esperan tantas respuestas
    // como preguntas tiene un cuestionario (o todas si la tematica tiene menos), no el total
    const respuestasEsperadas = Math.min(PREGUNTAS_POR_CUESTIONARIO, preguntasDeTematica.length);

    if (respuestas.length !== respuestasEsperadas) {
      respuesta.status(400).json({
        error: `Se esperaban ${respuestasEsperadas} respuestas y se han recibido ${respuestas.length}`
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
      ({ indiceRespuesta }) =>
        Number.isInteger(indiceRespuesta) &&
        indiceRespuesta >= 0 &&
        indiceRespuesta < OPCIONES_POR_PREGUNTA
    );

    if (!tieneIndicesValidos) {
      respuesta.status(400).json({
        error: `Los indices de respuesta deben ser numeros enteros entre 0 y ${OPCIONES_POR_PREGUNTA - 1}`
      });
      return;
    }

    const detalle = [];

    for (const { idPregunta, indiceRespuesta } of respuestas) {
      const pregunta = preguntasDeTematica.find(({ id }) => id === idPregunta);

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

    repositorioHistorial.guardar({
      id: repositorioHistorial.obtenerSiguienteId(),
      tematicaId: categoria.id,
      tematicaNombre: categoria.nombre,
      aciertos,
      total: detalle.length,
      nota
    });

    respuesta.json({ aciertos, fallos, nota, detalle });
  });

  aplicacion.get('/api/historial', (peticion, respuesta) => {
    const listaHistorial = repositorioHistorial.obtenerTodas();
    const estadisticas = calcularEstadisticasHistorial(listaHistorial);

    respuesta.json({
      historial: listaHistorial,
      estadisticas
    });
  });

  return aplicacion;
}

module.exports = {
  crearAplicacion,
  PREGUNTAS_POR_CUESTIONARIO,
  OPCIONES_POR_PREGUNTA,
  RUTA_BASE_DATOS_POR_DEFECTO
};
