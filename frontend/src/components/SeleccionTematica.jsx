import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccesoHistorial from './AccesoHistorial'
import Encabezado from './Encabezado'
import TarjetaTematica from './TarjetaTematica'
import './SeleccionTematica.css'

function SeleccionTematica() {
  const navigate = useNavigate()
  const [tematicas, setTematicas] = useState([])
  const [estaCargando, setEstaCargando] = useState(true)
  const [mensajeError, setMensajeError] = useState('')

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

  const seleccionarTematica = (tematica) => {
    if (!tematica || !tematica.id) {
      return
    }
    navigate(`/cuestionario/${encodeURIComponent(tematica.id)}`)
  }

  return (
    <div className="aplicacion">
      <Encabezado />
      <main className="vista-diseno">
        <section className="hero-tematicas" aria-labelledby="titulo-tematicas">
          <h1 id="titulo-tematicas">Elige tu temática de estudio</h1>
        </section>
        <AccesoHistorial alVerHistorial={() => navigate('/historial')} />
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
          {!estaCargando && !mensajeError && (
            <div className="rejilla-tematicas">
              {tematicas.map((tematica) => (
                <TarjetaTematica
                  key={tematica.id}
                  tematica={tematica}
                  alSeleccionar={seleccionarTematica}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default SeleccionTematica
