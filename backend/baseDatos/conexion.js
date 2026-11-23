const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { ejecutarMigraciones } = require('./migraciones');
const { cargarDatosInicialesSiVacia } = require('./cargaInicial');

const RUTA_BASE_DATOS_POR_DEFECTO = path.join(__dirname, '..', 'datos', 'eduquest.db');

// Inicializa la conexion SQLite, activa claves foraneas y WAL, y aplica migraciones y carga inicial
function inicializarBaseDatos(ruta = RUTA_BASE_DATOS_POR_DEFECTO) {
  if (ruta !== ':memory:') {
    const carpeta = path.dirname(ruta);
    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync(carpeta, { recursive: true });
    }
  }

  const db = new Database(ruta);
  db.pragma('foreign_keys = ON');

  if (ruta !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }

  ejecutarMigraciones(db);
  cargarDatosInicialesSiVacia(db);

  return db;
}

module.exports = {
  inicializarBaseDatos,
  RUTA_BASE_DATOS_POR_DEFECTO
};
