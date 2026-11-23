// Lista ordenada de migraciones versionadas del esquema de SQLite
// Cada migracion debe tener un numero de version incremental unico y no modificarse una vez añadida
const migraciones = [
  {
    version: 1,
    nombre: 'crear_tablas_iniciales',
    ejecutar(db) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS tematicas (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          logo TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS preguntas (
          id TEXT PRIMARY KEY,
          id_tematica TEXT NOT NULL REFERENCES tematicas(id),
          enunciado TEXT NOT NULL,
          opciones TEXT NOT NULL,
          respuesta_correcta INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS historial (
          id TEXT PRIMARY KEY,
          fecha TEXT NOT NULL,
          id_tematica TEXT NOT NULL REFERENCES tematicas(id),
          nombre_tematica TEXT NOT NULL,
          aciertos INTEGER NOT NULL,
          total INTEGER NOT NULL,
          nota REAL NOT NULL
        );
      `);
    }
  }
];

// Ejecuta las migraciones pendientes en orden dentro de una transaccion y actualiza user_version
function ejecutarMigraciones(db) {
  const versionActual = db.pragma('user_version', { simple: true });

  for (const migracion of migraciones) {
    if (migracion.version > versionActual) {
      db.transaction(() => {
        migracion.ejecutar(db);
        db.pragma(`user_version = ${migracion.version}`);
      })();
    }
  }
}

module.exports = {
  migraciones,
  ejecutarMigraciones
};
