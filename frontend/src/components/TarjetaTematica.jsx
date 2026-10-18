import './TarjetaTematica.css'

function TarjetaTematica({ tematica, alSeleccionar, deshabilitado = false }) {
  return (
    <button
      className="tarjeta-tematica"
      type="button"
      onClick={() => alSeleccionar(tematica)}
      aria-label={`Seleccionar temática ${tematica.nombre}`}
      disabled={deshabilitado}
    >
      <span className="icono-contenedor">
        <img src={tematica.logo} alt="" />
      </span>
      <span className="nombre-tematica">{tematica.nombre}</span>
    </button>
  )
}

export default TarjetaTematica
