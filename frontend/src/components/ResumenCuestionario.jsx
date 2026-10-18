import DetallePregunta from './DetallePregunta'
import { formatearNota } from '../utils'
import './ResumenCuestionario.css'

function ResumenCuestionario({ resultado, preguntas, alSalir }) {
  const { aciertos, fallos, nota, detalle } = resultado
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

      {detalle.length > 0 && (
        <div className="contenedor-detalle-preguntas">
          <div className="lista-detalles-preguntas">
            <h2 className="titulo-detalles">Detalle de respuestas</h2>
            {detalle.map((detalleItem, indice) => {
              const preguntaCorrespondiente = preguntas.find(
                (pregunta) => pregunta.id === detalleItem.idPregunta,
              )
              return (
                <DetallePregunta
                  key={detalleItem.idPregunta}
                  numero={indice + 1}
                  pregunta={preguntaCorrespondiente}
                  detalle={detalleItem}
                />
              )
            })}
          </div>
        </div>
      )}

      <button className="boton-principal" type="button" onClick={alSalir}>
        Volver a las temáticas
      </button>
    </section>
  )
}

export default ResumenCuestionario
