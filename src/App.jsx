import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [showPhoto, setShowPhoto] = useState(true);

  const [amorCount, setAmorCount] = useState(0);
  const [fuegoCount, setFuegoCount] = useState(0);
  const [butterflies, setButterflies] = useState([]);

  const messages = [
    "La mejor polola del mundo ❤️",
    "Mi persona favorita 💕",
    "Te quiero demasiado 🫶",
    "Eres todo para mí 💖",
    "Contigo, cada día es especial 🌟",
    "Eres mi alegría diaria 😊",
    ,"Gracias por ser tú, mi amor 💗"
    ,"Te extraño bb 🥺"
    ,"Te quiero abrazar y no soltar🥺"
    ,"Estoy loco por ti💖 "
    ,"Cada dia que pasa me enamoro mas 💗"
    ,"Ya quiero darte mil besitos 🥰"
    ,"Me cambiaste la vida amor 💕"
    ,"Contigo, todo es mejor 💖"
  ];

  // IMPORTANTE: Asegúrate de que estas fotos existan en tu carpeta /public
  const photos = [
    { src: "/uno.jpeg", tags: "amor nosotros juntos salida" },
    { src: "/dos.jpeg", tags: "cita comida restaurante rico" },
    { src: "/tres.jpeg", tags: "viaje playa vacaciones sol" },
    { src: "/cuatro.jpeg", tags: "sonrisa linda hermosa" },
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setPlaceholderText(messages[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);



  const filteredImages = photos.filter(photo =>
    photo.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  useEffect(() => {
  const targetDate = new Date("2026-07-15T20:30:00-04:00").getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const timerElement = document.getElementById("countdown-timer");
    const messageElement = document.getElementById("arrival-message");

    if (distance < 0) {
      clearInterval(timer);
      if (timerElement) timerElement.classList.add("hidden");
      if (messageElement) messageElement.classList.remove("hidden");
      
      // Lanzar confeti (asegúrate de tener instalada la librería canvas-confetti)
      // npm install canvas-confetti
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerElement) {
      timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);

  return () => clearInterval(timer); 


  useEffect(() => {
  if (showButterfly) {
    const timer = setTimeout(() => {
      setShowButterfly(false);
    }, 32000); // 32 segundos, que es lo que dura tu animación 'flyButterfly'
    return () => clearTimeout(timer);
  }
}, [showButterfly]);

  
}, []);



  return (
    <>

    <div className="relative min-h-screen w-full overflow-hidden">

          <div className="absolute top-5 right-5 flex gap-3 z-50">
      
            <button 
              onClick={() => {
                setAmorCount(amorCount + 1);
                
                const getCoord = (unit) => (Math.floor(Math.random() * 90) - 45) + unit;

                  const randomCoords = {
                    x1: getCoord("vw"),
                    y1: getCoord("vh"),
                    x2: getCoord("vw"),
                    y2: getCoord("vh"),
                  };

                const newId = Date.now();
                // Guardamos la mariposa con sus propias coordenadas
                setButterflies([...butterflies, { id: newId, coords: randomCoords }]);

                setTimeout(() => {
                  setButterflies(prev => prev.filter(b => b.id !== newId));
                }, 32000);
              }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-lg group"
            >
              <span className="text-xl group-hover:animate-pulse">❤️</span>
              <span className="font-bold text-gray-800">{amorCount}</span>
            </button>
            
          </div>

            {butterflies.map((butterfly) => (
            <div 
              key={butterfly.id} 
              className="butterfly"
              style={{
                "--x1": butterfly.coords.x1,
                "--y1": butterfly.coords.y1,
                "--x2": butterfly.coords.x2,
                "--y2": butterfly.coords.y2,
              }}
            >
              <div className="wing left"></div>
              <div className="wing right"></div>
            </div>
          ))}
      <div className="absolute inset-0 grid grid-cols-4 gap-3 -z-10">
          <img className="h-full w-full object-cover" src="/seis.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/cinco.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/tres.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/cuatro.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/uno.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/dos.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/siete.jpeg" alt="" />
          <img className="h-full w-full object-cover" src="/ocho.jpeg" alt="" />
      </div>

    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 animate-fly-plane">
        <div className="relative flex items-center">
          <img src="/pngtree-image-with-airplane-theme-3-message-travel-man-vector-png-image_8792442.jpg" className="h-30 w-auto" alt="Avioncito" />
        </div>
      </div>
    </div>




      <div className="min-h-screen flex flex-col items-center justify-start pt-40 z-10">

        <form 
          className="w-full max-w-2xl mx-auto px-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, "_blank");
            }
          }}
        > 
          <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            
            <input 
              type="search" 
              id="search" 
              className="block w-full p-4 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 shadow-sm outline-none transition-all" 
              placeholder={placeholderText} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required 
            />
            
            <button 
              type="submit" 
              className="text-white absolute end-2.5 bottom-2.5 bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="mt-6 w-full max-w-lg text-center bg-white/75  p-4 rounded-2xl shadow-lg border border-white/20 mx-4">
          <h2 className="text-gray-700 font-medium mb-1 text-sm uppercase tracking-wider">Días para ver a mi novio</h2>
          <div id="countdown-timer" className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            00d 00h 00m 00s
          </div>
          <div id="arrival-message" className="hidden text-xl font-bold text-pink-600 animate-bounce mt-2">
            Agarrate wacha que voy llegando así
          </div>
        </div>

      </div>



    </div>
    </>

  );
}


export default App;