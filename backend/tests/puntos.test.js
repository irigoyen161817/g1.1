const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calcularMultiplicador, calcularPuntos } = require('../logica/puntos');

test('el multiplicador sube 0,1 por dia de racha', () => {
  assert.equal(calcularMultiplicador(1), 1);
  assert.equal(calcularMultiplicador(2), 1.1);
  assert.equal(calcularMultiplicador(4), 1.3);
});

test('el multiplicador nunca supera x2', () => {
  assert.equal(calcularMultiplicador(11), 2);
  assert.equal(calcularMultiplicador(30), 2);
});

test('calcularPuntos aplica el multiplicador y redondea al entero', () => {
  assert.equal(calcularPuntos(5, 1), 50);
  assert.equal(calcularPuntos(3, 4), 39);
  assert.equal(calcularPuntos(0, 7), 0);
  assert.equal(calcularPuntos(5, 11), 100);
});
