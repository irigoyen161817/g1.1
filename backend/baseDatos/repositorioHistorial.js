function crearRepositorioHistorial(db) {
  const insertar = db.prepare(`
    INSERT INTO historial (id, fecha, id_tematica, nombre_tematica, aciertos, total, nota)
    VALUES (@id, @fecha, @id_tematica, @nombre_tematica, @aciertos, @total, @nota)
  `);

  const consultaTodas = db.prepare(`
    SELECT id, fecha, id_tematica AS tematicaId, nombre_tematica AS tematicaNombre, aciertos, total, nota
    FROM historial
    ORDER BY rowid ASC
  `);

  return {
    guardar({ id, fecha, tematicaId, tematicaNombre, aciertos, total, nota }) {
      const entrada = {
        id,
        fecha: fecha || new Date().toISOString(),
        tematicaId,
        tematicaNombre,
        aciertos,
        total,
        nota
      };

      insertar.run({
        id: entrada.id,
        fecha: entrada.fecha,
        id_tematica: entrada.tematicaId,
        nombre_tematica: entrada.tematicaNombre,
        aciertos: entrada.aciertos,
        total: entrada.total,
        nota: entrada.nota
      });

      return entrada;
    },
    obtenerTodas() {
      return consultaTodas.all();
    },
    obtenerSiguienteId() {
      // Determina el identificador siguiente buscando el maximo sufijo numerico en 'hist-X'
      const filas = db.prepare('SELECT id FROM historial').all();
      let maximoNumero = 0;

      for (const { id } of filas) {
        const coincidencia = id.match(/^hist-(\d+)$/);
        if (coincidencia) {
          const numero = Number(coincidencia[1]);
          if (numero > maximoNumero) {
            maximoNumero = numero;
          }
        }
      }

      return `hist-${maximoNumero + 1}`;
    }
  };
}

module.exports = {
  crearRepositorioHistorial
};
