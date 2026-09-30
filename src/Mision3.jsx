import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// -------------------------------------------------------------
// 🛠️ MODO DESARROLLADOR
const DEV_MODE = true; 
// -------------------------------------------------------------

// Ruta de tu archivo PDF (colócalo en la carpeta /public)
const PDF_URL = "/tarea.pdf";

// Palabras clave obligatorias que debe contener la frase final para avanzar al Nivel 4
const REQUIRED_KEYWORDS = ["NUBE"];

export default function MisionNivel3() {
  const [finalInput, setFinalInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!finalInput.trim()) return;

    const cleanInput = finalInput.trim().toUpperCase();

    // Comprobar que el texto ingresado contenga todas las palabras clave requeridas
    const isValid = REQUIRED_KEYWORDS.every(word => cleanInput.includes(word));

    if (isValid) {
      setIsUnlocked(true);
      setFeedback('uuuuuuuu');
      setTimeout(() => {
        // window.location.href = '/nivel4';
      }, 1000);
    } else {
      setIsUnlocked(false);
      setFeedback('upsi');
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4 select-none cursor-default">
      <div className="max-w-xl w-full bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-black">Nivel 3</h1>
          
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
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-300">
          <h3 className="font-bold text-black text-xs uppercase tracking-wide text-center">
            Que era el acertijo?
          </h3>
          
          <input 
            type="text"
            placeholder="Te amo"
            value={finalInput}
            onChange={(e) => {
              setFinalInput(e.target.value);
              if (isUnlocked) setIsUnlocked(false);
              if (feedback) setFeedback('');
            }}
            className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-black text-black text-center font-mono font-bold focus:outline-none cursor-text uppercase"
          />

          {/* Si la clave es válida, muestra el Link al Nivel 4 */}
          {isUnlocked ? (
            <Link 
              to="/mision4" 
              className="inline-block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-md transition"
            >Niveli 4
            </Link>
          ) : (
            <button 
              type="button"
              onClick={handleFinalSubmit}
              className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
             🔑
            </button>
          )}

          {feedback && (
            <p className={`text-center font-black text-sm mt-2 ${isUnlocked ? 'text-emerald-600' : 'text-red-600'}`}>
              {feedback}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}