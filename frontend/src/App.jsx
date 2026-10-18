import { useState } from 'react'
import PanelHistorial from './components/PanelHistorial'
import SeleccionTematica from './components/SeleccionTematica'
import './App.css'

function App() {
  const [vistaActiva, setVistaActiva] = useState('tematicas')

  if (vistaActiva === 'historial') {
    return <PanelHistorial alVolver={() => setVistaActiva('tematicas')} />
  }

  return <SeleccionTematica alVerHistorial={() => setVistaActiva('historial')} />
}

export default App
