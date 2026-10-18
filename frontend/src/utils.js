export function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatearNota(nota) {
  return nota.toLocaleString('es-ES', { maximumFractionDigits: 1 })
}

export function obtenerClaseNota(nota) {
  if (nota >= 8) {
    return 'nota-alta'
  }

  return nota >= 5 ? 'nota-media' : 'nota-baja'
}
