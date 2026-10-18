import { useState } from 'react'
import ControlesPregunta from './ControlesPregunta'
import ResumenCuestionario from './ResumenCuestionario'
import ProgresoCuestionario from './ProgresoCuestionario'
import TarjetaPregunta from './TarjetaPregunta'

function crearRespuestasIniciales(totalPreguntas) {
  return Array.from({ length: totalPreguntas }, () => null)
}

function construirCuerpoCorreccion(tematicaId, preguntas, respuestas) {
  return {
    tematicaId,
    respuestas: preguntas.map((pregunta, indice) => ({
      idPregunta: pregunta.id,
      indiceRespuesta: respuestas[indice],
    })),
  }
}

function PantallaPregunta({ tematicaId, preguntas, alSalir }) {
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [respuestas, setRespuestas] = useState(() => crearRespuestasIniciales(preguntas.length))
  const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false)
  const [estaCorrigiendo, setEstaCorrigiendo] = useState(false)
  const [resultadoCuestionario, setResultadoCuestionario] = useState(null)
  const [mensajeErrorCorreccion, setMensajeErrorCorreccion] = useState('')

  const preguntaActual = preguntas[indicePregunta]
  const respuestaSeleccionada = respuestas[indicePregunta]
  const esUltimaPregunta = indicePregunta === preguntas.length - 1

  const seleccionarRespuesta = (indiceRespuesta) => {
    if (estaCorrigiendo) {
      return
    }

    setMensajeErrorCorreccion('')
    setRespuestas((respuestasActuales) => {
      const nuevasRespuestas = [...respuestasActuales]
      nuevasRespuestas[indicePregunta] = indiceRespuesta
      return nuevasRespuestas
    })
  }

  const corregirCuestionario = async () => {
    if (estaCorrigiendo) {
      return
    }

    setEstaCorrigiendo(true)
    setMensajeErrorCorreccion('')

    try {
      const cuerpo = construirCuerpoCorreccion(tematicaId, preguntas, respuestas)
      const respuesta = await fetch('/api/corregir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cuerpo),
      })

      if (!respuesta.ok) {
        throw new Error('Error al corregir el cuestionario en el servidor')
      }

      const datosResultado = await respuesta.json()

      if (
        !datosResultado ||
        typeof datosResultado !== 'object' ||
        typeof datosResultado.aciertos !== 'number' ||
        typeof datosResultado.fallos !== 'number' ||
        typeof datosResultado.nota !== 'number' ||
        !Array.isArray(datosResultado.detalle)
      ) {
        throw new Error('Formato de respuesta inválido del servidor')
      }

      setResultadoCuestionario(datosResultado)
      setCuestionarioFinalizado(true)
    } catch (error) {
      console.error('Error al corregir el cuestionario:', error)
      setMensajeErrorCorreccion(
        'No se pudo corregir el cuestionario. Por favor, inténtalo de nuevo.',
      )
    } finally {
      setEstaCorrigiendo(false)
    }
  }

  const avanzarPregunta = () => {
    if (estaCorrigiendo) {
      return
    }

    setMensajeErrorCorreccion('')

    if (esUltimaPregunta) {
      void corregirCuestionario()
      return
    }

    setIndicePregunta((indiceActual) => indiceActual + 1)
  }

  const retrocederPregunta = () => {
    if (estaCorrigiendo) {
      return
    }

    setMensajeErrorCorreccion('')
    setIndicePregunta((indiceActual) => indiceActual - 1)
  }

  if (cuestionarioFinalizado) {
    return (
      <main className="pantalla-cuestionario">
        <ResumenCuestionario
          resultado={resultadoCuestionario}
          preguntas={preguntas}
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
        <button className="boton-salir" type="button" onClick={alSalir} disabled={estaCorrigiendo}>
          ← Volver a las temáticas
        </button>
      </div>
      <div className="contenido-cuestionario">
        {mensajeErrorCorreccion && (
          <div className="alerta-error" role="alert">
            <p>{mensajeErrorCorreccion}</p>
            <button
              className="boton-reintentar"
              type="button"
              onClick={corregirCuestionario}
              disabled={estaCorrigiendo}
            >
              {estaCorrigiendo ? 'Reintentando...' : 'Reintentar corrección'}
            </button>
          </div>
        )}
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
          puedeRetroceder={indicePregunta > 0 && !estaCorrigiendo}
          puedeAvanzar={respuestaSeleccionada !== null && !estaCorrigiendo}
          esUltimaPregunta={esUltimaPregunta}
          estaCargando={estaCorrigiendo}
          alRetroceder={retrocederPregunta}
          alAvanzar={avanzarPregunta}
        />
      </div>
    </main>
  )
}

export default PantallaPregunta
