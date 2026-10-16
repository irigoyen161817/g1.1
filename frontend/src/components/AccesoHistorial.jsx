import './AccesoHistorial.css'

const BARRAS_DECORATIVAS = [
  { altura: 22, clase: 'barra-tenue' },
  { altura: 32, clase: 'barra-tenue' },
  { altura: 28, clase: 'barra-tenue' },
  { altura: 44, clase: 'barra-media' },
  { altura: 56, clase: 'barra-destacada' },
]

function AccesoHistorial({ alVerHistorial, deshabilitado = false }) {
  return (
    <section className="acceso-historial-contenedor" aria-labelledby="titulo-acceso-historial">
      <div className="acceso-historial">
        <div className="acceso-historial-info">
          <span className="acceso-historial-icono" aria-hidden="true">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 8v4l3 2" />
            </svg>
          </span>
          <div className="acceso-historial-texto">
            <span className="acceso-historial-etiqueta">Tu progreso</span>
            <h2 id="titulo-acceso-historial">Consulta tu historial</h2>
            <p>Revisa tus notas, tu evolución y tus estadísticas por temática.</p>
          </div>
        </div>
        <div className="acceso-historial-accion">
          <div className="barras-decorativas" aria-hidden="true">
            {BARRAS_DECORATIVAS.map(({ altura, clase }, indice) => (
              <span key={indice} className={clase} style={{ height: altura }} />
            ))}
          </div>
          <button
            className="boton-ver-historial"
            type="button"
            onClick={alVerHistorial}
            disabled={deshabilitado}
          >
            Ver historial
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
              <path d="M5 12h14 M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default AccesoHistorial
