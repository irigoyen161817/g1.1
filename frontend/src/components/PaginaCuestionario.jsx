import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Encabezado from './Encabezado'
import PantallaPregunta from './PantallaPregunta'
import './PaginaCuestionario.css'

function PaginaCuestionario() {
  const { tematicaId } = useParams()
  const navigate = useNavigate()

  const [preguntas, setPreguntas] = useState([])
  const [estaCargando, setEstaCargando] = useState(true)
  const [errorNoEncontrado, setErrorNoEncontrado] = useState(false)
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    const cargarPreguntas = async () => {
      setEstaCargando(true)
      setErrorNoEncontrado(false)
      setMensajeError('')

      try {
        const respuesta = await fetch(`/api/preguntas?id=${encodeURIComponent(tematicaId)}`, {
          signal: controlador.signal,
        })

        if (respuesta.status === 404) {
          setErrorNoEncontrado(true)
          return
        }

        if (!respuesta.ok) {
          throw new Error('No se pudieron obtener las preguntas')
        }

        const datos = await respuesta.json()
        setPreguntas(datos)
      } catch (error) {
        if (controlador.signal.aborted) {
          return
        }
        console.error('Error al obtener las preguntas:', error)
        setMensajeError('No se pudieron cargar las preguntas. Inténtalo de nuevo.')
      } finally {
        if (!controlador.signal.aborted) {
          setEstaCargando(false)
        }
      }
    }

    if (tematicaId) {
      cargarPreguntas()
    }

    return () => controlador.abort()
  }, [tematicaId])

  const volverAInicio = () => {
    navigate('/')
  }

  if (estaCargando) {
    return (
      <div className="aplicacion">
        <Encabezado />
        <main className="pagina-cuestionario-estado">
          <p className="estado-cuestionario" role="status">
            Cargando preguntas del cuestionario...
          </p>
        </main>
      </div>
    )
  }

  if (errorNoEncontrado) {
    return (
      <div className="aplicacion">
        <Encabezado />
        <main className="pagina-cuestionario-estado">
          <div className="alerta-error" role="alert">
            <p>La temática solicitada no existe o no se encuentra disponible.</p>
            <button className="boton-principal" type="button" onClick={volverAInicio}>
              Volver a las temáticas
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (mensajeError) {
    return (
      <div className="aplicacion">
        <Encabezado />
        <main className="pagina-cuestionario-estado">
          <div className="alerta-error" role="alert">
            <p>{mensajeError}</p>
            <button className="boton-principal" type="button" onClick={volverAInicio}>
              Volver a las temáticas
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="aplicacion">
      <Encabezado />
      <PantallaPregunta
        key={tematicaId}
        tematicaId={tematicaId}
        preguntas={preguntas}
        alSalir={volverAInicio}
      />
    </div>
  )
}

export default PaginaCuestionario
