import OpcionRespuesta from './OpcionRespuesta'
import './TarjetaPregunta.css'

function TarjetaPregunta({ pregunta, respuestaSeleccionada, alSeleccionarRespuesta }) {
  return (
    <article className="tarjeta-pregunta">
      <div className="encabezado-pregunta">
        <span>Pregunta actual</span>
        <h2>{pregunta.enunciado}</h2>
      </div>
      <div className="opciones-respuesta">
        {pregunta.opciones.map((opcion, indice) => (
          <OpcionRespuesta
            key={`${pregunta.id}-${indice}`}
            indice={indice}
            texto={opcion}
            seleccionada={respuestaSeleccionada === indice}
            alSeleccionar={alSeleccionarRespuesta}
          />
        ))}
      </div>
    </article>
  )
}

export default TarjetaPregunta
