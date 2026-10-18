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
import { formatearFecha } from '../utils'

export default function EvolucionHistorial({ historial }) {
  if (!historial || historial.length === 0) {
    return (
      <div className="evolucion-historial vacio">
        <p>Aún no hay datos para mostrar la evolución.</p>
      </div>
    )
  }

  return (
    <div className="evolucion-historial">
      {historial.length >= 2 ? (
        <div className="grafica-contenedor">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historial} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                // Usamos el índice de la partida (+1) como eje X para que no se superpongan fechas repetidas
                tickFormatter={(_, index) => index + 1}
              />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip
                // Formateamos la fecha en el tooltip usando la función centralizada
                labelFormatter={(_, payload) =>
                  payload && payload.length > 0 ? formatearFecha(payload[0].payload.fecha) : ''
                }
                formatter={(value) => [`${value} / 10`, 'Nota']}
              />
              <Line
                type="monotone"
                dataKey="nota"
                stroke="#4a90e2"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mensaje-grafica">
          Completa al menos 2 cuestionarios para ver tu gráfica de evolución.
        </p>
      )}
    </div>
  )
}
