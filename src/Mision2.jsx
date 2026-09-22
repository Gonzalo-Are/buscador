import React, { useState, useEffect, useRef } from 'react';

// Reproductor de tonos sintéticos
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timeoutIds = [];
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playNote(freq, type = 'sine', duration = 0.3, startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  stop() {
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
    this.isPlaying = false;
  }

  playMelody(notesPattern) {
    this.init();
    this.stop();
    this.isPlaying = true;

    let currentTime = 0;
    notesPattern.forEach(({ note, duration, type }) => {
      const tid = setTimeout(() => {
        if (this.isPlaying) {
          this.playNote(note, type || 'triangle', duration);
        }
      }, currentTime * 1000);
      this.timeoutIds.push(tid);
      currentTime += duration;
    });

    const totalDuration = currentTime * 1000;
    const endTid = setTimeout(() => {
      this.isPlaying = false;
    }, totalDuration);
    this.timeoutIds.push(endTid);

    return totalDuration / 1000;
  }
}

const audioSynth = new AudioSynth();

// Lista de las 6 canciones
const SONGS_DATASET = [
  {
    id: 1,
    title: "Despacito",
    genre: "Reggaeton / Pop",
    notes: [
      { note: 293.66, duration: 0.3 },
      { note: 369.99, duration: 0.3 },
      { note: 440.00, duration: 0.3 },
      { note: 493.88, duration: 0.6 },
      { note: 440.00, duration: 0.3 },
      { note: 369.99, duration: 0.3 },
      { note: 293.66, duration: 0.5 }
    ],
    options: ["Despacito - Luis Fonsi", "Dákiti - Bad Bunny", "Bailando - Enrique Iglesias", "Calma - Pedro Capó"],
    correctIndex: 0,
    fortuneClue: "🥠 Galleta de la Fortuna: 'El ritmo con más reproducciones. Se toma su tiempo... muy lentamente.'"
  },
  {
    id: 2,
    title: "Smooth Criminal",
    genre: "Pop / Funk Rock",
    notes: [
      { note: 440.00, duration: 0.2 }, { note: 440.00, duration: 0.2 },
      { note: 440.00, duration: 0.2 }, { note: 392.00, duration: 0.2 },
      { note: 440.00, duration: 0.2 }, { note: 523.25, duration: 0.3 },
      { note: 440.00, duration: 0.2 }, { note: 392.00, duration: 0.4 }
    ],
    options: ["Thriller - Michael Jackson", "Smooth Criminal - Michael Jackson", "Billie Jean - Michael Jackson", "Uptown Funk - Bruno Mars"],
    correctIndex: 1,
    fortuneClue: "🥠 Galleta de la Fortuna: '¿Annie, estás bien? El Rey del Pop baila inclinado comiendo Orange Chicken.'"
  },
  {
    id: 3,
    title: "Mamma Mia",
    genre: "Disco / Pop",
    notes: [
      { note: 587.33, duration: 0.25 }, { note: 523.25, duration: 0.25 },
      { note: 440.00, duration: 0.25 }, { note: 587.33, duration: 0.25 },
      { note: 659.25, duration: 0.4 }, { note: 587.33, duration: 0.4 }
    ],
    options: ["Dancing Queen - ABBA", "Stayin' Alive - Bee Gees", "Mamma Mia - ABBA", "Gimme! Gimme! Gimme! - ABBA"],
    correctIndex: 2,
    fortuneClue: "🥠 Galleta de la Fortuna: 'Expresión italiana súper famosa convertida en un clásico disco sueco.'"
  },
  {
    id: 4,
    title: "Star Wars Theme",
    genre: "Banda Sonora",
    notes: [
      { note: 293.66, duration: 0.3 }, { note: 293.66, duration: 0.3 },
      { note: 293.66, duration: 0.3 }, { note: 392.00, duration: 0.8 },
      { note: 587.33, duration: 0.8 }, { note: 523.25, duration: 0.2 },
      { note: 493.88, duration: 0.2 }, { note: 440.00, duration: 0.2 },
      { note: 783.99, duration: 0.8 }
    ],
    options: ["Harry Potter - John Williams", "Jurassic Park - John Williams", "Indiana Jones - John Williams", "Star Wars - John Williams"],
    correctIndex: 3,
    fortuneClue: "🥠 Galleta de la Fortuna: 'Que la Fuerza te acompañe mientras pides tus Beijing Beef a través de la galaxia.'"
  },
  {
    id: 5,
    title: "La Macarena",
    genre: "Pop Latino / Dance",
    notes: [
      { note: 349.23, duration: 0.25 }, { note: 349.23, duration: 0.25 },
      { note: 349.23, duration: 0.25 }, { note: 349.23, duration: 0.25 },
      { note: 349.23, duration: 0.25 }, { note: 392.00, duration: 0.25 },
      { note: 440.00, duration: 0.5 }
    ],
    options: ["La Macarena - Los del Río", "Aserejé - Las Ketchup", "La Bamba - Los Lobos", "Suavemente - Elvis Crespo"],
    correctIndex: 0,
    fortuneClue: "🥠 Galleta de la Fortuna: 'Dale a tu cuerpo alegría... ¡y no olvides mover las caderas!'"
  },
  {
    id: 6,
    title: "Yellow Submarine",
    genre: "Rock / Pop",
    notes: [
      { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 },
      { note: 493.88, duration: 0.3 }, { note: 392.00, duration: 0.3 },
      { note: 329.63, duration: 0.3 }, { note: 329.63, duration: 0.3 },
      { note: 293.66, duration: 0.6 }
    ],
    options: ["Hey Jude - The Beatles", "Yellow Submarine - The Beatles", "Let It Be - The Beatles", "Bohemian Rhapsody - Queen"],
    correctIndex: 1,
    fortuneClue: "🥠 Galleta de la Fortuna: 'Un transporte bajo el agua de color muy brillante cantado por la banda de Liverpool.'"
  }
];

