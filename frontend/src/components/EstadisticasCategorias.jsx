import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatearNota, obtenerClaseNota } from '../utils'
import './EstadisticasCategorias.css'

const MAXIMO_CARACTERES_LINEA_ETIQUETA = 12
const ALTURA_LINEA_ETIQUETA = 16

function formatearTotalTests(totalTests) {
  return `${totalTests} ${totalTests === 1 ? 'test' : 'tests'}`
}

// El texto SVG no hace saltos de línea automáticos y en móvil las etiquetas se solapan, así
// que se agrupan las palabras del nombre en líneas de como máximo 12 caracteres
function dividirEnLineas(texto) {
  return texto.split(' ').reduce((lineas, palabra) => {
    const ultimaLinea = lineas.at(-1)

    if (ultimaLinea && `${ultimaLinea} ${palabra}`.length <= MAXIMO_CARACTERES_LINEA_ETIQUETA) {
      lineas[lineas.length - 1] = `${ultimaLinea} ${palabra}`
    } else {
      lineas.push(palabra)
    }

    return lineas
  }, [])
}

function EstadisticasCategorias({ estadisticas }) {
  if (estadisticas.length === 0) {
    return (
      <p className="estadisticas-categorias-vacio">
        Aún no hay estadísticas por categoría. Completa un cuestionario para verlas.
      </p>
    )
  }

  // recharts solo pasa al tick el valor del eje (el nombre), así que se usa su índice para
  // recuperar totalTests y mostrarlo en una línea final siempre visible, también en móvil
  const renderizarEtiquetaCategoria = ({ x, y, payload }) => (
    <text x={x} y={y} textAnchor="middle" className="etiqueta-categoria">
      {dividirEnLineas(payload.value).map((linea) => (
        <tspan key={linea} x={x} dy={ALTURA_LINEA_ETIQUETA}>
          {linea}
        </tspan>
      ))}
      <tspan x={x} dy={ALTURA_LINEA_ETIQUETA} className="etiqueta-categoria-tests">
        {formatearTotalTests(estadisticas[payload.index].totalTests)}
      </tspan>
    </text>
  )

  return (
    <div className="estadisticas-categorias">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={estadisticas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="tematicaNombre"
            height={64}
            interval={0}
            tick={renderizarEtiquetaCategoria}
            tickLine={false}
          />
          <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
          <Tooltip
            cursor={{ fill: 'var(--color-acento-suave)' }}
            separator=": "
            formatter={(notaMedia) => [`${formatearNota(notaMedia)}/10`, 'Nota media']}
            labelFormatter={(nombre, elementos) =>
              elementos.length > 0
                ? `${nombre} · ${formatearTotalTests(elementos[0].payload.totalTests)}`
                : nombre
            }
          />
          <Bar dataKey="notaMedia" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {estadisticas.map((estadistica) => (
              <Cell
                key={estadistica.tematicaId}
                className={`barra-categoria barra-${obtenerClaseNota(estadistica.notaMedia)}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EstadisticasCategorias
