import { useEffect, useState } from 'react'
import Encabezado from './Encabezado'
import { formatearNota } from '../utils'
import './PanelHistorial.css'

// El historial en memoria del backend crece con cada cuestionario y no se pagina, así que
// el panel solo pinta las 10 partidas más recientes para que la lista no crezca sin límite
const MAXIMO_PARTIDAS_RECIENTES = 10

function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function obtenerClaseNota(nota) {
  if (nota >= 8) {
    return 'nota-alta'
  }

  return nota >= 5 ? 'nota-media' : 'nota-baja'
}

function PanelHistorial({ alVolver }) {
  const [historial, setHistorial] = useState([])
  const [estadisticas, setEstadisticas] = useState([])
  const [estaCargando, setEstaCargando] = useState(true)
  const [mensajeError, setMensajeError] = useState('')

  const [intentoCarga, setIntentoCarga] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    const obtenerHistorial = async () => {
      try {
        const respuesta = await fetch('/api/historial', { signal: controlador.signal })

        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el historial')
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos?.historial) || !Array.isArray(datos?.estadisticas)) {
          throw new Error('Formato de respuesta inválido del servidor')
        }

        setHistorial(datos.historial)
        setEstadisticas(datos.estadisticas)
      } catch (error) {
        // Una petición cancelada al salir del panel no es un fallo: el componente ya no está en pantalla
        if (controlador.signal.aborted) {
          return
        }

        console.error('Error al obtener el historial:', error)
        setMensajeError('No se pudo cargar el historial. Inténtalo de nuevo.')
      } finally {
        if (!controlador.signal.aborted) {
          setEstaCargando(false)
        }
      }
    }

    obtenerHistorial()

    return () => controlador.abort()
  }, [intentoCarga])

  const reintentar = () => {
    setEstaCargando(true)
    setMensajeError('')
    setIntentoCarga((intento) => intento + 1)
  }

  const hayDatos = !estaCargando && !mensajeError && historial.length > 0
  const estaVacio = !estaCargando && !mensajeError && historial.length === 0

  const sumaNotas = historial.reduce((suma, partida) => suma + partida.nota, 0)
  const notaMedia = historial.length > 0 ? sumaNotas / historial.length : 0
  const mejorNota = historial.length > 0 ? Math.max(...historial.map(({ nota }) => nota)) : 0

  // El historial llega en orden cronológico ascendente; se invierte para mostrar primero lo más reciente
  const partidasRecientes = [...historial].reverse().slice(0, MAXIMO_PARTIDAS_RECIENTES)

  return (
    <div className="aplicacion">
      <Encabezado />
      <main className="panel-historial vista-diseno">
        <div className="panel-historial-contenido">
          <button className="boton-volver-tematicas" type="button" onClick={alVolver}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5 M11 6l-6 6 6 6" />
            </svg>
            Volver a las temáticas
          </button>

          <div className="cabecera-historial">
            <h1>Tu historial</h1>
            {hayDatos && <span className="contador-partidas">{historial.length} partidas</span>}
          </div>

          {estaCargando && (
            <p className="estado-historial" role="status">
              <span className="indicador-carga" aria-hidden="true" />
              Cargando historial...
            </p>
          )}

          {mensajeError && (
            <div className="alerta-historial" role="alert">
              <p>{mensajeError}</p>
              <button className="boton-historial-principal" type="button" onClick={reintentar}>
                Reintentar
              </button>
            </div>
          )}

          {estaVacio && (
            <div className="historial-vacio" role="status">
              <h2>Aún no tienes partidas</h2>
              <p>Completa tu primer cuestionario y aquí aparecerá tu historial de resultados.</p>
              <button className="boton-historial-principal" type="button" onClick={alVolver}>
                Elegir una temática
              </button>
            </div>
          )}

          {hayDatos && (
            <div className="historial-datos">
              <div className="resumen-historial">
                <div className="tarjeta-resumen">
                  <span className="etiqueta-resumen">Partidas jugadas</span>
                  <span className="valor-resumen">{historial.length}</span>
                </div>
                <div className="tarjeta-resumen">
                  <span className="etiqueta-resumen">Nota media</span>
                  <span className="valor-resumen valor-resumen-acento">
                    {formatearNota(notaMedia)}/10
                  </span>
                </div>
                <div className="tarjeta-resumen">
                  <span className="etiqueta-resumen">Mejor nota</span>
                  <span className="valor-resumen valor-resumen-alto">
                    {formatearNota(mejorNota)}/10
                  </span>
                </div>
              </div>

              <div className="espacios-reservados">
                <section
                  className="espacio-reservado"
                  id="contenedor-evolucion"
                  aria-labelledby="titulo-evolucion"
                >
                  <h2 id="titulo-evolucion">Evolución de las notas</h2>
                  <p>[Espacio reservado para la gráfica de evolución]</p>
                </section>
                <section
                  className="espacio-reservado"
                  id="contenedor-estadisticas-categoria"
                  aria-labelledby="titulo-categorias"
                >
                  <h2 id="titulo-categorias">Estadísticas por categoría</h2>
                  <p>[Espacio reservado para las estadísticas de cada temática]</p>
                  <p>Temáticas con tests realizados: {estadisticas.length}</p>
                </section>
              </div>

              <section className="partidas-recientes" aria-labelledby="titulo-partidas">
                <h2 id="titulo-partidas">Partidas recientes</h2>
                <ul>
                  {partidasRecientes.map((partida) => (
                    <li key={partida.id} className="partida">
                      <div className="partida-info">
                        <span className="partida-tematica">{partida.tematicaNombre}</span>
                        <span className="partida-fecha">{formatearFecha(partida.fecha)}</span>
                      </div>
                      <div className="partida-resultado">
                        <span className="partida-aciertos">
                          {partida.aciertos} de {partida.total} aciertos
                        </span>
                        <span className={`partida-nota ${obtenerClaseNota(partida.nota)}`}>
                          {formatearNota(partida.nota)}/10
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PanelHistorial
