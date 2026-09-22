import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const quizQuestions = [
  {
    question: "1. ¿Que jugo es el que mas me pido cuando salgo a comer?",
    options: ["Chirimoya", "Limonada", "Limonada menta jengibre", "Frutilla"],
    correctIndex: 2
  },
  {
    question: "2. ¿Cual es mi favorito de estos?",
    options: ["Panda express", "Sonic", "Chipotle", "Whataburger"],
    correctIndex: 0
  },
  {
    question: "3. ¿Que año fallecio el Docky?",
    options: ["2022", "2023", "2024", "2025"],
    correctIndex: 2
  }
];

const DEV_MODE = true;

const CORRECT_DECRYPTED = "BALCONES";

export default function MisionNivel1() {
  const [screen, setScreen] = useState('intro'); 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [decryptedInput, setDecryptedInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (DEV_MODE) return;
    const lockUntil = localStorage.getItem('mision_lock_until');
    if (lockUntil) {
      const lockTime = parseInt(lockUntil, 10);
      const now = Date.now();
      if (now < lockTime) {
        setIsLocked(true);
        updateCountdown(lockTime);
        const timer = setInterval(() => {
          if (!updateCountdown(lockTime)) {
            clearInterval(timer);
            setIsLocked(false);
            localStorage.removeItem('mision_lock_until');
          }
        }, 1000);
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('mision_lock_until');
      }
    }
  }, []);

  const updateCountdown = (lockTime) => {
    const diff = lockTime - Date.now();
    if (diff <= 0) return false;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    return true;
  };

  const triggerLockout = () => {
    if (DEV_MODE) {
      alert("⚠️ [MODO DEV] Te equivocaste, pero el bloqueo de 24h está desactivado.");
      return;
    }

    const unlockTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('mision_lock_until', unlockTime.toString());
    setIsLocked(true);
    updateCountdown(unlockTime);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === quizQuestions[currentQuestion].correctIndex) {
      setFeedback('');
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setScreen('cipher');
      }
    } else {
      triggerLockout();
    }
  };

  const handleVerifyCipher = (e) => {
    e.preventDefault();
    if (decryptedInput.trim().toUpperCase() === CORRECT_DECRYPTED) {
      setFeedback('Nivel 2 mami');
      setTimeout(() => {
      }, 1000);
    } else {
      triggerLockout();
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 select-none cursor-default">
        <div className="max-w-md w-full bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-center space-y-4 backdrop-blur-md">
          <div className="text-4xl">🔒</div>
          <h2 className="text-2xl font-bold text-red-400">Acceso Bloqueado</h2>
          <p className="text-sm text-slate-300">
            Te equivocaste bb, ahora tienes que esperar un dia, upsi.
          </p>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-red-500/20 font-mono text-lg text-red-300 font-bold">
            {timeRemaining}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 select-none cursor-default">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* VISTA 0: INTRODUCCIÓN */}
        {screen === 'intro' && (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black text-black tracking-tight">Mision</h1>
            <p className="text-black text-sm font-medium leading-relaxed">
              Hola bb, si encontraste esto, es por que estas en un juegito, uuuuuuuuuuuu.
            </p>
            <p className="text-black text-xs font-normal">
              Tienes que superar 4 niveles, mucha suerte linda, si te equivocas se te bloquea por un dia.
            </p>
            <button
              onClick={() => setScreen('quiz')}
              className="w-full py-3 bg-purple-500 hover:bg-pink-500 text-slate-950 font-bold rounded-xl transition duration-200 shadow-lg cursor-pointer"
            >
              Comenzar Nivel 1
            </button>
          </div>
        )}

        {/* VISTA 1: QUIZ */}
        {screen === 'quiz' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-black text-center">Nivel 1: Quiz </h2>
            <p className="text-black font-bold text-base">{quizQuestions[currentQuestion].question}</p>
            
            <div className="flex flex-col gap-2.5">
              {quizQuestions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 transition text-sm text-black font-semibold cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: MENSAJE CIFRADO */}
        {screen === 'cipher' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black text-center">Locura bb</h2>
            <p className="text-black font-medium text-sm">
              Para pasar al Nivel 2 teni que escribir la palabra de abajo, pero bien po tipo descifrala:
            </p>

            {/* Código Cifrado César (+3 desplazamientos) */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-pink-500/30 text-center font-mono text-xl tracking-widest text-pink-300">
              EDOFRQHV
            </div>

            <p className="text-xs text-black italic text-center font-medium">
              Pista: D ➔ A.
            </p>

            <form onSubmit={handleVerifyCipher} className="space-y-3">
              <input
                type="text"
                placeholder="...."
                value={decryptedInput}
                onChange={(e) => setDecryptedInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-purple-400 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 text-center font-mono cursor-text"
              />
              <button
                type="submit"
                className="w-full py-3 bg-purple-500 hover:bg-pink-500 text-slate-950 font-bold rounded-xl transition duration-200 shadow-lg cursor-pointer"
              >
                🔑
              </button>
            </form>

            {feedback && (
  <div className="space-y-3 text-center">
    <p className="font-black text-sm text-black">{feedback}</p>
    <Link 
      to="/mision2" 
      className="inline-block w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-center shadow-md"
    >
      Nivel 2
    </Link>
  </div>
)}
          </div>
        )}

      </div>
    </div>
  );
}