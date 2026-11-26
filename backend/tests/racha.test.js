const { test } = require('node:test');
const assert = require('node:assert/strict');
const { obtenerFechaLocal, diasEntre } = require('../logica/fechas');
const { calcularNuevaRacha, obtenerRachaVigente } = require('../logica/racha');

test('obtenerFechaLocal devuelve el dia en hora de Madrid', () => {
  assert.equal(obtenerFechaLocal('2026-11-25T23:30:00Z'), '2026-11-26');
  assert.equal(obtenerFechaLocal('2026-07-15T21:59:00Z'), '2026-07-15');
  assert.equal(obtenerFechaLocal('2026-07-15T22:00:00Z'), '2026-07-16');
});

test('la primera partida empieza una racha de 1', () => {
  assert.equal(calcularNuevaRacha(0, null, '2026-11-26T10:00:00Z'), 1);
});

test('jugar el mismo dia no cambia la racha', () => {
  assert.equal(calcularNuevaRacha(3, '2026-11-26T08:00:00Z', '2026-11-26T20:00:00Z'), 3);
});

test('jugar al dia siguiente suma 1 a la racha', () => {
  assert.equal(calcularNuevaRacha(3, '2026-11-25T22:00:00Z', '2026-11-26T10:00:00Z'), 4);
});

test('saltarse un dia reinicia la racha a 1', () => {
  assert.equal(calcularNuevaRacha(5, '2026-11-24T10:00:00Z', '2026-11-26T10:00:00Z'), 1);
});

test('la racha continua en el cambio de año', () => {
  assert.equal(calcularNuevaRacha(2, '2026-12-31T20:00:00Z', '2027-01-01T10:00:00Z'), 3);
});

test('el cambio de hora de octubre no altera la cuenta de dias', () => {
  // Sabado y domingo a las 00:30 y lunes a las 23:30 en Madrid; el domingo 25 dura 25 h
  const sabado = '2026-10-23T22:30:00Z';
  const domingo = '2026-10-24T22:30:00Z';
  const lunes = '2026-10-26T22:30:00Z';

  assert.equal(diasEntre(sabado, domingo), 1);
  assert.equal(diasEntre(domingo, lunes), 1);
  assert.equal(calcularNuevaRacha(1, sabado, domingo), 2);
  assert.equal(calcularNuevaRacha(2, domingo, lunes), 3);
});

test('la racha vigente se mantiene si la ultima partida fue hoy o ayer', () => {
  assert.equal(obtenerRachaVigente(4, '2026-11-26T09:00:00Z', '2026-11-26T18:00:00Z'), 4);
  assert.equal(obtenerRachaVigente(4, '2026-11-25T09:00:00Z', '2026-11-26T18:00:00Z'), 4);
});

test('la racha vigente es 0 si la ultima partida fue antes de ayer o no hay partidas', () => {
  assert.equal(obtenerRachaVigente(4, '2026-11-24T09:00:00Z', '2026-11-26T18:00:00Z'), 0);
  assert.equal(obtenerRachaVigente(0, null, '2026-11-26T18:00:00Z'), 0);
});