export default function MisionNivel2() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [pandaOrderInput, setPandaOrderInput] = useState('');
  const [orderFeedback, setOrderFeedback] = useState('');

  const progressInterval = useRef(null);
  const currentSong = SONGS_DATASET[currentStep];

  // Tu orden favorita exacta de Panda Express
  const MI_ORDEN_PANDA = "CHOW MEIN Y ORANGE CHICKEN"; 

  const handlePlayAudio = () => {
    if (isPlaying) {
      audioSynth.stop();
      setIsPlaying(false);
      clearInterval(progressInterval.current);
      setPlaybackProgress(0);
      return;
    }

    setIsPlaying(true);
    setPlaybackProgress(0);

    const durationSec = audioSynth.playMelody(currentSong.notes);
    const stepMs = 50;
    let elapsedMs = 0;
    const totalMs = durationSec * 1000;

    clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      elapsedMs += stepMs;
      const pct = Math.min((elapsedMs / totalMs) * 100, 100);
      setPlaybackProgress(pct);

      if (elapsedMs >= totalMs) {
        clearInterval(progressInterval.current);
        setIsPlaying(false);
        setPlaybackProgress(100);
      }
    }, stepMs);
  };

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setIsCorrect(index === currentSong.correctIndex);
  };

  const handleNextQuestion = () => {
    audioSynth.stop();
    setIsPlaying(false);
    clearInterval(progressInterval.current);
    setPlaybackProgress(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);

    if (currentStep + 1 < SONGS_DATASET.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleVerifyPandaOrder = (e) => {
    e.preventDefault();
    if (pandaOrderInput.trim().toUpperCase() === MI_ORDEN_PANDA) {
      setOrderFeedback('🎉 ¡ORACULO PANDA CORRECTO! Clave del Nivel 3: "MATEMATICAS"');
      setTimeout(() => {
        alert('¡Nivel 2 Superado! Pasando al Nivel 3 (Ejercicios Matemáticos)...');
      }, 1500);
    } else {
      setOrderFeedback('❌ Orden incorrecta. Pista: Pide Chow Mein + Orange Chicken');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 text-white p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Nivel 2 • Panda Express Edition</span>
            <h1 className="text-2xl font-black text-white">Adivina la Canción 🎵</h1>
          </div>
          <div className="bg-orange-500/20 text-orange-300 font-mono font-bold text-sm px-3 py-1.5 rounded-xl border border-orange-500/30">
            {currentStep + 1} / {SONGS_DATASET.length}
          </div>
        </div>

        {!gameFinished ? (
          <div className="space-y-6">
            {/* REPRODUCTOR DE AUDIO */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <p className="text-xs text-slate-400 font-semibold uppercase">Presiona para escuchar el extracto</p>
              
              <button 
                onClick={handlePlayAudio}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition duration-300 shadow-lg ${
                  isPlaying ? 'bg-orange-500 scale-105' : 'bg-rose-600 hover:bg-orange-500'
                }`}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              {/* BARRA DE PROGRESO DE AUDIO */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full transition-all duration-100"
                  style={{ width: `${playbackProgress}%` }}
                ></div>
              </div>
            </div>

            {/* OPCIONES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSong.options.map((option, idx) => {
                let btnStyle = "bg-white/5 border-white/10 text-white hover:bg-white/15";
                if (selectedOption !== null) {
                  if (idx === currentSong.correctIndex) {
                    btnStyle = "bg-emerald-600/40 border-emerald-400 text-emerald-200 font-bold";
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-rose-600/40 border-rose-400 text-rose-200 font-bold";
                  } else {
                    btnStyle = "bg-white/5 border-white/5 text-slate-500 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-xl border text-left text-sm transition ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* PISTA & BOTÓN SIGUIENTE */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-4">
              {!showHint ? (
                <button 
                  onClick={() => setShowHint(true)}
                  className="text-xs text-amber-300 hover:underline"
                >
                  🥠 Pedir pista de Galleta de la Fortuna
                </button>
              ) : (
                <p className="text-xs text-amber-200 italic max-w-xs">{currentSong.fortuneClue}</p>
              )}

              {selectedOption !== null && (
                <button 
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-rose-500 text-slate-950 font-bold rounded-xl text-sm transition"
                >
                  {currentStep + 1 === SONGS_DATASET.length ? "Revelar Coordenadas 📍" : "Siguiente Canción ➔"}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PANTALLA FINAL: COORDENADAS + CLAVE PANDA EXPRESS */
          <div className="space-y-6 text-center">
  <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl space-y-3">
    <h2 className="text-xl font-bold text-orange-400">📍 ¡Canciones Completadas!</h2>
    <p className="text-sm text-slate-200">
      Las 6 canciones han revelado las coordenadas geográficas exactas de nuestra siguiente estación:
    </p>
    
    {/* Coordenadas actualizadas */}
    <div className="bg-slate-950 p-4 rounded-xl text-pink-400 font-mono text-base sm:text-lg font-bold tracking-wider border border-pink-500/30 select-all">
      30.01214177943623, -97.86227193004616
    </div>
  </div>

  <form onSubmit={handleVerifyPandaOrder} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
    <h3 className="font-bold text-white text-sm">🐼 Para pasar al Nivel 3: Ingresa mi orden exacta de Panda Express</h3>
    
    <input 
      type="text"
      placeholder="Ej: CHOW MEIN Y ORANGE CHICKEN"
      value={pandaOrderInput}
      onChange={(e) => setPandaOrderInput(e.target.value)}
      className="w-full p-3 rounded-xl bg-slate-950 border border-orange-400 text-white text-center font-mono focus:outline-none"
    />

    <button 
      type="submit"
      className="w-full py-3 bg-orange-500 hover:bg-rose-500 text-slate-950 font-bold rounded-xl transition"
    >
      Validar Orden y Pasar al Nivel 3 🔑
    </button>
  </form>

  {orderFeedback && (
    <p className={`font-bold text-sm ${orderFeedback.includes('🎉') ? 'text-green-400' : 'text-red-400'}`}>
      {orderFeedback}
    </p>
  )}
</div>
        )}

      </div>
    </div>
  );
}