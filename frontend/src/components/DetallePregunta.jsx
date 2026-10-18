function DetallePregunta({ numero, pregunta, detalle }) {
  const { esCorrecta, respuestaSeleccionada, respuestaCorrecta } = detalle
  const { enunciado, opciones } = pregunta

  return (
    <article
      className={`tarjeta-detalle-pregunta ${esCorrecta ? 'detalle-acierto' : 'detalle-fallo'}`}
      aria-label={`Detalle de la pregunta ${numero}: ${esCorrecta ? 'Acertada' : 'Fallada'}`}
    >
      <div className="cabecera-detalle-pregunta">
        <span className="numero-detalle-pregunta">Pregunta {numero}</span>
        <span
          className={`indicador-resultado ${esCorrecta ? 'indicador-acierto' : 'indicador-fallo'}`}
        >
          <span className="icono-resultado" aria-hidden="true">
            {esCorrecta ? '✓' : '✕'}
          </span>
          <span className="texto-resultado">{esCorrecta ? 'Acierto' : 'Fallo'}</span>
        </span>
      </div>

      <h3 className="enunciado-detalle-pregunta">{enunciado}</h3>

      <div className="respuestas-detalle-pregunta">
        <div className="fila-respuesta-detalle">
          <span className="etiqueta-respuesta">Tu respuesta:</span>
          <span className={`valor-respuesta ${esCorrecta ? 'texto-acierto' : 'texto-fallo'}`}>
            {opciones[respuestaSeleccionada]}
          </span>
        </div>

        {!esCorrecta && (
          <div className="fila-respuesta-detalle">
            <span className="etiqueta-respuesta">Respuesta correcta:</span>
            <span className="valor-respuesta texto-acierto">{opciones[respuestaCorrecta]}</span>
          </div>
        )}
      </div>
    </article>
  )
}

export default DetallePregunta
