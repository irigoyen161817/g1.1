const fs = require('fs');
const path = require('path');
const os = require('os');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { crearAplicacion } = require('../app');
const { inicializarBaseDatos } = require('../baseDatos/conexion');
const { cargarDatosInicialesSiVacia } = require('../baseDatos/cargaInicial');
const { respuestasDeTematica, enviarCorreccion } = require('./utilidades');
const datosPreguntas = require('../datos/preguntas.json');

const TEMATICA_ID = 'cat-filosofia';

test('las migraciones dejan user_version al dia y crean las tablas requeridas', () => {
  const db = inicializarBaseDatos(':memory:');
  const userVersion = db.pragma('user_version', { simple: true });

  assert.equal(userVersion, 1);

  const tablas = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all()
    .map(({ name }) => name);

  assert.ok(tablas.includes('tematicas'));
  assert.ok(tablas.includes('preguntas'));
  assert.ok(tablas.includes('historial'));

  db.close();
});

test('la carga inicial no duplica datos al reinicializar la base de datos', () => {
  const db = inicializarBaseDatos(':memory:');

  const totalTematicasAntes = db.prepare('SELECT COUNT(*) AS total FROM tematicas').get().total;
  const totalPreguntasAntes = db.prepare('SELECT COUNT(*) AS total FROM preguntas').get().total;

  assert.equal(totalTematicasAntes, datosPreguntas.categorias.length);

  // Invocar la carga inicial de nuevo no debe insertar registros duplicados
  cargarDatosInicialesSiVacia(db);

  const totalTematicasDespues = db.prepare('SELECT COUNT(*) AS total FROM tematicas').get().total;
  const totalPreguntasDespues = db.prepare('SELECT COUNT(*) AS total FROM preguntas').get().total;

  assert.equal(totalTematicasDespues, totalTematicasAntes);
  assert.equal(totalPreguntasDespues, totalPreguntasAntes);

  db.close();
});

test('el historial se conserva y continua la secuencia al cerrar y reabrir la base', async () => {
  const rutaTemporal = path.join(
    os.tmpdir(),
    `eduquest-test-persistencia-${Date.now()}-${Math.random().toString(36).slice(2)}.db`
  );

  try {
    // 1. Primera sesion: registrar una partida y comprobar que se guarda en hist-1
    const aplicacion1 = crearAplicacion({ rutaBaseDatos: rutaTemporal });
    const respuestas1 = respuestasDeTematica(TEMATICA_ID, { correctas: 5 });

    await enviarCorreccion(aplicacion1, {
      tematicaId: TEMATICA_ID,
      respuestas: respuestas1
    }).expect(200);

    const respuesta1 = await request(aplicacion1).get('/api/historial');
    assert.equal(respuesta1.status, 200);
    assert.equal(respuesta1.body.historial.length, 1);
    assert.equal(respuesta1.body.historial[0].id, 'hist-1');

    // Cerrar la primera conexion para simular reinicio del servidor
    aplicacion1.db.close();

    // 2. Segunda sesion: reabrir la base en disco y verificar que la partida sigue ahi
    const aplicacion2 = crearAplicacion({ rutaBaseDatos: rutaTemporal });
    const respuesta2 = await request(aplicacion2).get('/api/historial');

    assert.equal(respuesta2.status, 200);
    assert.equal(respuesta2.body.historial.length, 1);
    assert.equal(respuesta2.body.historial[0].id, 'hist-1');
    assert.equal(respuesta2.body.historial[0].nota, 10);

    // 3. Registrar una segunda partida y verificar que genera hist-2 sin colisionar
    const respuestas2 = respuestasDeTematica(TEMATICA_ID, { correctas: 3 });

    await enviarCorreccion(aplicacion2, {
      tematicaId: TEMATICA_ID,
      respuestas: respuestas2
    }).expect(200);

    const respuesta3 = await request(aplicacion2).get('/api/historial');
    assert.equal(respuesta3.status, 200);
    assert.equal(respuesta3.body.historial.length, 2);
    assert.equal(respuesta3.body.historial[1].id, 'hist-2');

    aplicacion2.db.close();
  } finally {
    // Limpieza del archivo temporal y ficheros wal/shm
    for (const extension of ['', '-wal', '-shm']) {
      const fichero = `${rutaTemporal}${extension}`;
      if (fs.existsSync(fichero)) {
        try {
          fs.unlinkSync(fichero);
        } catch {
          // Ignorar errores de eliminacion temporal si el proceso todavia tiene lock
        }
      }
    }
  }
});
