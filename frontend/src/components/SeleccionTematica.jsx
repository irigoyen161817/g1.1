import { useEffect, useState } from 'react'
import AccesoHistorial from './AccesoHistorial'
import Encabezado from './Encabezado'
import PantallaPregunta from './PantallaPregunta'
import TarjetaTematica from './TarjetaTematica'

function SeleccionTematica({ alVerHistorial }) {
  const [tematicas, setTematicas] = useState([])
  const [preguntas, setPreguntas] = useState([])
  const [tematicaSeleccionada, setTematicaSeleccionada] = useState('')
  const [tematicaIdSeleccionada, setTematicaIdSeleccionada] = useState('')
  const [estaCargando, setEstaCargando] = useState(true)
  const [estaCargandoPreguntas, setEstaCargandoPreguntas] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeErrorPreguntas, setMensajeErrorPreguntas] = useState('')

  useEffect(() => {
    const obtenerTematicas = async () => {
      try {
        const respuesta = await fetch('/api/tematicas')

        if (!respuesta.ok) {
          throw new Error('No se pudieron obtener las temáticas')
        }

        const datos = await respuesta.json()
        setTematicas(datos)
      } catch (error) {
        console.error('Error al obtener las temáticas:', error)
        setMensajeError('No se pudieron cargar las temáticas. Inténtalo de nuevo.')
      } finally {
        setEstaCargando(false)
      }
    }

    obtenerTematicas()
  }, [])

  const obtenerPreguntas = async (tematica) => {
    if (!tematica || !tematica.id) {
      return
    }

    setEstaCargandoPreguntas(true)
    setMensajeErrorPreguntas('')
    setTematicaSeleccionada(tematica.nombre)
    setTematicaIdSeleccionada(tematica.id || '')

    try {
      const respuesta = await fetch(`/api/preguntas?id=${encodeURIComponent(tematica.id)}`)

      if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las preguntas')
      }

      const datos = await respuesta.json()
      setPreguntas(datos)
    } catch (error) {
      console.error('Error al obtener las preguntas:', error)
      setPreguntas([])
      setMensajeErrorPreguntas(
        `No se pudieron cargar las preguntas de ${tematica.nombre}. Inténtalo de nuevo.`,
      )
    } finally {
      setEstaCargandoPreguntas(false)
    }
  }

  const seleccionarTematica = (tematica) => {
    void obtenerPreguntas(tematica)
  }

  const volverASeleccionTematica = () => {
    setPreguntas([])
    setTematicaSeleccionada('')
    setTematicaIdSeleccionada('')
    setMensajeErrorPreguntas('')
  }

  if (tematicaSeleccionada && estaCargandoPreguntas) {
    return (
      <div className="aplicacion">
        <Encabezado />
        <p className="estado-tematicas" role="status">
          Cargando preguntas de {tematicaSeleccionada}...
        </p>
      </div>
    )
  }

  if (tematicaSeleccionada && !mensajeErrorPreguntas && preguntas.length > 0) {
    return (
      <div className="aplicacion">
        <Encabezado />
        <PantallaPregunta
          key={tematicaSeleccionada}
          tematicaId={tematicaIdSeleccionada}
          preguntas={preguntas}
          alSalir={volverASeleccionTematica}
        />
      </div>
    )
  }

  return (
    <div className="aplicacion">
      <Encabezado />
      <main className="vista-diseno">
        <section className="hero-tematicas" aria-labelledby="titulo-tematicas">
          <h1 id="titulo-tematicas">Elige tu temática de estudio</h1>
        </section>
        <AccesoHistorial alVerHistorial={alVerHistorial} deshabilitado={estaCargandoPreguntas} />
        <section className="contenido-tematicas" aria-labelledby="titulo-materias">
          <div className="cabecera-materias">
            <h2 id="titulo-materias">Materias disponibles</h2>
            {!estaCargando && !mensajeError && (
              <span className="contador-tematicas">{tematicas.length} asignaturas</span>
            )}
          </div>
          {estaCargando && (
            <p className="estado-tematicas" role="status">
              Cargando temáticas...
            </p>
          )}
          {mensajeError && (
            <p className="estado-tematicas estado-error" role="alert">
              {mensajeError}
            </p>
          )}
          {estaCargandoPreguntas && (
            <p className="estado-tematicas" role="status">
              Cargando preguntas de {tematicaSeleccionada}...
            </p>
          )}
          {mensajeErrorPreguntas && (
            <p className="estado-tematicas estado-error" role="alert">
              {mensajeErrorPreguntas}
            </p>
          )}
          {!estaCargando && !mensajeError && (
            <div className="rejilla-tematicas">
              {tematicas.map((tematica) => (
                <TarjetaTematica
                  key={tematica.id}
                  tematica={tematica}
                  alSeleccionar={seleccionarTematica}
                  deshabilitado={estaCargandoPreguntas}
                />
              ))}
            </div>
          )}
          {!estaCargandoPreguntas && !mensajeErrorPreguntas && tematicaSeleccionada && (
            <p className="estado-tematicas" role="status">
              {tematicaSeleccionada}: {preguntas.length} preguntas preparadas para jugar.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default SeleccionTematica
