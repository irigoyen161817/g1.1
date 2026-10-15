function ControlesPregunta({
  puedeRetroceder,
  puedeAvanzar,
  esUltimaPregunta,
  alRetroceder,
  alAvanzar,
}) {
  return (
    <nav className="controles-pregunta" aria-label="Navegacion del cuestionario">
      <button
        className="boton-secundario"
        type="button"
        onClick={alRetroceder}
        disabled={!puedeRetroceder}
      >
        Anterior
      </button>
      <button
        className="boton-principal"
        type="button"
        onClick={alAvanzar}
        disabled={!puedeAvanzar}
      >
        {esUltimaPregunta ? 'Finalizar' : 'Siguiente'}
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}

export default ControlesPregunta
