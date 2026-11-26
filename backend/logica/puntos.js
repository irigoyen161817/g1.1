const PUNTOS_POR_ACIERTO = 10;
const INCREMENTO_POR_DIA_DE_RACHA = 0.1;
const MULTIPLICADOR_MAXIMO = 2;

function calcularMultiplicador(racha) {
  const diasExtra = Math.max(racha, 1) - 1;
  const multiplicador = Math.min(1 + INCREMENTO_POR_DIA_DE_RACHA * diasExtra, MULTIPLICADOR_MAXIMO);
  // Se redondea a un decimal porque 1 + 0.1 * 3 da 1.3000000000000003 en coma flotante
  return Math.round(multiplicador * 10) / 10;
}

function calcularPuntos(aciertos, racha) {
  return Math.round(aciertos * PUNTOS_POR_ACIERTO * calcularMultiplicador(racha));
}

module.exports = { PUNTOS_POR_ACIERTO, calcularMultiplicador, calcularPuntos };
