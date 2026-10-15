import { useState } from 'react'
import ControlesPregunta from './ControlesPregunta'
import PantallaFinalCuestionario from './PantallaFinalCuestionario'
import ProgresoCuestionario from './ProgresoCuestionario'
import TarjetaPregunta from './TarjetaPregunta'

function crearRespuestasIniciales(totalPreguntas) {
  return Array.from({ length: totalPreguntas }, () => null)
}

function PantallaPregunta({ preguntas, alSalir }) {
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [respuestas, setRespuestas] = useState(() => crearRespuestasIniciales(preguntas.length))
  const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false)

  const preguntaActual = preguntas[indicePregunta]
  const respuestaSeleccionada = respuestas[indicePregunta]
  const esUltimaPregunta = indicePregunta === preguntas.length - 1

  const seleccionarRespuesta = (indiceRespuesta) => {
    setRespuestas((respuestasActuales) => {
      const nuevasRespuestas = [...respuestasActuales]
      nuevasRespuestas[indicePregunta] = indiceRespuesta
      return nuevasRespuestas
    })
  }

  const avanzarPregunta = () => {
    if (esUltimaPregunta) {
      setCuestionarioFinalizado(true)
      return
    }

    setIndicePregunta((indiceActual) => indiceActual + 1)
  }

  const retrocederPregunta = () => {
    setIndicePregunta((indiceActual) => indiceActual - 1)
  }

  if (cuestionarioFinalizado) {
    return (
      <main className="pantalla-cuestionario">
        <PantallaFinalCuestionario
          totalPreguntas={preguntas.length}
          alSalir={alSalir}
        />
      </main>
    )
  }

  if (!preguntaActual) {
    return (
      <main className="pantalla-cuestionario">
        <p className="estado-cuestionario" role="status">
          No hay preguntas disponibles.
        </p>
      </main>
    )
  }

  return (
    <main className="pantalla-cuestionario">
      <div className="cabecera-cuestionario">
        <button className="boton-salir" type="button" onClick={alSalir}>
          ← Volver a las temáticas
        </button>
      </div>
      <div className="contenido-cuestionario">
        <ProgresoCuestionario
          numeroPregunta={indicePregunta}
          totalPreguntas={preguntas.length}
          respuestas={respuestas}
        />
        <TarjetaPregunta
          pregunta={preguntaActual}
          respuestaSeleccionada={respuestaSeleccionada}
          alSeleccionarRespuesta={seleccionarRespuesta}
        />
        <ControlesPregunta
          puedeRetroceder={indicePregunta > 0}
          puedeAvanzar={respuestaSeleccionada !== null}
          esUltimaPregunta={esUltimaPregunta}
          alRetroceder={retrocederPregunta}
          alAvanzar={avanzarPregunta}
        />
      </div>
    </main>
  )
}

export default PantallaPregunta
