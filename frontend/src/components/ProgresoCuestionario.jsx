function ProgresoCuestionario({ numeroPregunta, totalPreguntas, respuestas }) {
  const porcentajeCompletado =
    totalPreguntas > 0 ? ((numeroPregunta + 1) / totalPreguntas) * 100 : 0

  return (
    <section className="progreso-cuestionario" aria-label="Progreso del cuestionario">
      <div className="cabecera-progreso">
        <h1>
          Pregunta {numeroPregunta + 1} de {totalPreguntas}
        </h1>
        <span>{respuestas.filter((respuesta) => respuesta !== null).length} respondidas</span>
      </div>
      <div
        className="barra-progreso"
        role="progressbar"
        aria-valuenow={numeroPregunta + 1}
        aria-valuemin="1"
        aria-valuemax={totalPreguntas}
        aria-label={`Pregunta ${numeroPregunta + 1} de ${totalPreguntas}`}
      >
        <span style={{ width: `${porcentajeCompletado}%` }} />
      </div>
      <ol className="indicadores-preguntas">
        {respuestas.map((respuesta, indice) => (
          <li
            className={indice === numeroPregunta ? 'indicador-activo' : ''}
            key={indice}
            aria-current={indice === numeroPregunta ? 'step' : undefined}
          >
            <span>{indice + 1}</span>
            <strong>{respuesta === null ? 'Pendiente' : 'Respondida'}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ProgresoCuestionario
