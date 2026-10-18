import { formatearNota } from '../utils'

function ResumenCuestionario({ resultado, alSalir }) {
  const { aciertos, fallos, nota } = resultado
  const totalPreguntas = aciertos + fallos

  return (
    <section className="pantalla-final" aria-labelledby="titulo-resumen">
      <span className="icono-final" aria-hidden="true">
        ✓
      </span>
      <h1 id="titulo-resumen">Cuestionario completado</h1>
      <p>Has respondido las {totalPreguntas} preguntas de la temática seleccionada.</p>

      <div className="bloque-puntuacion" role="group" aria-label="Resultados del cuestionario">
        <div className="tarjeta-nota">
          <span className="etiqueta-nota">Puntuación final</span>
          <strong className="valor-nota">{formatearNota(nota)}/10</strong>
        </div>
        <div className="estadisticas-resumen">
          <div className="item-estadistica aciertos">
            <span className="etiqueta-estadistica">Aciertos</span>
            <strong className="valor-estadistica">{aciertos}</strong>
          </div>
          <div className="item-estadistica fallos">
            <span className="etiqueta-estadistica">Fallos</span>
            <strong className="valor-estadistica">{fallos}</strong>
          </div>
        </div>
      </div>

      <button className="boton-principal" type="button" onClick={alSalir}>
        Volver a las temáticas
      </button>
    </section>
  )
}

export default ResumenCuestionario
