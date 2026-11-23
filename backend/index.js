const { crearAplicacion, RUTA_BASE_DATOS_POR_DEFECTO } = require('./app');

const PUERTO = process.env.PUERTO || 3000;
const RUTA_BASE_DATOS = process.env.RUTA_BASE_DATOS || RUTA_BASE_DATOS_POR_DEFECTO;

crearAplicacion({ rutaBaseDatos: RUTA_BASE_DATOS }).listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});
