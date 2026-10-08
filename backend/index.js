const express = require('express');
const cors = require('cors');

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

const servidor = aplicacion.listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});

module.exports = { aplicacion, servidor };
