export function formatearNota(nota) {
  return nota.toLocaleString('es-ES', { maximumFractionDigits: 1 })
}
