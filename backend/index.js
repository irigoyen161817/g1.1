const { crearAplicacion } = require('./app');

const PUERTO = process.env.PUERTO || 3000;

crearAplicacion().listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});
