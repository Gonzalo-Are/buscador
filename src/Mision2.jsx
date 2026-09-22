import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';


const DEV_MODE = true; 
const PLAY_DURATION_SECONDS = 6;

const songList = [
  {
    id: 1,
    audioUrl: "/music/Anuel.mp3",
    title: "Canción 1",
    correctAnswer: "QUIERE BEBER"
  },
  {
    id: 2,
    audioUrl: "/music/Arctic.mp3",
    title: "Canción 2",
    correctAnswer: "WHEN THE SUN GOES DOWN"
  },
  {
    id: 3,
    audioUrl: "/music/Pitbull.mp3",
    title: "Canción 3",
    correctAnswer: "TIME OF OUR LIVES"
  },
  {
    id: 4,
    audioUrl: "/music/P.I.M.P.mp3",
    title: "Canción 4",
    correctAnswer: "P.I.M.P"
  },
  {
    id: 5,
    audioUrl: "/music/Police.mp3",
    title: "Canción 5",
    correctAnswer: "EVERY BREATH YOU TAKE"
  },
  {
    id: 6,
    audioUrl: "/music/The.mp3",
    title: "Canción 6",
    correctAnswer: "SLEEP"
  }
];


export default function MisionNivel2() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [guessInput, setGuessInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [pandaInput, setPandaInput] = useState('');

  const audioRef = useRef(null);
  const playTimerRef = useRef(null); 

  const currentSong = songList[currentSongIndex];

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState('');
  // Limpiar temporizador y detener audio al cambiar de canción o desmontar
  useEffect(() => {
    stopAudio();
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
    }
    return () => clearTimeout(playTimerRef.current);
  }, [currentSongIndex]);

  const stopAudio = () => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reinicia la canción al inicio
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      stopAudio();
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          // Detener automáticamente al cumplir los 6 segundos
          playTimerRef.current = setTimeout(() => {
            stopAudio();
          }, PLAY_DURATION_SECONDS * 1000);
        })
        .catch(err => {
          console.error("Error al reproducir el audio:", err);
          alert("Asegúrate de que la ruta del archivo .mp3 sea correcta.");
        });
    }
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const formattedInput = guessInput.trim().toUpperCase();
    const formattedCorrect = currentSong.correctAnswer.toUpperCase();

    if (formattedInput === formattedCorrect) {
      setFeedback('uuuuuuuuuuu');
      setGuessInput('');
      stopAudio();

      if (currentSongIndex + 1 < songList.length) {
        setTimeout(() => {
          setFeedback('');
          setCurrentSongIndex(prev => prev + 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setFeedback('');
          setIsCompleted(true);
        }, 1200);
      }
    } else {
      setFeedback('upsi.');
    }
  };

  const handlePandaVerify = (e) => {
    e.preventDefault();
   const cleanInput = pandaInput.trim().toUpperCase();

  // Definimos las palabras clave obligatorias de la orden
  const requiredKeywords = ["HONEY", "SESAME", "CHICKEN", "BROCCOLI", "BEEF", "FRIED", "RICE"];

  // Comprobamos que TODAS las palabras clave estén en el texto ingresado
  const isValid = requiredKeywords.every(word => cleanInput.includes(word));

  if (isValid) {
      setIsUnlocked(true);
    setOrderFeedback('te amo');
  } else {
    setIsUnlocked(false);
    setOrderFeedback('te amo pero esta malo jsks');
  }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4 select-none cursor-default">
      <audio ref={audioRef} onEnded={stopAudio} preload="auto" />

      <div className="max-w-md w-full bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-black">Nivel 2 : Adivina la cancion </h1>
  
            </div>

            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-300 text-center space-y-4">
              <div className="text-4xl"></div>
              <p className="font-bold text-black text-sm">{currentSong.title}</p>
              
              <button
                type="button"
                onClick={togglePlay}
                
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
            </div>

            <form onSubmit={handleGuessSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="name de la songi"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-400 focus:border-black text-black placeholder-slate-500 focus:outline-none text-center font-mono font-bold cursor-text"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-md cursor-pointer"
              >
                Comprobar
              </button>
            </form>

            {feedback && (
              <p className={`text-center font-black text-sm ${feedback.includes('🎉') ? 'text-emerald-600' : 'text-red-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-slate-100 border border-slate-300 p-6 rounded-2xl space-y-3 shadow-inner">
              <h2 className="text-xl font-black text-black">Terminaste el nivel 2 amor</h2>
              <p className="text-xs text-black font-semibold">
                Ahora que terminaste copia estas coordenadas y donde te salga tienes que responder abajo lo que te pregunte.
              </p>
              
              <div className="bg-white p-4 rounded-xl text-black font-mono text-sm sm:text-base font-black tracking-wider border-2 border-slate-400 select-all shadow-sm">
                30.01214177943623, -97.86227193004616
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-300">
              <h3 className="font-bold text-black text-xs uppercase tracking-wide">
                Que me pido en ese lugar?
              </h3>
              
              <input 
                type="text"
                value={pandaInput}
                onChange={(e) => {
                  setPandaInput(e.target.value);
                  if (isUnlocked) setIsUnlocked(false);
                  if (orderFeedback) setOrderFeedback('');
                }}
                className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-black text-black text-center font-mono font-bold focus:outline-none cursor-text"
              />

              {/* Si está validado muestra el Link, si no, el botón de comprobación */}
              {isUnlocked ? (
                <Link 
                  to="/mision3" 
                  className="inline-block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition duration-200 shadow-md text-center"
                >
                  Nivel 3
                </Link>
              ) : (
                <button 
                  type="button"
                  onClick={handlePandaVerify}
                  className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-md cursor-pointer"
                >
                  🔑
                </button>
              )}

              {orderFeedback && (
                <p className={`text-center font-black text-sm mt-2 ${isUnlocked ? 'text-emerald-600' : 'text-red-600'}`}>
                  {orderFeedback}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}