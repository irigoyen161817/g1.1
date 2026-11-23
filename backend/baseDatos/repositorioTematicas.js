function crearRepositorioTematicas(db) {
  const consultaTodas = db.prepare('SELECT id, nombre, descripcion, logo FROM tematicas');
  const consultaPorId = db.prepare(
    'SELECT id, nombre, descripcion, logo FROM tematicas WHERE id = ?'
  );

  return {
    obtenerTodas() {
      return consultaTodas.all();
    },
    obtenerPorId(id) {
      return consultaPorId.get(id);
    },
    obtenerPorNombre(nombre) {
      const nombreBuscado = String(nombre).toLocaleLowerCase();
      return (
        consultaTodas
          .all()
          .find((tematica) => tematica.nombre.toLocaleLowerCase() === nombreBuscado) || null
      );
    }
  };
}

module.exports = {
  crearRepositorioTematicas
};
