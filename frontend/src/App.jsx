import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PaginaCuestionario from './components/PaginaCuestionario'
import PanelHistorial from './components/PanelHistorial'
import SeleccionTematica from './components/SeleccionTematica'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SeleccionTematica />} />
        <Route path="/cuestionario/:tematicaId" element={<PaginaCuestionario />} />
        <Route path="/historial" element={<PanelHistorial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
