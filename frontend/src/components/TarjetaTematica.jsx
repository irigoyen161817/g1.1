function TarjetaTematica({ tematica, alSeleccionar }) {
  return (
    <button
      className="tarjeta-tematica"
      type="button"
      onClick={() => alSeleccionar(tematica)}
      aria-label={`Seleccionar temática ${tematica.nombre}`}
    >
      <span className="icono-contenedor">
        <img src={tematica.logo} alt="" />
      </span>
      <span className="nombre-tematica">{tematica.nombre}</span>
    </button>
  )
}

export default TarjetaTematica
