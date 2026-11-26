const ZONA_HORARIA = 'Europe/Madrid';
const MILISEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

// El formato en-CA da la fecha como AAAA-MM-DD, que es lo que se guarda y se compara
const formateadorFechaLocal = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_HORARIA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function obtenerFechaLocal(fecha) {
  return formateadorFechaLocal.format(new Date(fecha));
}

// Cada fecha local se lleva a medianoche UTC antes de restar: en UTC todos los dias duran 24 h,
// asi el dia de 23 o 25 h del cambio de hora de Madrid no deja la resta con decimales
function diasEntre(fechaA, fechaB) {
  const medianocheA = Date.parse(`${obtenerFechaLocal(fechaA)}T00:00:00Z`);
  const medianocheB = Date.parse(`${obtenerFechaLocal(fechaB)}T00:00:00Z`);
  return Math.round((medianocheB - medianocheA) / MILISEGUNDOS_POR_DIA);
}

module.exports = { ZONA_HORARIA, obtenerFechaLocal, diasEntre };
