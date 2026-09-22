import React, { useState } from 'react';

// -------------------------------------------------------------
// 🛠️ MODO DESARROLLADOR
const DEV_MODE = true; 
// -------------------------------------------------------------

// Ruta de tu archivo PDF (colócalo en la carpeta /public)
const PDF_URL = "/acertijo.pdf";

// Palabras clave obligatorias que debe contener la frase final para avanzar al Nivel 4
const REQUIRED_KEYWORDS = ["NUESTRO", "DESTINO", "JUNTOS"];

export default function MisionNivel3() {
  const [finalInput, setFinalInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!finalInput.trim()) return;

    const cleanInput = finalInput.trim().toUpperCase();

    // Comprobar que el texto ingresado contenga todas las palabras clave requeridas
    const isValid = REQUIRED_KEYWORDS.every(word => cleanInput.includes(word));

    if (isValid) {
      setFeedback('🎉 ¡Correcto! Redirigiendo al Nivel 4...');
      setTimeout(() => {
        alert("🎉 ¡Nivel 3 Superado! Pasando al último nivel...");
        // window.location.href = '/nivel4';
      }, 1000);
    } else {
      setFeedback('❌ Respuesta incorrecta. Revisa el PDF e inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4 select-none cursor-default">
      <div className="max-w-xl w-full bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-black">🧮 Nivel 3: Desafío de Lógica</h1>
          <p className="text-xs text-black font-semibold">
            Revisa el documento detalladamente para encontrar la solución.
          </p>
        </div>

        {/* VISOR DE PDF */}
        <div className="w-full h-96 bg-slate-100 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-inner">
          <iframe
            src={PDF_URL}
            title="Desafío Matemático PDF"
            className="w-full h-full border-none"
          />
        </div>

        {/* FORMULARIO PARA LA RESPUESTA FINAL */}
        <form onSubmit={handleFinalSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-300">
          <h3 className="font-bold text-black text-xs uppercase tracking-wide text-center">
            Ingresa el mensaje final para pasar al Nivel 4
          </h3>
          
          <input 
            type="text"
            placeholder="Escribe la solución aquí..."
            value={finalInput}
            onChange={(e) => setFinalInput(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-black text-black text-center font-mono font-bold focus:outline-none cursor-text uppercase"
          />

          <button 
            type="submit"
            className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-md cursor-pointer"
          >
            Validar Mensaje y Pasar al Nivel 4 🚀
          </button>
        </form>

        {feedback && (
          <p className={`text-center font-black text-sm ${feedback.includes('🎉') ? 'text-emerald-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}

      </div>
    </div>
  );
}