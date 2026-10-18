import './ControlesPregunta.css'

function ControlesPregunta({
  puedeRetroceder,
  puedeAvanzar,
  esUltimaPregunta,
  estaCargando = false,
  alRetroceder,
  alAvanzar,
}) {
  return (
    <nav className="controles-pregunta" aria-label="Navegacion del cuestionario">
      <button
        className="boton-secundario"
        type="button"
        onClick={alRetroceder}
        disabled={!puedeRetroceder || estaCargando}
      >
        Anterior
      </button>
      <button
        className="boton-principal"
        type="button"
        onClick={alAvanzar}
        disabled={!puedeAvanzar || estaCargando}
      >
        {estaCargando ? 'Corrigiendo...' : esUltimaPregunta ? 'Finalizar' : 'Siguiente'}
        {!estaCargando && <span aria-hidden="true">→</span>}
      </button>
    </nav>
  )
}

export default ControlesPregunta
