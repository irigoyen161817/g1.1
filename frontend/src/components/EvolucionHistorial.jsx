import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './EvolucionHistorial.css'
import { formatearFecha, formatearNota } from '../utils'

export default function EvolucionHistorial({ historial }) {
  return (
    <div className="evolucion-historial">
      {historial.length >= 2 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historial} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              // Sin dataKey, el valor de cada tick es el índice de la partida en el historial; se usa
              // ese valor y no el índice del tick, que cambia cuando recharts oculta marcas por espacio
              tickFormatter={(indicePartida) => indicePartida + 1}
            />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload && payload.length > 0 ? formatearFecha(payload[0].payload.fecha) : ''
              }
              formatter={(nota) => [`${formatearNota(nota)}/10`, 'Nota']}
              separator=": "
            />
            <Line
              type="monotone"
              dataKey="nota"
              stroke="var(--color-acento)"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="mensaje-grafica">
          Completa al menos 2 cuestionarios para ver tu gráfica de evolución.
        </p>
      )}
    </div>
  )
}
