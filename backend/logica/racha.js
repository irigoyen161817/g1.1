const { diasEntre } = require('./fechas');

function calcularNuevaRacha(rachaActual, fechaUltimaPartida, fechaHoy) {
  if (!fechaUltimaPartida) {
    return 1;
  }

  const diasDesdeUltimaPartida = diasEntre(fechaUltimaPartida, fechaHoy);
  if (diasDesdeUltimaPartida === 0) {
    return Math.max(rachaActual, 1);
  }
  if (diasDesdeUltimaPartida === 1) {
    return rachaActual + 1;
  }
  return 1;
}

function obtenerRachaVigente(rachaActual, fechaUltimaPartida, fechaHoy) {
  if (!fechaUltimaPartida) {
    return 0;
  }

  const diasDesdeUltimaPartida = diasEntre(fechaUltimaPartida, fechaHoy);
  return diasDesdeUltimaPartida <= 1 ? rachaActual : 0;
}

module.exports = { calcularNuevaRacha, obtenerRachaVigente };
