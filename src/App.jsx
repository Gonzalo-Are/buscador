import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [showPhoto, setShowPhoto] = useState(true);

  const [amorCount, setAmorCount] = useState(0);
  const [fuegoCount, setFuegoCount] = useState(0);
  const [butterflies, setButterflies] = useState([]);
  const [showSurprise, setShowSurprise] = useState(false);

  const [isLetterOpen, setIsLetterOpen] = useState(false);

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
  action="https://www.google.com/search" 
  method="GET" 
  target="_blank"
> 
  <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
      </svg>
    </div>
    
    {/* Quitamos 'value' y 'onChange' de React solo para este input. 
      Al dejarlo como un input nativo de HTML con defaultValue y name="q",
      el navegador envía el texto exacto que escribió el usuario directamente a Google.
    */}
    <input 
      type="search" 
      id="search" 
      name="q"
      className="block w-full p-4 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 shadow-sm outline-none transition-all" 
      placeholder={placeholderText} 
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
      
      {!isLetterOpen && (
  <div className="flex justify-center mt-8">
    <button
      onClick={() => setIsLetterOpen(true)}
      className="bg-white/30 backdrop-blur-md border border-white/50 px-6 py-3 rounded-full text-white font-bold hover:bg-white/50 transition-all shadow-xl hover:scale-110 active:scale-95"
    >
      📩
    </button>
  </div>
)}


      </div>

          {isLetterOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div className="relative bg-[#fdf6e3] w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 md:p-12 rounded-sm shadow-2xl border-l-[20px] border-pink-200">
      
      {/* Botón de Cerrar */}
      <button 
        onClick={() => setIsLetterOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors text-2xl"
      >
        ✖
      </button>

      <div className="font-serif text-gray-800 space-y-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-8 italic">Mi amor,</h2>
        
        <p className="leading-relaxed text-lg">
          Te escribo esta cartita para decirte todo lo que te quiero, han pasado muchos meses desde la ultima vez que te vi, y para ser sincero, mi amor y cariño que siento por ti no ha disminiuido nada, literalmente sube cada dia mas. Es impresionante para mi como estas en mi cabeza constantemente y las cosas que provocas en mi, de verdad que no lo entenderias todo lo que yo siento por ti, es mucho mucho mucho muchooooooooooo.
          Ya queda poquito bb, ya nos vamos a ver y prometo estar pegado a ti como un chicle y hacerte la persona mas feliz del mundo, porque te lo mereces corazon.
        </p>

        <p className="leading-relaxed text-lg">

           Siempre te quize escribir una carta, obviamente esta no es la primera, por que esta la estoy escribiendo en un pc, pero cuando llegue para tus brazos te dare una a tu manito solo para ti. Escribo esto por que queria decirte lo mucho que te quiero, enverdad las palabras se quedan cortas, y esta pagina que hice para ti es algo muy lindo que empezo todo como una idea mala en mi cabeza pero termino siendo algo hermoso (como tu) y que cada vez que lo veo sonrio, onda era para ti y termino tambien siendo para mi. Gracias por todo amorcito. 


        </p>
        <div className="pt-10 text-right">
          <p className="italic text-xl">Con todo mi amor,</p>
          <p className="font-bold text-2xl text-pink-600 mt-2">Tu bb ❤️</p>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
    </>

  );
}


export default App;