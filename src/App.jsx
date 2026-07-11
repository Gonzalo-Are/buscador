import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Cartelera from './Cartelera';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal: Muestra tu hermosa landing */}
        <Route path="/" element={<Landing />} />
        
        {/* Ruta de películas: Muestra la cartelera de CR7 y Lucho */}
        <Route path="/cartelera" element={<Cartelera />} />
        
        {/* Ruta comodín: Si escriben cualquier otra cosa, los manda al inicio */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;