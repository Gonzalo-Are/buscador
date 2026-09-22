import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Cartelera from './Cartelera';
import Mision from './mision';
import Mision2 from './Mision2';

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

        <Route path="/mision" element={<Mision />} />
        
        <Route path="/mision2" element={<Mision2 />} />
      </Routes>
    </Router>
  );
}

export default App;