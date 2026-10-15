function OpcionRespuesta({ indice, texto, seleccionada, alSeleccionar }) {
  const letraOpcion = String.fromCharCode(65 + indice)

  return (
    <button
      className={`opcion-respuesta${seleccionada ? ' opcion-seleccionada' : ''}`}
      type="button"
      aria-pressed={seleccionada}
      onClick={() => alSeleccionar(indice)}
    >
      <span className="letra-opcion">{letraOpcion}</span>
      <span>{texto}</span>
      {seleccionada && <span className="marca-seleccion" aria-hidden="true">✓</span>}
    </button>
  )
}

export default OpcionRespuesta
