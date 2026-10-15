function PantallaFinalCuestionario({ totalPreguntas, alSalir }) {
  return (
    <section className="pantalla-final" aria-labelledby="titulo-final-cuestionario">
      <span className="icono-final" aria-hidden="true">✓</span>
      <h1 id="titulo-final-cuestionario">Cuestionario completado</h1>
      <p>Has respondido las {totalPreguntas} preguntas de la temática seleccionada.</p>
      <button className="boton-principal" type="button" onClick={alSalir}>
        Volver a las temáticas
      </button>
    </section>
  )
}

export default PantallaFinalCuestionario
